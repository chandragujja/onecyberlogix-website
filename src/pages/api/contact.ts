---
import nodemailer from 'nodemailer';

export const POST = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const company = data.get('company');
  const message = data.get('message');

  // Get SMTP config from environment variables
  const smtpHost = import.meta.env.SMTP_HOST || 'smtp.zoho.com';
  const smtpPort = import.meta.env.SMTP_PORT || 587;
  const smtpUser = import.meta.env.SMTP_USER || 'dummy@onecyberlogix.com';
  const smtpPass = import.meta.env.SMTP_PASS || 'your-app-password';
  const toEmail = import.meta.env.CONTACT_TO_EMAIL || 'dummy@onecyberlogix.com';

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: smtpUser,
    to: toEmail,
    subject: `New Contact Form Submission from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Company: ${company}

Message:
${message}
    `,
    html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
