import Notificaton from '../models/notification.model.js';

export const adminGmail = "rakib.fbinternational@gmail.com";

export const storeNotification = async (receiver, message, link, type) => {
  try {
    const newNotification = new Notificaton({
      receiver,
      message,
      link,
      type,
    });
    const saved = await newNotification.save();
    return saved;
  } catch (error) {
    console.error('Error storing notification:', error);
    throw error;
  }
};

export const otpGenaretor = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
