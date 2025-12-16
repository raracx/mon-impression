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
    items,
    subtotal,
    deliveryFee,
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
          numberOfDesigns: "Nombre de designs :",
          totalLabel: "Total :",
          itemsLabel: "Articles commandés :",
          itemLabel: "Article",
          priceLabel: "Prix :",
          colorLabel: "Couleur :",
          sidesLabel: "Côtés :",
          designPreviewsLabel: "Aperçus des designs :",
          subtotalLabel: "Sous-total :",
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
          numberOfDesigns: "Number of Designs:",
          totalLabel: "Total:",
          itemsLabel: "Ordered Items:",
          itemLabel: "Item",
          priceLabel: "Price:",
          colorLabel: "Color:",
          sidesLabel: "Sides:",
          designPreviewsLabel: "Design Previews:",
          subtotalLabel: "Subtotal:",
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
      .item-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
      .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
      .item-title { font-size: 1.1rem; font-weight: bold; color: #1e3a8a; }
      .item-price { font-size: 1.1rem; font-weight: bold; color: #059669; }
      .item-details { font-size: 0.9rem; color: #6b7280; margin: 5px 0; }
      .design-previews { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 15px; }
      .design-preview { text-align: center; }
      .design-preview img { max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; }
      .design-label { font-size: 0.85rem; color: #6b7280; margin-top: 5px; text-transform: capitalize; }
      .summary-section { background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin-top: 20px; }
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
            <span class="detail-value"><strong>${orderId}</strong></span>
          </div>
        </div>

        ${
          items && items.length > 0
            ? `
        <h2 style="margin-top: 30px;">${texts.itemsLabel}</h2>
        ${items
          .map(
            (item, index) => `
          <div class="item-card">
            <div class="item-header">
              <span class="item-title">${texts.itemLabel} ${index + 1}: ${item.name}</span>
              <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="item-details">
              <strong>${texts.quantityLabel}</strong> ${item.quantity}
            </div>
            ${
              item.color
                ? `
            <div class="item-details">
              <strong>${texts.colorLabel}</strong> <span style="text-transform: capitalize;">${item.color}</span>
            </div>
            `
                : ""
            }
            <div class="item-details">
              <strong>${texts.sidesLabel}</strong> ${item.sides.map((s) => s.replace(/item\d+-/, "").toUpperCase()).join(", ")}
            </div>
            ${
              item.designs && Object.keys(item.designs).length > 0
                ? `
            <div style="margin-top: 15px;">
              <strong style="color: #1e3a8a;">${texts.designPreviewsLabel}</strong>
              <div class="design-previews">
                ${Object.entries(item.designs)
                  .map(
                    ([side, dataUrl]) => `
                  <div class="design-preview">
                    <img src="cid:design-${side}@order" alt="${side}" />
                    <div class="design-label">${side.replace(/item\d+-/, "")}</div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }
          </div>
        `,
          )
          .join("")}
        `
            : `
        <div class="order-details">
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
            <span class="detail-label">${texts.numberOfDesigns}</span>
            <span class="detail-value"><strong>${customizedSides.length}</strong></span>
          </div>
        </div>
        `
        }

        <div class="summary-section">
          ${
            subtotal !== undefined
              ? `
          <div class="detail-row" style="border: none;">
            <span class="detail-label">${texts.subtotalLabel}</span>
            <span class="detail-value"><strong>$${subtotal.toFixed(2)} CAD</strong></span>
          </div>
          `
              : ""
          }
          ${
            deliveryFee !== undefined && deliveryFee > 0
              ? `
          <div class="detail-row" style="border: none;">
            <span class="detail-label">${texts.deliveryFeeLabel}</span>
            <span class="detail-value"><strong>$${deliveryFee.toFixed(2)} CAD</strong></span>
          </div>
          `
              : ""
          }
          <div class="detail-row" style="border: none;">
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
    rawAssets,
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
          designDetailsLabel: "Détails des designs :",
          numberOfDesigns: "Nombre de designs :",
          designsIncluded: "Designs inclus :",
          rawAssetsTitle: "Fichiers bruts joints",
          userUploadsLabel: "Téléchargements utilisateur :",
          libraryAssetsLabel: "Assets de bibliothèque :",
          rawAssetsNote:
            "Tous les fichiers de conception et les uploads utilisateur sont joints à cet email pour traitement.",
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
          designDetailsLabel: "Design Details:",
          numberOfDesigns: "Number of Designs:",
          designsIncluded: "Designs Included:",
          rawAssetsTitle: "Raw Files Attached",
          userUploadsLabel: "User Uploads:",
          libraryAssetsLabel: "Library Assets:",
          rawAssetsNote:
            "All design files and user uploads are attached to this email for processing.",
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
                <span class="detail-label">${texts.numberOfDesigns}</span>
                <span class="detail-value"><strong>${Object.keys(designs).length}</strong> ${texts.designsIncluded}</span>
              </div>
              ${
                Object.keys(designs).length > 0
                  ? `
              <div class="detail-row">
                <span class="detail-label">${texts.designDetailsLabel}</span>
                <span class="detail-value">
                  <ul style="margin: 5px 0; padding-left: 20px; list-style-type: disc;">
                    ${Object.keys(designs)
                      .map(
                        (side) =>
                          `<li style="text-transform: capitalize;">${side.replace(/-/g, " ")}</li>`,
                      )
                      .join("")}
                  </ul>
                </span>
              </div>
              `
                  : ""
              }
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
            ${
              rawAssets &&
              (rawAssets.userUploads?.length > 0 ||
                rawAssets.libraryAssets?.length > 0)
                ? `
            <h2 style="margin-top: 30px;">${texts.rawAssetsTitle}</h2>
            <div class="order-details">
              <p style="margin-bottom: 15px; color: #059669; font-weight: bold;">
                📎 ${texts.rawAssetsNote}
              </p>
              ${
                rawAssets.userUploads?.length > 0
                  ? `
              <div style="margin: 15px 0;">
                <h4 style="margin: 10px 0; color: #1e3a8a;">${texts.userUploadsLabel}</h4>
                <ul style="margin: 5px 0; padding-left: 20px; list-style-type: disc;">
                  ${rawAssets.userUploads
                    .map(
                      (asset, index) =>
                        `<li>USER-UPLOAD-${index + 1}-${asset.side} (from ${asset.side.replace(/item\d+-/, "").toUpperCase()} side)</li>`,
                    )
                    .join("")}
                </ul>
              </div>
              `
                  : ""
              }
              ${
                rawAssets.libraryAssets?.length > 0
                  ? `
              <div style="margin: 15px 0;">
                <h4 style="margin: 10px 0; color: #1e3a8a;">${texts.libraryAssetsLabel}</h4>
                <ul style="margin: 5px 0; padding-left: 20px; list-style-type: disc;">
                  ${rawAssets.libraryAssets
                    .map(
                      (asset, index) =>
                        `<li>LIBRARY-ASSET-${index + 1}-${asset.side} (from ${asset.side.replace(/item\d+-/, "").toUpperCase()} side)</li>`,
                    )
                    .join("")}
                </ul>
              </div>
              `
                  : ""
              }
            </div>
            `
                : ""
            }
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
    items,
  } = orderDetails;

  // Prepare attachments for design previews
  const attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
    cid: string;
  }> = [];

  // Add design images as inline attachments if items with designs exist
  if (items && items.length > 0) {
    items.forEach((item) => {
      if (item.designs) {
        Object.entries(item.designs).forEach(([side, dataUrl]) => {
          const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const [, contentType, base64Data] = matches;
            attachments.push({
              filename: `${side}.png`,
              content: Buffer.from(base64Data, "base64"),
              contentType: contentType,
              cid: `design-${side}@order`,
            });
          }
        });
      }
    });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject:
      locale === "fr"
        ? `Confirmation de commande - ${orderId}`
        : `Order Confirmation - ${orderId}`,
    html: getOrderConfirmationHtml(orderDetails),
    attachments: attachments.length > 0 ? attachments : undefined,
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

  // Add user uploads with clear naming including side information
  if (rawAssets?.userUploads) {
    console.log(
      `Processing ${rawAssets.userUploads.length} user uploads for email attachments`,
    );
    for (let index = 0; index < rawAssets.userUploads.length; index++) {
      const asset = rawAssets.userUploads[index];
      console.log(
        `User upload ${index + 1}: src length = ${asset.src?.length || 0}, side = ${asset.side}`,
      );
      const matches = asset.src.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const [, contentType, base64Data] = matches;
        // Use actual side name from asset (e.g., "item1-front" or "item2-back")
        const extension = contentType.includes("png")
          ? ".png"
          : contentType.includes("jpeg")
            ? ".jpg"
            : ".png";
        rawAssetAttachments.push({
          filename: `USER-UPLOAD-${index + 1}-${asset.side}${extension}`,
          content: Buffer.from(base64Data, "base64"),
          contentType: contentType,
        });
        console.log(
          `Added user upload attachment: USER-UPLOAD-${index + 1}-${asset.side}${extension}`,
        );
      } else {
        console.warn(
          `User upload ${index + 1} does not match data URL pattern`,
        );
      }
    }
  }

  // Add library assets with clear naming including side information
  if (rawAssets?.libraryAssets) {
    console.log(
      `Processing ${rawAssets.libraryAssets.length} library assets for email attachments`,
    );
    for (let index = 0; index < rawAssets.libraryAssets.length; index++) {
      const asset = rawAssets.libraryAssets[index];
      console.log(
        `Library asset ${index + 1}: src = ${asset.src}, side = ${asset.side}`,
      );

      // Handle data URLs
      if (asset.src.startsWith("data:")) {
        const matches = asset.src.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const [, contentType, base64Data] = matches;
          const extension = contentType.includes("png")
            ? ".png"
            : contentType.includes("jpeg")
              ? ".jpg"
              : ".png";
          rawAssetAttachments.push({
            filename: `LIBRARY-ASSET-${index + 1}-${asset.side}${extension}`,
            content: Buffer.from(base64Data, "base64"),
            contentType: contentType,
          });
          console.log(
            `Added library asset attachment (data URL): LIBRARY-ASSET-${index + 1}-${asset.side}${extension}`,
          );
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
              console.log(
                `Added library asset attachment (file): LIBRARY-ASSET-${index + 1}-${asset.side}${ext}`,
              );
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

  console.log(
    `Admin email attachments - Design previews: ${attachments.length}, Raw assets: ${rawAssetAttachments.length}, Total: ${attachments.length + rawAssetAttachments.length}`,
  );

  return transporter.sendMail(mailOptions);
}
