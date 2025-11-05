import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId, productId } = await req.json();
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("slug", productId)
      .single();
    const amount = product?.price ?? 2500;
    const name = product?.name ?? "Produit personnalisé";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/product/${productId}/personnaliser`,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: { name },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId },
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
