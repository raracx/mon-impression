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

      // Send confirmation emails (existing logic continues...)
      // ... rest of the checkout.session.completed logic

      return NextResponse.json({
        received: true,
        orderId: order.id,
        status: "paid",
      });
    } catch (error: unknown) {
      console.error("Error processing checkout.session.completed:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 },
      );
    }
  }

  // Handle checkout.session.expired event
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        // Update order status to 'expired' or 'cancelled'
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "expired" })
          .eq("id", orderId);

        if (updateError) {
          console.error("Error updating expired order:", updateError);
        } else {
          console.log(`Order ${orderId} marked as expired`);
        }
      } catch (error: unknown) {
        console.error("Error processing checkout.session.expired:", error);
      }
    }

    return NextResponse.json({ received: true });
  }

  // Handle checkout.session.async_payment_failed event
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        // Update order status to 'failed'
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", orderId);

        if (updateError) {
          console.error("Error updating failed order:", updateError);
        } else {
          console.log(`Order ${orderId} marked as failed due to async payment failure`);
        }
      } catch (error: unknown) {
        console.error("Error processing checkout.session.async_payment_failed:", error);
      }
    }

    return NextResponse.json({ received: true });
  }

  // Handle other event types if needed
  console.log(`Unhandled event type: ${event.type}`);
  return NextResponse.json({ received: true });
}
