import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/nodemailer";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("No orderId in session metadata");
      return NextResponse.json(
        { error: "No orderId in metadata" },
        { status: 400 },
      );
    }

    try {
      // Update order status to 'paid'
      const { data: order, error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)
        .select("*")
        .single();

      if (updateError) {
        console.error("Error updating order:", updateError);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 },
        );
      }

      // Parse order details
      let orderDetails: Record<string, unknown> = {};
      try {
        orderDetails = JSON.parse(order.design_url || "{}");
      } catch (e) {
        console.error("Failed to parse design_url:", e);
      }

      // Parse delivery information
      let deliveryInfo: Record<string, unknown> | undefined = undefined;
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
      const quantity =
        typeof orderDetails.quantity === "number" ? orderDetails.quantity : 1;
      const size =
        typeof orderDetails.size === "string" ? orderDetails.size : "";
      const color =
        typeof orderDetails.color === "string" ? orderDetails.color : "";
      const sidesCount =
        typeof orderDetails.sidesCount === "number"
          ? orderDetails.sidesCount
          : 1;
      const customizedSides = Array.isArray(orderDetails.customizedSides)
        ? orderDetails.customizedSides
        : ["front"];
      const designs =
        typeof orderDetails.designs === "object" &&
        orderDetails.designs !== null
          ? (orderDetails.designs as Record<string, string>)
          : {};

      // Build product name
      let productName = `Custom ${productId.replace(/_/g, " ")}`;
      if (size) productName += ` (${size})`;
      if (color) productName += ` - ${color}`;
      if (sidesCount > 1) productName += ` - ${sidesCount} sides`;

      // Send confirmation email to customer
      try {
        await sendOrderConfirmationEmail(order.email, {
          orderId: order.id,
          productName,
          quantity,
          amount: order.amount,
          designs,
          customizedSides,
          delivery: deliveryInfo as {
            type: "pickup" | "delivery";
            price: number;
            address?: {
              street: string;
              city: string;
              province: string;
              postalCode: string;
              country: string;
              notes?: string;
            };
          },
        });
        console.log("Customer confirmation email sent to:", order.email);
      } catch (emailError) {
        console.error("Error sending customer email:", emailError);
        // Don't fail the webhook if email fails
      }

      // Send notification email to admin
      try {
        await sendAdminNotificationEmail({
          orderId: order.id,
          customerEmail: order.email,
          productName,
          quantity,
          amount: order.amount,
          designs,
          customizedSides,
          size,
          color,
          delivery: deliveryInfo as {
            type: "pickup" | "delivery";
            price: number;
            address?: {
              street: string;
              city: string;
              province: string;
              postalCode: string;
              country: string;
              notes?: string;
            };
          },
        });
        console.log("Admin notification email sent");
      } catch (emailError) {
        console.error("Error sending admin email:", emailError);
        // Don't fail the webhook if email fails
      }

      return NextResponse.json({
        received: true,
        orderId: order.id,
        status: "paid",
      });
    } catch (error: unknown) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 },
      );
    }
  }

  // Handle other event types if needed
  console.log(`Unhandled event type: ${event.type}`);
  return NextResponse.json({ received: true });
}
