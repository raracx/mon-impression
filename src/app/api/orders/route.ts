import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function POST(req: NextRequest) {
  try {
    const { 
      productId, 
      email, 
      design,  // Legacy support - single design
      designs, // New - multiple designs per side
      customizedSides,
      size, 
      quantity,
      color,
      price,
      sidesCount,
      description, 
      name 
    } = await req.json();
    
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase non configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
        },
        { status: 500 }
      );
    }
    
    // Support both old (design) and new (designs) format
    if (!email || !productId || (!design && !designs)) {
      return NextResponse.json(
        { error: "Champs manquants: email, productId, design/designs" },
        { status: 400 }
      );
    }

    // Use provided price or fallback to database/default
    let amount = price ? Math.round(price * 100) : null; // Convert to cents
    
    if (!amount) {
      const { data: product, error: productErr } = await supabase
        .from("products")
        .select("*")
        .eq("slug", productId)
        .maybeSingle();
      if (productErr && productErr.message) {
        console.warn("Supabase products error:", productErr.message);
      }
      amount = product?.price ?? 2500;
    }

    // Create comprehensive design data
    const designData = JSON.stringify({
      // New multi-side format
      designs: designs || { front: design }, // If old format, convert to new
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

    const { data, error } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        email,
        amount,
        currency: "cad",
        design_url: designData,
      })
      .select("id, amount")
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orderId: data.id, amount: data.amount });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}
