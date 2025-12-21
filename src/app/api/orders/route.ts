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
  email: z.string().email("Valid email is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      customization: z
        .object({
          color: z.string(),
          sides: z.record(z.array(z.any())), // Record<string, CanvasItem[]>
          uploadedAssets: z.array(z.any()).optional(),
          designs: z.record(z.string()).optional(), // { front: "data:image...", back: "data:image..." }
        })
        .optional(),
    }),
  ),
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

    const { email, items, delivery } = validationResult.data;

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

    // Calculate subtotal from items
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Calculate delivery price
    let deliveryPrice = 0;
    if (delivery.type === "delivery") {
      // Check if order qualifies for free shipping
      if (subtotal < DELIVERY_CONFIG.freeShippingThreshold) {
        deliveryPrice = DELIVERY_CONFIG.standardPrice;
      }
    }
    // Pickup is always free

    // Calculate taxes (Quebec rates)
    const gst = subtotal * 0.05; // GST 5%
    const qst = subtotal * 0.09975; // QST 9.975%
    const tax = gst + qst;

    const totalAmount = subtotal + deliveryPrice + tax;
    const amount = Math.round(totalAmount * 100); // Convert to cents

    // Create comprehensive design data
    const designData = JSON.stringify({
      items,
      delivery: {
        type: delivery.type,
        price: deliveryPrice,
        address: delivery.address || null,
      },
      taxes: {
        gst,
        qst,
        total: tax,
      },
      subtotal,
      totalAmount,
    });

    // Create delivery data
    const deliveryData = JSON.stringify({
      type: delivery.type,
      price: deliveryPrice,
      address: delivery.address || null,
      taxes: {
        gst,
        qst,
        total: tax,
      },
      subtotal,
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
