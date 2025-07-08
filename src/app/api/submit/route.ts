import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Load email credentials from env
    const EMAIL_TO = process.env.EMAIL_TO!;
    const EMAIL_FROM = process.env.EMAIL_FROM!;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;
    const SMTP_SERVER = process.env.SMTP_SERVER!;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

    // Compose email content
    const subject = `New Client Consultation Request - ${data.fullName}`;
    let html = '<h2>New Client Submission</h2>';

    if (data.transcript) {
      html += `<p><strong>Transcript:</strong><br/>${data.transcript}</p>`;
    }
    if (data.agentResponse) {
      html += `<p><strong>Agent Summary:</strong><br/>${data.agentResponse}</p>`;
    }
    if (data.fullName || data.email || data.abn || data.businessGoals || data.budget || data.contactMethod) {
      html += '<h3>Client Info</h3><ul>';
      if (data.fullName) html += `<li><strong>Full Name:</strong> ${data.fullName}</li>`;
      if (data.email) html += `<li><strong>Email:</strong> ${data.email}</li>`;
      if (data.abn) html += `<li><strong>ABN:</strong> ${data.abn}</li>`;
      if (data.businessGoals) html += `<li><strong>Business Goals:</strong> ${data.businessGoals}</li>`;
      if (data.budget) html += `<li><strong>Budget:</strong> ${data.budget}</li>`;
      if (data.contactMethod) html += `<li><strong>Preferred Contact Method:</strong> ${data.contactMethod}</li>`;
      html += '</ul>';
    }

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

    // Send the email
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/submit:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 