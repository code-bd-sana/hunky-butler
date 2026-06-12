import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_SID; 
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || "hunkybutlerservice.co.uk",
    pass: process.env.EMAIL_PASS || "Bl00dh0und!",
  },
});

/**
 * Sanitize and format phone number to E.164
 * @param {string} phone 
 * @returns {string|null}
 */
const formatPhone = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleaned = phone.toString().replace(/\D/g, '');
  
  // If it doesn't start with '+', add it if it's a long number (assuming it already includes country code)
  // This is a simple heuristic. In production, a library like libphonenumber-js is better.
  if (cleaned.length >= 10 && !phone.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return phone.startsWith('+') ? phone : null;
};

/**
 * Send SMS using Twilio
 * @param {string} to - International format phone number
 * @param {string} body - SMS content
 */
export const sendSMS = async (to, body) => {
  if (!twilioClient) {
    console.warn('⚠️ Twilio client not initialized. Check your credentials.');
    return null;
  }

  const formattedTo = formatPhone(to);
  if (!formattedTo) {
    console.warn(`⚠️ Invalid or missing phone number for SMS: ${to}`);
    return null;
  }

  try {
    const message = await twilioClient.messages.create({
      body: body,
      messagingServiceSid: messagingServiceSid,
      to: formattedTo
    });
    console.log(`✅ SMS sent successfully to ${formattedTo}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ Error sending SMS to ${formattedTo}:`, error.message);
    return null;
  }
};

/**
 * Send Email using Nodemailer
 * @param {object} options - Email options (to, subject, text, html)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const fromAddress = process.env.EMAIL_FROM || "bookings@hunkybutlerservice.co.uk";
    const info = await transporter.sendMail({
      from: `"Hunky Butler" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    return null;
  }
};

/**
 * Centralized notification function to send both Email and SMS
 * @param {object} params - Notification parameters
 */
export const sendNotification = async ({
  email,
  phone,
  subject,
  message,
  html,
  smsMessage
}) => {
  const promises = [];

  // Send Email if email is provided
  if (email) {
    promises.push(sendEmail({ to: email, subject, text: message, html }));
  }

  // Send SMS if phone is provided
  if (phone) {
    const body = smsMessage || `${subject}: ${message}`;
    promises.push(sendSMS(phone, body));
  }

  return Promise.all(promises);
};

export default {
  sendSMS,
  sendEmail,
  sendNotification
};
