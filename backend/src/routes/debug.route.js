import express from 'express';
import { sendEmail } from '../utils/notification.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/test-email', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Forbidden: This route is only available in development mode.' });
  }

  const testEmail = req.query.email || process.env.SMTP_USER;

  if (!testEmail) {
    return res.status(400).json({ message: 'Please provide an email address via the ?email= query parameter.' });
  }

  try {
    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email - Hunky Butler',
      text: 'This is a test email sent from the centralized mail service.',
      html: '<h1>Test Email</h1><p>This is a test email sent from the centralized mail service.</p>',
    });

    if (result) {
      return res.status(200).json({ success: true, message: `Test email sent successfully to ${testEmail}`, result });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send test email. Check server logs for details.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while attempting to send the test email.', error: error.message });
  }
});

export default router;
