import nodemailer from "nodemailer";
import {
  OrderConfirmationEmailDetails,
  AdminNotificationEmailDetails,
} from "../types";

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function for order confirmation HTML
function getOrderConfirmationHtml(
  details: OrderConfirmationEmailDetails,
): string {
  const {
    orderId,
    productName,
    quantity,
    amount,
    customizedSides,
    delivery,
    locale,
  } = details;
  const texts =
    locale === "fr"
      ? {
          title: "Commande confirmée ! 🎉",
          thankYou: "Merci pour votre commande personnalisée",
          orderDetails: "Détails de la commande",
          orderIdLabel: "ID de commande :",
          productLabel: "Produit :",
          quantityLabel: "Quantité :",
          customizedSidesLabel: "Côtés personnalisés :",
          totalLabel: "Total :",
          deliveryInfo: "Informations de livraison",
          deliveryTypeLabel: "Type de livraison :",
          pickup: "📦 Ramassage (Gratuit)",
          delivery: "🚚 Livraison",
          deliveryFeeLabel: "Frais de livraison :",
          addressLabel: "Adresse :",
          cityLabel: "Ville :",
          provinceLabel: "Province :",
          postalCodeLabel: "Code postal :",
          countryLabel: "Pays :",
          deliveryNotesLabel: "Notes de livraison :",
          pickupAddressLabel: "Adresse de ramassage :",
          pickupHoursLabel: "Heures de ramassage :",
          processing:
            "Nous traitons votre commande personnalisée et vous informerons une fois qu'elle sera prête",
          forPickup: "pour le ramassage",
          forDelivery: "pour la livraison",
          questions:
            "Si vous avez des questions, n'hésitez pas à nous contacter.",
          automated:
            "Ceci est un email automatisé. Veuillez ne pas répondre à ce message.",
          copyright: "Tous droits réservés.",
          pickupAddressValue:
            "Mon Impression<br>123 Rue Principal<br>Montréal, QC H1A 1A1",
          pickupHoursValue: "Lun-Ven 9h-17h, Sam 10h-16h",
        }
      : {
          title: "Order Confirmed! 🎉",
          thankYou: "Thank you for your custom order",
          orderDetails: "Order Details",
          orderIdLabel: "Order ID:",
          productLabel: "Product:",
          quantityLabel: "Quantity:",
          customizedSidesLabel: "Customized Sides:",
          totalLabel: "Total:",
          deliveryInfo: "Delivery Information",
          deliveryTypeLabel: "Delivery Type:",
          pickup: "📦 Pickup (Free)",
          delivery: "🚚 Delivery",
          deliveryFeeLabel: "Delivery Fee:",
          addressLabel: "Address:",
          cityLabel: "City:",
          provinceLabel: "Province:",
          postalCodeLabel: "Postal Code:",
          countryLabel: "Country:",
          deliveryNotesLabel: "Delivery Notes:",
          pickupAddressLabel: "Pickup Address:",
          pickupHoursLabel: "Pickup Hours:",
          processing:
            "We're processing your custom order and will notify you once it's ready",
          forPickup: "for pickup",
          forDelivery: "for delivery",
          questions:
            "If you have any questions, please don't hesitate to contact us.",
          automated:
            "This is an automated email. Please do not reply to this message.",
          copyright: "All rights reserved.",
          pickupAddressValue:
            "Mon Impression<br>123 Main Street<br>Montreal, QC H1A 1A1",
          pickupHoursValue: "Mon-Fri 9am-5pm, Sat 10am-4pm",
        };
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
      .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
      .detail-label { font-weight: bold; color: #6b7280; }
      .detail-value { color: #1f2937; }
      .total { font-size: 1.25rem; font-weight: bold; color: #1e3a8a; }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.875rem; }
      .button { display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${texts.title}</h1>
        <p>${texts.thankYou}</p>
      </div>
      <div class="content">
        <h2>${texts.orderDetails}</h2>
        <div class="order-details">
          <div class="detail-row">
            <span class="detail-label">${texts.orderIdLabel}</span>
            <span class="detail-value">${orderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.productLabel}</span>
            <span class="detail-value">${productName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.quantityLabel}</span>
            <span class="detail-value">${quantity}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.customizedSidesLabel}</span>
            <span class="detail-value">${customizedSides.join(", ")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.totalLabel}</span>
            <span class="detail-value total">$${(amount / 100).toFixed(2)} CAD</span>
          </div>
        </div>
        <h2 style="margin-top: 30px;">${texts.deliveryInfo}</h2>
        <div class="order-details">
          <div class="detail-row">
            <span class="detail-label">${texts.deliveryTypeLabel}</span>
            <span class="detail-value">${delivery?.type === "pickup" ? texts.pickup : texts.delivery}</span>
          </div>
          ${
            delivery?.type === "delivery"
              ? `
          <div class="detail-row">
            <span class="detail-label">${texts.deliveryFeeLabel}</span>
            <span class="detail-value">$${delivery.price?.toFixed(2) || "15.00"}</span>
          </div>
          `
              : ""
          }
          ${
            delivery?.address
              ? `
          <div class="detail-row">
            <span class="detail-label">${texts.addressLabel}</span>
            <span class="detail-value">${delivery.address.street}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.cityLabel}</span>
            <span class="detail-value">${delivery.address.city}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.provinceLabel}</span>
            <span class="detail-value">${delivery.address.province}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.postalCodeLabel}</span>
            <span class="detail-value">${delivery.address.postalCode}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.countryLabel}</span>
            <span class="detail-value">${delivery.address.country}</span>
          </div>
          ${
            delivery.address.notes
              ? `
          <div class="detail-row">
            <span class="detail-label">${texts.deliveryNotesLabel}</span>
            <span class="detail-value">${delivery.address.notes}</span>
          </div>
          `
              : ""
          }
          `
              : delivery?.type === "pickup"
                ? `
          <div class="detail-row">
            <span class="detail-label">${texts.pickupAddressLabel}</span>
            <span class="detail-value">${texts.pickupAddressValue}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${texts.pickupHoursLabel}</span>
            <span class="detail-value">${texts.pickupHoursValue}</span>
          </div>
          `
                : ""
          }
        </div>
        ${texts.processing} ${delivery?.type === "pickup" ? texts.forPickup : texts.forDelivery}.
        <p>${texts.questions}</p>
      </div>
      <div class="footer">
        <p>${texts.automated}</p>
        <p>&copy; ${new Date().getFullYear()} Custom Products. ${texts.copyright}</p>
      </div>
    </div>
  </body>
</html>
  `;
}

// Helper function for admin notification HTML
function getAdminNotificationHtml(
  details: AdminNotificationEmailDetails,
): string {
  const {
    locale,
    orderId,
    customerEmail,
    productName,
    quantity,
    amount,
    designs,
    customizedSides,
    size,
    color,
    paymentStatus,
    delivery,
  } = details;
  const texts =
    locale === "fr"
      ? {
          title: "🔔 Nouvelle alerte de commande",
          actionRequired: "Action requise :",
          newOrder: "Une nouvelle commande personnalisée doit être traitée.",
          paymentStatusLabel: "Statut de paiement :",
          orderInfo: "Informations de commande",
          orderIdLabel: "ID de commande :",
          customerEmailLabel: "Email du client :",
          productLabel: "Produit :",
          quantityLabel: "Quantité :",
          sizeLabel: "Taille :",
          colorLabel: "Couleur :",
          customizedSidesLabel: "Côtés personnalisés :",
          totalAmountLabel: "Montant total :",
          deliveryInfo: "Informations de livraison",
          deliveryTypeLabel: "Type de livraison :",
          pickup: "📦 Ramassage (Gratuit)",
          delivery: "🚚 Livraison",
          deliveryFeeLabel: "Frais de livraison :",
          addressLabel: "Adresse :",
          cityLabel: "Ville :",
          provinceLabel: "Province :",
          postalCodeLabel: "Code postal :",
          countryLabel: "Pays :",
          deliveryNotesLabel: "Notes de livraison :",
          pickupAddressLabel: "Adresse de ramassage :",
          pickupHoursLabel: "Heures de ramassage :",
          designFiles: "Fichiers de conception",
          finalDesigns:
            "Les conceptions finales rendues sont jointes à cet email :",
          sideLabel: "Côté",
          pickupAddressValue:
            "Mon Impression<br>123 Rue Principal<br>Montréal, QC H1A 1A1",
          pickupHoursValue: "Lun-Ven 9h-17h, Sam 10h-16h",
        }
      : {
          title: "🔔 New Order Alert",
          actionRequired: "Action Required:",
          newOrder: "A new custom order needs to be processed.",
          paymentStatusLabel: "Payment Status:",
          orderInfo: "Order Information",
          orderIdLabel: "Order ID:",
          customerEmailLabel: "Customer Email:",
          productLabel: "Product:",
          quantityLabel: "Quantity:",
          sizeLabel: "Size:",
          colorLabel: "Color:",
          customizedSidesLabel: "Customized Sides:",
          totalAmountLabel: "Total Amount:",
          deliveryInfo: "Delivery Information",
          deliveryTypeLabel: "Delivery Type:",
          pickup: "📦 Pickup (Free)",
          delivery: "🚚 Delivery",
          deliveryFeeLabel: "Delivery Fee:",
          addressLabel: "Address:",
          cityLabel: "City:",
          provinceLabel: "Province:",
          postalCodeLabel: "Postal Code:",
          countryLabel: "Country:",
          deliveryNotesLabel: "Delivery Notes:",
          pickupAddressLabel: "Pickup Address:",
          pickupHoursLabel: "Pickup Hours:",
          designFiles: "Design Files",
          finalDesigns: "Final rendered designs are attached to this email:",
          sideLabel: "Side",
          pickupAddressValue:
            "Mon Impression<br>123 Main Street<br>Montreal, QC H1A 1A1",
          pickupHoursValue: "Mon-Fri 9am-5pm, Sat 10am-4pm",
        };
  // Generate HTML for inline images
  const designImagesHtml = Object.keys(designs)
    .map(
      (side) => `
    <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
      <h4 style="margin: 0 0 10px 0; text-transform: capitalize; color: #1e3a8a;">${texts.sideLabel} ${side}</h4>
      <img src="cid:design-${side}@order" alt="${side} design" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px;" />
    </div>
  `,
    )
    .join("");
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #6b7280; display: inline-block; width: 150px; }
          .detail-value { color: #1f2937; }
          .alert { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${texts.title}</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>${texts.actionRequired}</strong> ${texts.newOrder}
              ${paymentStatus ? `<br><br><strong>${texts.paymentStatusLabel}</strong> <span style="text-transform: capitalize; ${paymentStatus === "succeeded" || paymentStatus === "paid" ? "color: #059669;" : paymentStatus === "pending" ? "color: #d97706;" : "color: #dc2626;"}">${paymentStatus}</span>` : ""}
            </div>
            <h2>${texts.orderInfo}</h2>
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">${texts.orderIdLabel}</span>
                <span class="detail-value">${orderId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.customerEmailLabel}</span>
                <span class="detail-value">${customerEmail}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.productLabel}</span>
                <span class="detail-value">${productName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.quantityLabel}</span>
                <span class="detail-value">${quantity}</span>
              </div>
              ${size ? `<div class="detail-row"><span class="detail-label">${texts.sizeLabel}</span><span class="detail-value">${size}</span></div>` : ""}
              ${color ? `<div class="detail-row"><span class="detail-label">${texts.colorLabel}</span><span class="detail-value">${color}</span></div>` : ""}
              <div class="detail-row">
                <span class="detail-label">${texts.customizedSidesLabel}</span>
                <span class="detail-value">${customizedSides.join(", ")}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.totalAmountLabel}</span>
                <span class="detail-value"><strong>$${(amount / 100).toFixed(2)} CAD</strong></span>
              </div>
              ${paymentStatus ? `<div class="detail-row"><span class="detail-label">${texts.paymentStatusLabel}</span><span class="detail-value" style="text-transform: capitalize; ${paymentStatus === "succeeded" || paymentStatus === "paid" ? "color: #059669; font-weight: bold;" : paymentStatus === "pending" ? "color: #d97706; font-weight: bold;" : "color: #dc2626; font-weight: bold;"}">${paymentStatus}</span></div>` : ""}
            </div>
            <h2>${texts.deliveryInfo}</h2>
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">${texts.deliveryTypeLabel}</span>
                <span class="detail-value">${delivery?.type === "pickup" ? texts.pickup : texts.delivery}</span>
              </div>
              ${
                delivery?.type === "delivery"
                  ? `
              <div class="detail-row">
                <span class="detail-label">${texts.deliveryFeeLabel}</span>
                <span class="detail-value">$${delivery.price?.toFixed(2) || "15.00"}</span>
              </div>
              `
                  : ""
              }
              ${
                delivery?.address
                  ? `
              <div class="detail-row">
                <span class="detail-label">${texts.addressLabel}</span>
                <span class="detail-value">${delivery.address.street}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.cityLabel}</span>
                <span class="detail-value">${delivery.address.city}, ${delivery.address.province}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.postalCodeLabel}</span>
                <span class="detail-value">${delivery.address.postalCode}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.countryLabel}</span>
                <span class="detail-value">${delivery.address.country}</span>
              </div>
              ${
                delivery.address.notes
                  ? `
              <div class="detail-row">
                <span class="detail-label">${texts.deliveryNotesLabel}</span>
                <span class="detail-value">${delivery.address.notes}</span>
              </div>
              `
                  : ""
              }
              `
                  : delivery?.type === "pickup"
                    ? `
              <div class="detail-row">
                <span class="detail-label">${texts.pickupAddressLabel}</span>
                <span class="detail-value">${texts.pickupAddressValue}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">${texts.pickupHoursLabel}</span>
                <span class="detail-value">${texts.pickupHoursValue}</span>
              </div>
              `
                    : ""
              }
            </div>
            <h2 style="margin-top: 30px;">${texts.designFiles}</h2>
            <div class="order-details">
              <p style="margin-bottom: 15px;">${texts.finalDesigns}</p>
              ${designImagesHtml}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Email templates
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: OrderConfirmationEmailDetails,
) {
  const {
    orderId,
    productName,
    quantity,
    amount,
    customizedSides,
    delivery,
    locale,
  } = orderDetails;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject:
      locale === "fr"
        ? `Confirmation de commande - ${orderId}`
        : `Order Confirmation - ${orderId}`,
    html: getOrderConfirmationHtml(orderDetails),
  };

  return transporter.sendMail(mailOptions);
}

