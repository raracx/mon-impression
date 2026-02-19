import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const balance = await stripe.balance.retrieve();
    return NextResponse.json({
      connected: true,
      currency: balance.available[0]?.currency ?? "cad",
      mode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
        ? "live"
        : "test",
    });
  } catch (e: unknown) {
    return NextResponse.json({
      connected: false,
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
}
