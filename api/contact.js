const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, message, preferredContact, bestTimes } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Ignite Neurocoaching Waitlist <onboarding@resend.dev>',
      to: 'dara@igniteneurocoaching.com',
      replyTo: email,
      subject: `New waitlist sign-up: ${firstName} ${lastName}`,
      text: [
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Preferred way to connect: ${preferredContact || '—'}`,
        `Best times to reach: ${bestTimes || '—'}`,
        '',
        `What brings you here:`,
        message || '—',
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send failed:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
