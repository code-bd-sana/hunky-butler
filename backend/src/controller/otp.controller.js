import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/utils.js";

export const sendOtp = async (req, res) => {
  console.log("Hit");

  try {
    const email = req.params.email;

    const otp = await otpGenaretor();

    // Delete previous OTPs

    const deleted = await OTP.deleteMany({ email });

    // Save new OTP
    const newOtp = await new OTP({ email, otp });
    const saved = await newOtp.save();

    // Encode email for URL
    // const encodedEmail = encodeURIComponent(email);

    // Send email
    const datasEamil = await sendEmail(
      email,
      "Your Verification Code - Secure Access",
      `
            Dear Valued Customer,
            <br><br>
        
            `,
      otp
    );

    console.log(datasEamil, "fuck you its");

    res.status(200).json({ message: "Otp Sent Successfully" });
  } catch (error) {
    console.log(error, "salar abba");
    res.status(500).json({ message: "Something went Wrong!", error });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, "This is your email");

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
