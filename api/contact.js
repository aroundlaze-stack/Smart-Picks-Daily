import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  const { name, email, subject, message } = payload;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error('Missing Gmail environment variables');
    res.status(500).json({ error: 'Email service is not configured yet. Add GMAIL_USER and GMAIL_APP_PASSWORD in Vercel.' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: 'contactpicksdaily@gmail.com',
      replyTo: email,
      subject: `New contact form message: ${subject || 'General Inquiry'}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject || 'General Inquiry'}`,
        '',
        message,
      ].join('\n'),
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    console.error('Contact email delivery failed', detail);
    res.status(500).json({ error: `Email delivery failed: ${detail}` });
  }
}
