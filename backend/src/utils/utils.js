import nodemailer from 'nodemailer'
import Notificaton from '../models/notification.model.js';



export const sendEmail = async (to, sub, text, otp = null, link = null) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${sub}</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #e60459;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
                  border-radius: 0 0 5px 5px;
                  border: 1px solid #e0e0e0;
                  border-top: none;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #e60459;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 3px;
                  margin: 15px 0;
              }
              .logo {
                  max-width: 150px;
                  margin-bottom: 15px;
              }
              .otp-box {
                  display: inline-block;
                  background: #ffe4ec;
                  color: #e60459;
                  font-weight: bold;
                  font-size: 18px;
                  padding: 8px 15px;
                  border-radius: 5px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>${sub}</h1>
          </div>
          <div class="content">
              <p>${text.replace(/\n/g, '<br>')}</p>

              ${
                otp 
                ? `<p>Your OTP is: <span class="otp-box">${otp}</span></p>` 
                : ""
              }

              ${
                link 
                ? `<p><a href="${link}" class="button">Change Password</a></p>` 
                : ""
              }
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>Your Team</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
              <p>
                  <a href="#" style="color: #e60459;">Privacy Policy</a> | 
                  <a href="#" style="color: #e60459;">Terms of Service</a>
              </p>
          </div>
      </body>
      </html>
    `;

    const sendMail = await transporter.sendMail({
      from: "Hunkey Butler",
      to: to,
      subject: sub,
      text: text,
      html: htmlTemplate
    });

    return sendMail;
  } catch (error) {
    // console.log(error);
    return error;
  }
};





 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "bannah76769@gmail.com",
    pass: "noqq kzxv olzf clzz",
  },})





export const safeStringify = (obj, space = 2) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, space);
};



// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com", // Outlook SMTP server
//   port: 587,
//   secure: false, // TLS starttls ব্যবহার করবে
//   auth: {
//     user: "rakib.fb3719@outlook.com",
//     pass: "mzvivaftletwnkes", 
//   },
//   tls: {
//     ciphers: 'SSLv3' // Optional, security enhancement
//   }
// });












export const adminGmail = 'admin@gmail.com'











// controllers/notificationController.js
export const storeNotification = async (receiver, message, sender = '', link = '', req = null) => {
  try {
    const newNotification = {
      receiver,
      message,
      sender,
      link,
      createdAt: new Date()
    };
    
    const newNotificationSave = new Notificaton(newNotification);
    await newNotificationSave.save();

    // Get the saved notification
    const savedNotification = await Notificaton.findById(newNotificationSave._id);

    // Emit real-time notification - multiple approaches
    try {
      // Approach 1: Get io from request app settings
      if (req && req.app.get('io')) {
        const io = req.app.get('io');
        io.to(receiver).emit('new-notification', savedNotification);
        console.log('🔔 Notification sent via socket to:', receiver);
      }
      // Approach 2: Dynamic import (for cases where req is not available)
      else {
        const { io } = await import('../../app.js');
        if (io) {
          io.to(receiver).emit('new-notification', savedNotification);
          console.log('🔔 Notification sent via socket to:', receiver);
        }
      }
    } catch (socketError) {
      console.log('⚠️ Socket emission failed, but notification saved:', socketError);
      // Continue even if socket fails - notification is saved in DB
    }

    return savedNotification;
    
  } catch (error) {
    console.log('❌ Error storing notification:', error);
    throw error;
  }
};






















  export const otpGenaretor = async()=>{

      const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
  }




