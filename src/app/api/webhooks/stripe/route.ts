import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export const config = { api: { bodyParser: false } } as any;

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  try {
    const event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig,
      webhookSecret,
    );
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      const email = session.customer_details?.email || "";
      const amount = session.amount_total || 0;
      const orderId = session.metadata?.orderId as string | undefined;
      if (orderId) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            email,
            amount,
            currency: session.currency || "cad",
          })
          .eq("id", orderId);
      } else {
        await supabase
          .from("orders")
          .insert({
            status: "paid",
            email,
            amount,
            currency: session.currency || "cad",
          });
      }

      if (process.env.RESEND_API_KEY && email) {
        // Fetch order details
        let orderDetails = null;
        if (orderId) {
          const { data: order } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();
          orderDetails = order;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        let html = `<p>Merci pour votre achat! Nous avons bien reçu votre commande.</p>`;
        let attachments = [];

        if (orderDetails && orderDetails.design_url) {
          try {
            let designData;
            if (orderDetails.design_url.startsWith("data:image/")) {
              // Old format: just the image data URL
              designData = { image: orderDetails.design_url };
            } else {
              // New format: JSON with details
              designData = JSON.parse(orderDetails.design_url);
            }
            html += `
              <h2>Détails de la commande</h2>
              <p><strong>Nom:</strong> ${designData.name || "N/A"}</p>
              <p><strong>Taille:</strong> ${designData.size || "N/A"}</p>
              <p><strong>Description:</strong> ${designData.description || "N/A"}</p>
              <p><strong>Montant:</strong> ${(amount / 100).toFixed(2)} ${session.currency?.toUpperCase() || "CAD"}</p>
            `;

            if (
              designData.image &&
              designData.image.startsWith("data:image/")
            ) {
              // Convert data URL to buffer for attachment
              const base64Data = designData.image.split(",")[1];
              const buffer = Buffer.from(base64Data, "base64");
              const mimeType = designData.image.split(";")[0].split(":")[1];
              const extension = mimeType.split("/")[1];

              attachments.push({
                filename: `design.${extension}`,
                content: buffer,
                content_type: mimeType,
              });

              html += `<p>Votre image personnalisée est jointe à cet email.</p>`;
            }
          } catch (e) {
            console.error("Error parsing design data:", e);
          }
        }

        await resend.emails.send({
          from: "monimpression <no-reply@monimpression.dev>",
          to: email,
          subject: "Merci pour votre commande — monimpression",
          html,
          attachments: attachments as any,
        });
      }
    }
    return new Response("ok");
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
