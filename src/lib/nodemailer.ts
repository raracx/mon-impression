import nodemailer from "nodemailer";

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

// Email templates
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderId: string;
    productName: string;
    quantity: number;
    amount: number;
    designs: Record<string, string>;
    customizedSides: string[];
    delivery?: {
      type: "delivery" | "pickup";
      price: number;
      address?: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
        notes?: string;
      };
    };
  },
) {
  const { orderId, productName, quantity, amount, customizedSides, delivery } =
    orderDetails;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `Order Confirmation - ${orderId}`,
    html: `
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
              <h1>Order Confirmed! 🎉</h1>
              <p>Thank you for your custom order</p>
            </div>
            <div class="content">
              <h2>Order Details</h2>
              <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Order ID:</span>
                  <span class="detail-value">${orderId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product:</span>
                  <span class="detail-value">${productName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Quantity:</span>
                  <span class="detail-value">${quantity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Customized Sides:</span>
                  <span class="detail-value">${customizedSides.join(", ")}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total:</span>
                  <span class="detail-value total">$${(amount / 100).toFixed(2)} CAD</span>
                </div>
              </div>
              <h2 style="margin-top: 30px;">Delivery Information</h2>
              <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Delivery Type:</span>
                  <span class="detail-value">${delivery?.type === "pickup" ? "📦 Pickup (Free)" : "🚚 Delivery"}</span>
                </div>
                ${
                  delivery?.type === "delivery"
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Delivery Fee:</span>
                  <span class="detail-value">$${delivery.price?.toFixed(2) || "15.00"}</span>
                </div>
                `
                    : ""
                }
                ${
                  delivery?.address
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${delivery.address.street}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">City:</span>
                  <span class="detail-value">${delivery.address.city}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Province:</span>
                  <span class="detail-value">${delivery.address.province}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Postal Code:</span>
                  <span class="detail-value">${delivery.address.postalCode}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country:</span>
                  <span class="detail-value">${delivery.address.country}</span>
                </div>
                ${
                  delivery.address.notes
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Delivery Notes:</span>
                  <span class="detail-value">${delivery.address.notes}</span>
                </div>
                `
                    : ""
                }
                `
                    : delivery?.type === "pickup"
                      ? `
                <div class="detail-row">
                  <span class="detail-label">Pickup Address:</span>
                  <span class="detail-value">Mon Impression<br>123 Rue Principal<br>Montréal, QC H1A 1A1</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Pickup Hours:</span>
                  <span class="detail-value">Lun-Ven 9h-17h, Sam 10h-16h</span>
                </div>
                `
                      : ""
                }
              </div>
              We're processing your custom order and will notify you once it's ready ${delivery?.type === "pickup" ? "for pickup" : "for delivery"}.
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Custom Products. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendAdminNotificationEmail(orderDetails: {
  orderId: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  amount: number;
  designs: Record<string, string>;
  customizedSides: string[];
  size?: string;
  color?: string;
  delivery?: {
    type: "delivery" | "pickup";
    price: number;
    address?: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
      notes?: string;
    };
  };
}) {
  const {
    orderId,
    customerEmail,
    productName,
    quantity,
    amount,
    customizedSides,
    size,
    color,
    delivery,
  } = orderDetails;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL environment variable is not set");
    throw new Error("ADMIN_EMAIL is required for admin notifications");
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `New Order Received - ${orderId}`,
    html: `
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
              <h1>🔔 New Order Alert</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>Action Required:</strong> A new custom order needs to be processed.
              </div>
              <h2>Order Information</h2>
              <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Order ID:</span>
                  <span class="detail-value">${orderId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Customer Email:</span>
                  <span class="detail-value">${customerEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product:</span>
                  <span class="detail-value">${productName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Quantity:</span>
                  <span class="detail-value">${quantity}</span>
                </div>
                ${size ? `<div class="detail-row"><span class="detail-label">Size:</span><span class="detail-value">${size}</span></div>` : ""}
                ${color ? `<div class="detail-row"><span class="detail-label">Color:</span><span class="detail-value">${color}</span></div>` : ""}
                <div class="detail-row">
                  <span class="detail-label">Customized Sides:</span>
                  <span class="detail-value">${customizedSides.join(", ")}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value"><strong>$${(amount / 100).toFixed(2)} CAD</strong></span>
                </div>
              </div>
              <h2>Delivery Information</h2>
              <div class="order-details">
                <div class="detail-row">
                  <span class="detail-label">Delivery Type:</span>
                  <span class="detail-value">${delivery?.type === "pickup" ? "📦 Pickup (Free)" : "🚚 Delivery"}</span>
                </div>
                ${
                  delivery?.type === "delivery"
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Delivery Fee:</span>
                  <span class="detail-value">$${delivery.price?.toFixed(2) || "15.00"}</span>
                </div>
                `
                    : ""
                }
                ${
                  delivery?.address
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${delivery.address.street}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">City:</span>
                  <span class="detail-value">${delivery.address.city}, ${delivery.address.province}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Postal Code:</span>
                  <span class="detail-value">${delivery.address.postalCode}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country:</span>
                  <span class="detail-value">${delivery.address.country}</span>
                </div>
                ${
                  delivery.address.notes
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Delivery Notes:</span>
                  <span class="detail-value">${delivery.address.notes}</span>
                </div>
                `
                    : ""
                }
                `
                    : delivery?.type === "pickup"
                      ? `
                <div class="detail-row">
                  <span class="detail-label">Pickup Address:</span>
                  <span class="detail-value">Mon Impression<br>123 Rue Principal<br>Montréal, QC H1A 1A1</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Pickup Hours:</span>
                  <span class="detail-value">Lun-Ven 9h-17h, Sam 10h-16h</span>
                </div>
                `
                      : ""
                }
              </div>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the custom design files in the admin dashboard</li>
                <li>Process the order and prepare for production</li>
                <li>Update the order status once completed</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}
