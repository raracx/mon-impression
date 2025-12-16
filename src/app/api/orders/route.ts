import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { calculatePrice, ProductId } from "@/lib/product-pricing";
import { DELIVERY_CONFIG } from "@/data/catalog";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}

const orderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  email: z.string().email("Valid email is required"),
  designs: z.record(z.string()), // { front: "data:image...", back: "data:image..." }
  customizedSides: z.array(z.string()).optional(),
  size: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  color: z.string().optional(),
  selectedTariff: z.enum(["oneSide", "twoSides", "fullPrint"]).optional(),
  sidesCount: z.number().int().positive().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  delivery: z.object({
    type: z.enum(["delivery", "pickup"]),
    address: z
      .object({
        street: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        province: z.string().min(1, "Province is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
        notes: z.string().optional(),
      })
      .optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validationResult = orderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      productId,
      email,
      designs,
      customizedSides,
      size,
      quantity,
      color,
      selectedTariff,
      sidesCount,
      description,
      name,
      delivery,
    } = validationResult.data;

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase non configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
        },
        { status: 500 },
      );
    }

    // Calculate product price on backend for security
    const productPrice = calculatePrice({
      productId: productId as ProductId,
      selectedTariff,
      selectedSize: size,
      customizedSidesCount: sidesCount || customizedSides?.length || 1,
      quantity: quantity || 1,
    });

    // Calculate delivery price
    let deliveryPrice = 0;
    if (delivery.type === "delivery") {
      // Check if order qualifies for free shipping
      if (productPrice < DELIVERY_CONFIG.freeShippingThreshold) {
        deliveryPrice = DELIVERY_CONFIG.standardPrice;
      }
    }
    // Pickup is always free

    const totalAmount = productPrice + deliveryPrice;
    const amount = Math.round(totalAmount * 100); // Convert to cents

    // Create comprehensive design data
    const designData = JSON.stringify({
      designs,
      customizedSides: customizedSides || ["front"],
      sidesCount: sidesCount || 1,
      // Product details
      productId,
      size: size || "",
      quantity: quantity || 1,
      color: color || "black",
      // Legacy fields
      description: description || "",
      name: name || "",
    });

    // Create delivery data
    const deliveryData = JSON.stringify({
      type: delivery.type,
      price: deliveryPrice,
      address: delivery.address || null,
      productPrice,
      totalAmount,
    });

    const { data, error } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        email,
        amount,
        currency: "cad",
        design_url: designData,
        shipping_address: deliveryData,
      })
      .select("id, amount")
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orderId: data.id, amount: data.amount });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur serveur" },
      { status: 500 },
    );
  }
}
