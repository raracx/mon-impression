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
    let orderDetails: Record<string, unknown> = {};
    try {
      orderDetails = JSON.parse(order.design_url || "{}");
    } catch (e) {
      console.error("Failed to parse design_url:", e);
    }

    // Parse delivery info
    let deliveryInfo: Record<string, unknown> = { type: "pickup", price: 0 };
    try {
      if (order.shipping_address) {
        deliveryInfo = JSON.parse(order.shipping_address);
      }
    } catch (e) {
      console.error("Failed to parse delivery info:", e);
    }

    const productId =
      typeof orderDetails.productId === "string"
        ? orderDetails.productId
        : "product";

    const size = typeof orderDetails.size === "string" ? orderDetails.size : "";
    const color =
      typeof orderDetails.color === "string" ? orderDetails.color : "";
    const sidesCount =
      typeof orderDetails.sidesCount === "number" ? orderDetails.sidesCount : 1;

    // Build descriptive product name
    let productName = `Custom ${productId.replace(/_/g, " ")}`;
    if (size) productName += ` (${size})`;
    if (color) productName += ` - ${color}`;
    if (sidesCount > 1) productName += ` - ${sidesCount} sides`;

    // Build product description with delivery info
    let description = `Customized ${productId} with ${sidesCount} side(s)`;
    if (deliveryInfo.type === "pickup") {
      description += " | Pickup (Free)";
    } else {
      const deliveryPrice =
        typeof deliveryInfo.price === "number" ? deliveryInfo.price : 15;
      description += ` | Delivery ($${deliveryPrice.toFixed(2)})`;
      if (
        deliveryInfo.address &&
        typeof deliveryInfo.address === "object" &&
        deliveryInfo.address !== null
      ) {
        const address = deliveryInfo.address as Record<string, unknown>;
        if (typeof address.city === "string") {
          description += ` to ${address.city}`;
        }
      }
    }

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
              description: description,
            },
            unit_amount: Math.round(
              amount /
                (typeof orderDetails.quantity === "number"
                  ? orderDetails.quantity
                  : 1),
            ),
          },
          quantity:
            typeof orderDetails.quantity === "number"
              ? orderDetails.quantity
              : 1,
        },
      ],
      metadata: { orderId },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
