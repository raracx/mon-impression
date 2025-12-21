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

    // Parse design_url to get order details (includes tax info)
    let orderDetails: Record<string, unknown> = {};
    let taxInfo: { gst: number; qst: number; total: number } = {
      gst: 0,
      qst: 0,
      total: 0,
    };
    try {
      orderDetails = JSON.parse(order.design_url || "{}");
      // Extract tax information if available
      if (
        orderDetails.taxes &&
        typeof orderDetails.taxes === "object" &&
        orderDetails.taxes !== null
      ) {
        const taxes = orderDetails.taxes as Record<string, unknown>;
        taxInfo = {
          gst: typeof taxes.gst === "number" ? taxes.gst : 0,
          qst: typeof taxes.qst === "number" ? taxes.qst : 0,
          total: typeof taxes.total === "number" ? taxes.total : 0,
        };
      }
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

    let line_items: any[] = [];

    if (orderDetails.items && Array.isArray(orderDetails.items)) {
      // Multiple items - new cart format
      line_items = orderDetails.items.map((item: any) => {
        let description = `Customized ${item.productId}`;

        // Add color info
        if (item.customization?.color) {
          description += ` - ${item.customization.color}`;
        }

        // Count sides with designs
        let sidesCount = 0;
        if (
          item.customization?.sides &&
          typeof item.customization.sides === "object"
        ) {
          sidesCount = Object.keys(item.customization.sides).filter(
            (side) =>
              Array.isArray(item.customization.sides[side]) &&
              item.customization.sides[side].length > 0,
          ).length;
        } else if (
          item.customization?.designs &&
          typeof item.customization.designs === "object"
        ) {
          sidesCount = Object.keys(item.customization.designs).length;
        }

        if (sidesCount > 1) {
          description += ` - ${sidesCount} sides`;
        }

        // Add delivery info
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

        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: item.name,
              description: description,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });
    } else {
      // Fallback to single item (legacy)
      const productId =
        typeof orderDetails.productId === "string"
          ? orderDetails.productId
          : "product";

      const size =
        typeof orderDetails.size === "string" ? orderDetails.size : "";
      const color =
        typeof orderDetails.color === "string" ? orderDetails.color : "";
      const sidesCount =
        typeof orderDetails.sidesCount === "number"
          ? orderDetails.sidesCount
          : 1;

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

      line_items = [
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
      ];
    }

    // Add delivery fee line item if applicable
    const deliveryPrice =
      typeof deliveryInfo.price === "number" ? deliveryInfo.price : 0;
    if (deliveryPrice > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "🚚 Delivery",
            description:
              deliveryInfo.address && typeof deliveryInfo.address === "object"
                ? `Delivery to ${(deliveryInfo.address as any).city || "your address"}`
                : "Standard delivery",
          },
          unit_amount: Math.round(deliveryPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add tax line items if taxes are present
    if (taxInfo.total > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "GST (5%)",
            description: "Goods and Services Tax",
          },
          unit_amount: Math.round(taxInfo.gst * 100),
        },
        quantity: 1,
      });

      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "QST (9.975%)",
            description: "Quebec Sales Tax",
          },
          unit_amount: Math.round(taxInfo.qst * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.nextUrl.origin}/cart`,
      line_items,
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
