import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendNotification } from "../utils/notification.js";

export const sendOtp = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = await otpGenaretor();

    // Find user to get phone number
    const user = await User.findOne({ email });
    const phone = user ? user.phone : null;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Your Verification Code - Secure Access</title>
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
              <h1>Your Verification Code - Secure Access</h1>
          </div>
          <div class="content">
              ${
                otp 
                ? `<p>Your OTP is: <span class="otp-box">${otp}</span></p>` 
                : ""
              }
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>Your Team</p>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
      </body>
      </html>
    `;

    // Delete previous OTPs
    await OTP.deleteMany({ email });

    // Save new OTP
    const newOtp = new OTP({ email, otp });
    await newOtp.save();

    // Send notification (Email + SMS)
    await sendNotification({
      email,
      phone,
      subject: 'Your Verification Code - Secure Access',
      message: `Dear Valued Customer, Your verification code is: ${otp}`,
      html: htmlTemplate,
      smsMessage: `Your Hunky Butler verification code is: ${otp}`
    });

    res.status(200).json({ message: "Otp Sent Successfully" });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ message: "Something went Wrong!", error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Please register first" });
    }

    const otpEntry = await OTP.findOne({ email });

    if (!otpEntry) {
      return res
        .status(401)
        .json({ message: "OTP expired, please try again!" });
    }

    if (otpEntry.otp !== otp) {
      return res.status(401).json({ message: "Wrong OTP!" });
    }

    await User.updateOne({ email }, { $set: { isVerified: true } });

    // Optional: Clean up used OTP
    await OTP.deleteMany({ email });

    res.status(200).json({ message: "Verification successful!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};

const otpGenaretor = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
