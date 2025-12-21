import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Contact submission:", body);

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Send email to admin
    await transporter.sendMail({
      from: `"Mon Impression - Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `📧 New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: #1a2b4a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">📧 New Contact Form Message</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">FROM:</p>
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1a2b4a;">${name}</p>
              <p style="margin: 5px 0 0 0; color: #3b82f6; font-size: 14px;">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </p>
            </div>
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">MESSAGE:</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #1a2b4a;">
                <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                This message was sent from the contact form on Mon Impression website
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ Contact email sent successfully");

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("❌ Error sending contact email:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
