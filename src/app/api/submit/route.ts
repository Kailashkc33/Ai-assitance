import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Dynamically import nodemailer to avoid build-time errors
    const nodemailer = (await import('nodemailer')).default;

    const data = await req.json();

    // Load email credentials from env
    const BUSINESS_EMAIL = process.env.EMAIL_TO!;
    const EMAIL_FROM = process.env.EMAIL_FROM!;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;
    const SMTP_SERVER = process.env.SMTP_SERVER!;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
      },
    });

    // 1. Send confirmation email to the client
    const clientSubject = `Thank you for your consultation request, ${data.fullName}!`;
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank you for choosing ClientBridge!</h2>
        
        <p>Dear ${data.fullName},</p>
        
        <p>Thank you for submitting your business consultation request. We've received your information and our team will review it carefully.</p>
        
        <h3 style="color: #374151;">Your Consultation Details:</h3>
        <ul style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <li><strong>Name:</strong> ${data.fullName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          ${data.abn ? `<li><strong>ABN:</strong> ${data.abn}</li>` : ''}
          <li><strong>Business Goals:</strong> ${data.businessGoals}</li>
          <li><strong>Budget:</strong> $${data.budget} AUD</li>
          <li><strong>Preferred Contact:</strong> ${data.contactMethod}</li>
        </ul>
        
        <h3 style="color: #374151;">What happens next?</h3>
        <ol>
          <li>Our team will review your consultation request within 24 hours</li>
          <li>We'll contact you via your preferred method (${data.contactMethod})</li>
          <li>We'll schedule a detailed consultation session</li>
          <li>You'll receive a personalized business strategy</li>
        </ol>
        
        <p>If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
        
        <p>Best regards,<br>
        <strong>The ClientBridge Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent from ClientBridge - Your AI-powered business consultation platform.
        </p>
      </div>
    `;

    // 2. Send notification email to business
    const businessSubject = `New Client Consultation Request - ${data.fullName}`;
    const businessHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Client Consultation Request</h2>
        
        <h3 style="color: #374151;">Client Information:</h3>
        <ul style="background: #fef2f2; padding: 20px; border-radius: 8px;">
          <li><strong>Full Name:</strong> ${data.fullName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          ${data.abn ? `<li><strong>ABN:</strong> ${data.abn}</li>` : ''}
          <li><strong>Business Goals:</strong> ${data.businessGoals}</li>
          <li><strong>Budget:</strong> $${data.budget} AUD</li>
          <li><strong>Preferred Contact Method:</strong> ${data.contactMethod}</li>
        </ul>
        
        <h3 style="color: #374151;">Action Required:</h3>
        <p>Please review this consultation request and contact the client within 24 hours via their preferred method: <strong>${data.contactMethod}</strong></p>
        
        <p><strong>Client Email:</strong> ${data.email}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          This notification was sent from ClientBridge - Your AI-powered business consultation platform.
        </p>
      </div>
    `;

    // Send both emails
    await Promise.all([
      // Send confirmation to client
      transporter.sendMail({
        from: EMAIL_FROM,
        to: data.email,
        subject: clientSubject,
        html: clientHtml,
      }),
      
      // Send notification to business
      transporter.sendMail({
        from: EMAIL_FROM,
        to: BUSINESS_EMAIL,
        subject: businessSubject,
        html: businessHtml,
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/submit:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 