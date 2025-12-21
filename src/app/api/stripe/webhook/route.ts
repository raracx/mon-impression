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

      console.log(`✅ Order ${order.id} updated to 'paid' status`);

      // Parse order details
      let orderDetails: Record<string, unknown> = {};
      try {
        orderDetails = JSON.parse(order.design_url || "{}");
      } catch (e) {
        console.error("Failed to parse design_url:", e);
      }

      // Extract locale, default to 'en'
      const locale =
        typeof orderDetails.locale === "string" ? orderDetails.locale : "en";

      // Parse delivery information
      let deliveryInfo: Record<string, unknown> | undefined = undefined;
      try {
        if (order.shipping_address) {
          deliveryInfo = JSON.parse(order.shipping_address);
        }
      } catch (e) {
        console.error("Failed to parse delivery info:", e);
      }

      // Check if this is a multi-item order (new format) or single item (legacy)
      if (orderDetails.items && Array.isArray(orderDetails.items)) {
        // New format: multiple items - consolidate all designs
        const allDesigns: Record<string, string> = {};
        const allCustomizedSides: string[] = [];
        const allRawAssets: {
          userUploads: Array<{ id: string; src: string; side: string }>;
          libraryAssets: Array<{ id: string; src: string; side: string }>;
        } = { userUploads: [], libraryAssets: [] };

        let productNames: string[] = [];
        let totalQuantity = 0;

        // Aggregate all items data
        for (
          let itemIndex = 0;
          itemIndex < orderDetails.items.length;
          itemIndex++
        ) {
          const item = orderDetails.items[itemIndex];
          const productName = item.name || "Custom Product";
          productNames.push(`${productName} (x${item.quantity})`);
          totalQuantity += item.quantity || 1;

          if (item.customization) {
            // Get sides with content
            if (
              item.customization.sides &&
              typeof item.customization.sides === "object"
            ) {
              const sides = Object.keys(item.customization.sides).filter(
                (side) =>
                  Array.isArray(item.customization.sides[side]) &&
                  item.customization.sides[side].length > 0,
              );
              sides.forEach((side) => {
                const sideKey = `item${itemIndex + 1}-${side}`;
                if (!allCustomizedSides.includes(sideKey)) {
                  allCustomizedSides.push(sideKey);
                }
              });
            }

            // Get exported designs with item prefix
            if (
              item.customization.designs &&
              typeof item.customization.designs === "object"
            ) {
              Object.entries(item.customization.designs).forEach(
                ([side, dataUrl]) => {
                  allDesigns[`item${itemIndex + 1}-${side}`] =
                    dataUrl as string;
                },
              );
            }

            // Get uploaded assets with their specific side information
            if (
              item.customization.uploadedAssets &&
              Array.isArray(item.customization.uploadedAssets)
            ) {
              const uploads = item.customization.uploadedAssets.map(
                (asset: any, index: number) => ({
                  id: asset.id || `item${itemIndex + 1}-upload-${index}`,
                  src: asset.dataUrl || asset.src || "",
                  side: asset.side
                    ? `item${itemIndex + 1}-${asset.side}`
                    : `item${itemIndex + 1}`,
                }),
              );
              allRawAssets.userUploads.push(...uploads);
              console.log(
                `Item ${itemIndex + 1}: Collected ${uploads.length} user uploads`,
              );
            }

            // Extract library assets from canvas items in sides
            if (
              item.customization.sides &&
              typeof item.customization.sides === "object"
            ) {
              Object.entries(item.customization.sides).forEach(
                ([sideName, canvasItems]: [string, any]) => {
                  if (Array.isArray(canvasItems)) {
                    canvasItems.forEach((canvasItem: any, index: number) => {
                      if (
                        canvasItem.type === "image" &&
                        canvasItem.src &&
                        canvasItem.source === "library"
                      ) {
                        allRawAssets.libraryAssets.push({
                          id:
                            canvasItem.id ||
                            `item${itemIndex + 1}-library-${sideName}-${index}`,
                          src: canvasItem.src,
                          side: `item${itemIndex + 1}-${sideName}`,
                        });
                      }
                    });
                  }
                },
              );
            }
          }
        }

        console.log(
          `Total raw assets collected - User uploads: ${allRawAssets.userUploads.length}, Library assets: ${allRawAssets.libraryAssets.length}`,
        );

        const consolidatedProductName = productNames.join(", ");

        // Prepare detailed items for customer email
        const detailedItems = orderDetails.items.map(
          (item: any, index: number) => {
            const itemSides = Object.keys(item.customization?.sides || {})
              .filter(
                (side) =>
                  Array.isArray(item.customization.sides[side]) &&
                  item.customization.sides[side].length > 0,
              )
              .map((side) => `item${index + 1}-${side}`);

            return {
              name: item.name || "Custom Product",
              quantity: item.quantity || 1,
              price: item.price || 0,
              color: item.customization?.color,
              sides: itemSides,
              designs: item.customization?.designs
                ? Object.fromEntries(
                    Object.entries(item.customization.designs).map(
                      ([side, dataUrl]) => [
                        `item${index + 1}-${side}`,
                        dataUrl as string,
                      ],
                    ),
                  )
                : undefined,
            };
          },
        );

        // Calculate subtotal and delivery fee
        const subtotal = orderDetails.items.reduce(
          (sum: number, item: any) =>
            sum + (item.price || 0) * (item.quantity || 1),
          0,
        );
        const deliveryFee =
          typeof deliveryInfo === "object" && deliveryInfo !== null
            ? (deliveryInfo.price as number) || 0
            : 0;

        // Send single confirmation email to customer
        try {
          await sendOrderConfirmationEmail(order.email, {
            orderId: order.id,
            productName: consolidatedProductName,
            quantity: totalQuantity,
            amount: order.amount,
            customizedSides: allCustomizedSides,
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
            locale: locale as "en" | "fr",
            items: detailedItems,
            subtotal,
            deliveryFee,
          });
          console.log("✅ Customer confirmation email sent to:", order.email);
        } catch (emailError) {
          console.error("❌ Error sending customer email:", emailError);
        }

        // Send single consolidated notification email to admin
        try {
          await sendAdminNotificationEmail({
            orderId: order.id,
            customerEmail: order.email,
            productName: consolidatedProductName,
            quantity: totalQuantity,
            amount: order.amount,
            designs: allDesigns,
            customizedSides: allCustomizedSides,
            rawAssets: allRawAssets,
            size: "",
            color: "",
            paymentStatus: order.status || "paid",
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
            locale: locale as "en" | "fr",
          });
          console.log("✅ Admin notification email sent");
        } catch (emailError) {
          console.error("❌ Error sending admin email:", emailError);
        }
      } else {
        // Legacy format: single item
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
        const rawAssets =
          typeof orderDetails.rawAssets === "object" &&
          orderDetails.rawAssets !== null
            ? (orderDetails.rawAssets as {
                userUploads: Array<{ id: string; src: string; side: string }>;
                libraryAssets: Array<{ id: string; src: string; side: string }>;
              })
            : { userUploads: [], libraryAssets: [] };

        // Build product name
        let productName = `Custom ${productId.replace(/_/g, " ")}`;
        if (size) productName += ` (${size})`;
        if (color) productName += ` - ${color}`;
        if (sidesCount > 1) productName += ` - ${sidesCount} sides`;

        // Prepare detailed item for customer email (legacy format as single item)
        const legacyItem = {
          name: productName,
          quantity,
          price: order.amount / 100,
          color: color || undefined,
          sides: customizedSides,
          designs: Object.keys(designs).length > 0 ? designs : undefined,
        };

        // Calculate delivery fee from deliveryInfo
        const deliveryFee =
          typeof deliveryInfo === "object" && deliveryInfo !== null
            ? (deliveryInfo.price as number) || 0
            : 0;

        // Send confirmation email to customer
        try {
          await sendOrderConfirmationEmail(order.email, {
            orderId: order.id,
            productName,
            quantity,
            amount: order.amount,
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
            locale: locale as "en" | "fr",
            items: [legacyItem],
            subtotal: order.amount / 100 - deliveryFee,
            deliveryFee,
          });
          console.log("✅ Customer confirmation email sent to:", order.email);
        } catch (emailError) {
          console.error("❌ Error sending customer email:", emailError);
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
            rawAssets,
            size,
            color,
            paymentStatus: order.status || "paid",
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
            locale: locale as "en" | "fr",
          });
          console.log("✅ Admin notification email sent");
        } catch (emailError) {
          console.error("❌ Error sending admin email:", emailError);
        }
      }

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