export async function sendAdminNotificationEmail(
  orderDetails: AdminNotificationEmailDetails,
) {
  const {
    orderId,
    customerEmail,
    productName,
    quantity,
    amount,
    designs,
    customizedSides,
    rawAssets,
    size,
    color,
    paymentStatus,
    delivery,
    locale,
  } = orderDetails;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL environment variable is not set");
    throw new Error("ADMIN_EMAIL is required for admin notifications");
  }

  // Convert data URLs to attachments
  const attachments = Object.entries(designs)
    .map(([side, dataUrl]) => {
      // Extract base64 data from data URL
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        console.warn(`Invalid data URL for side: ${side}`);
        return null;
      }

      const [, contentType, base64Data] = matches;

      return {
        filename: `${orderId}-${side}.png`,
        content: Buffer.from(base64Data, "base64"),
        contentType: contentType,
        cid: `design-${side}@order`, // Content ID for inline embedding
      };
    })
    .filter((item) => item !== null) as Array<{
    filename: string;
    content: Buffer;
    contentType: string;
    cid: string;
  }>;

  // Convert raw assets to attachments
  const rawAssetAttachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }> = [];

  // Add user uploads with clear naming
  if (rawAssets?.userUploads) {
    for (let index = 0; index < rawAssets.userUploads.length; index++) {
      const asset = rawAssets.userUploads[index];
      const matches = asset.src.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const [, contentType, base64Data] = matches;
        rawAssetAttachments.push({
          filename: `USER-UPLOAD-${index + 1}-${asset.side}.png`,
          content: Buffer.from(base64Data, "base64"),
          contentType: contentType,
        });
      }
    }
  }

  // Add library assets with clear naming
  if (rawAssets?.libraryAssets) {
    for (let index = 0; index < rawAssets.libraryAssets.length; index++) {
      const asset = rawAssets.libraryAssets[index];

      // Handle data URLs
      if (asset.src.startsWith("data:")) {
        const matches = asset.src.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const [, contentType, base64Data] = matches;
          rawAssetAttachments.push({
            filename: `LIBRARY-ASSET-${index + 1}-${asset.side}.png`,
            content: Buffer.from(base64Data, "base64"),
            contentType: contentType,
          });
        }
      } else {
        // Handle file paths and URLs
        try {
          // If it's a local path (starts with /), fetch from the file system
          if (asset.src.startsWith("/")) {
            const fs = await import("fs/promises");
            const path = await import("path");
            const publicPath = path.join(process.cwd(), "public", asset.src);
            try {
              const fileBuffer = await fs.readFile(publicPath);
              const ext = path.extname(asset.src).toLowerCase();
              const contentType =
                ext === ".svg"
                  ? "image/svg+xml"
                  : ext === ".png"
                    ? "image/png"
                    : ext === ".jpg" || ext === ".jpeg"
                      ? "image/jpeg"
                      : "application/octet-stream";
              rawAssetAttachments.push({
                filename: `LIBRARY-ASSET-${index + 1}-${asset.side}${ext}`,
                content: fileBuffer,
                contentType: contentType,
              });
            } catch (fileError) {
              console.warn(
                `Could not read library asset file: ${publicPath}`,
                fileError,
              );
            }
          } else if (asset.src.startsWith("http")) {
            // Handle external URLs by fetching them
            const response = await fetch(asset.src);
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const contentType =
                response.headers.get("content-type") || "image/png";
              const ext = contentType.includes("svg") ? ".svg" : ".png";
              rawAssetAttachments.push({
                filename: `LIBRARY-ASSET-${index + 1}-${asset.side}${ext}`,
                content: buffer,
                contentType: contentType,
              });
            }
          }
        } catch (error) {
          console.warn(`Could not fetch library asset: ${asset.src}`, error);
        }
      }
    }
  }

  // Raw assets are attached to email, no need for detailed HTML breakdown

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject:
      locale === "fr"
        ? `Nouvelle commande reçue - ${orderId}`
        : `New Order Received - ${orderId}`,
    html: getAdminNotificationHtml(orderDetails),
    attachments: [...attachments, ...rawAssetAttachments],
  };

  return transporter.sendMail(mailOptions);
}
