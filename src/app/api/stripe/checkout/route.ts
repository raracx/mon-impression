import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId, cancel_url } = await req.json();
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const amount = order.amount ?? 2500;

    // Parse design_url to get order details
    let orderDetails: any = {};
    try {
      orderDetails = JSON.parse(order.design_url || "{}");
    } catch (e) {
      console.error("Failed to parse design_url:", e);
    }

    const productId = orderDetails.productId || "product";
    const quantity = orderDetails.quantity || 1;
    const size = orderDetails.size || "";
    const color = orderDetails.color || "";
    const sidesCount = orderDetails.sidesCount || 1;

    // Build descriptive product name
    let productName = `Custom ${productId.replace(/_/g, " ")}`;
    if (size) productName += ` (${size})`;
    if (color) productName += ` - ${color}`;
    if (sidesCount > 1) productName += ` - ${sidesCount} sides`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.nextUrl.origin}/personnaliser`,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: productName,
              description: `Customized ${productId} with ${sidesCount} side(s)`,
            },
            unit_amount: Math.round(amount / quantity),
          },
          quantity: quantity,
        },
      ],
      metadata: { orderId },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
