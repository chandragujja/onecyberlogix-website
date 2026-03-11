import nodemailer from 'nodemailer';

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    }
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const message = formData.get('message') as string;

  // Get SMTP config from environment variables
  const smtpHost = import.meta.env.SMTP_HOST || '';
  const smtpPort = import.meta.env.SMTP_PORT || '';
  const smtpUser = import.meta.env.SMTP_USER || '';
  const smtpPass = import.meta.env.SMTP_PASS || '';
  const toEmail = import.meta.env.CONTACT_TO_EMAIL || '';

  // Check if credentials are set
  if (!smtpUser || !smtpPass || !toEmail) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'SMTP not configured. Please add SMTP credentials to environment variables.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Determine if we should use SSL (port 465) or TLS (port 587)
  const useSSL = smtpPort === '465';

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: useSSL,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: useSSL ? undefined : {
      rejectUnauthorized: false
    }
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
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Email error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
