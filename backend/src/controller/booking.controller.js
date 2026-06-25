import mongoose from "mongoose";
import cron from "node-cron";
import Booking from "../models/booking.model.js";
import PaymentHistory from "../models/payment.model.js";
import User from "../models/user.model.js";
import { adminGmail, storeNotification } from "../utils/utils.js";
import { sendNotification } from "../utils/notification.js";

export const getAllBooking = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; 
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let filter = {};
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    const allBooking = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("butler.id");

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      message: "Success",
      data: allBooking,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const getBookingButler = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const id = req.params.id;

    let filter = { "butler.id": id };
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    const allBooking = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("butler.id");

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      message: "Success",
      data: allBooking,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const getBookingCustomer = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const email = req.params.email;

    let filter = { email: email };
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    const allBooking = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("butler.id");

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      message: "Success",
      data: allBooking,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const data = req.body;
    
    // Default financial values on creation before payment
    if (data.price !== undefined) {
      data.totalAmount = data.price;
      data.amountPaid = 0;
      data.amountDue = data.price;
      data.remainingBalance = data.price;
    }
    
    const newData = new Booking(data);
    const savedData = await newData.save();
    const { email, phone, serviceName, price, paymentType } = req.body;

    // Update user's serviceTaken
    await User.updateOne({ email: email }, { $inc: { serviceTaken: 1 } });

    await storeNotification(adminGmail, `New ${serviceName}`, "", "/dashboard");

    // User email HTML template (Booking Received - Payment Pending)
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
        <h1 style="color: #ff1673;">Booking Received! 🥂</h1>
        <p style="font-size:16px; margin:20px 0;">
          Hello, we have received your booking for <strong>${serviceName}</strong>.
        </p>
        <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ff1673;">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Total Price:</strong> £${price}</p>
          <p><strong>Payment Status:</strong> Pending Payment ⚠️</p>
        </div>
        <p style="font-size:16px; color: #e11d48; font-weight: bold;">
          Action Required: Please complete your payment to fully confirm and secure your booking.
        </p>
        <p>You can complete your payment anytime via your dashboard.</p>
        <p style="margin-top: 25px;">
          <a href="https://hunky-butler.vercel.app/dashboard" style="background-color: #ff1673; color: white; padding: 14px 30px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">View Dashboard & Pay</a>
        </p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          If you have already initiated payment, please ignore this email. Your confirmation will follow shortly.
        </p>
      </div>
    `;

    // Admin email HTML template
    const adminEmail = process.env.ADMIN_EMAIL || "rakib.fbinternational@gmail.com";
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
        <h2 style="color: #ff1673; margin-bottom: 20px;">New Booking Alert</h2>
        <p style="font-size:16px;">
          A new booking for <strong>${serviceName}</strong> has been made by <strong>${email}</strong>. 
        </p>
        <p><strong>Price:</strong> £${price}</p>
        <p>Check the dashboard for details.</p>
      </div>
    `;

    // Send notification to user (Email + SMS)
    await sendNotification({
      email,
      phone,
      subject: "Booking Received - Action Required",
      message: `Thank you for your booking! We've received your booking for ${serviceName}. Please complete your payment at: https://hunky-butler.vercel.app/dashboard to fully confirm.`,
      html: userEmailHtml,
      smsMessage: `Hunky Butler: Booking received for ${serviceName}! Please complete your payment in your dashboard to confirm your booking.`
    });

    // Send notification to admin (Email only)
    await sendNotification({
      email: adminEmail,
      subject: "New Booking Alert",
      message: `New booking received for ${serviceName} from ${email}.`,
      html: adminEmailHtml
    });

    res.status(200).json({
      message: "Booking created and notifications sent successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Booking.deleteOne({ _id: id });
    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status, butlerid, paymentType, paymentMethod, depositAmount, amountDue, remainingBalance, paid, paymentStatus } = req.body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (paymentType !== undefined) updateFields.paymentType = paymentType;
    if (paymentMethod !== undefined) updateFields.paymentMethod = paymentMethod;
    if (depositAmount !== undefined) updateFields.depositAmount = depositAmount;
    if (amountDue !== undefined) updateFields.amountDue = amountDue;
    if (remainingBalance !== undefined) updateFields.remainingBalance = remainingBalance;
    if (paid !== undefined) updateFields.paid = paid;
    if (paymentStatus !== undefined) updateFields.paymentStatus = paymentStatus;

    // Update booking details
    const updatedBookingResult = await Booking.updateOne(
      { _id: id },
      { $set: updateFields },
    );

    // If butlerid is provided, update the accepted status in butler array
    if (butlerid) {
      await Booking.updateOne(
        {
          _id: id,
          "butler.id": butlerid,
        },
        {
          $set: {
            "butler.$.accepted": true,
          },
        },
      );
      console.log(`Butler ${butlerid} accepted the booking ${id}`);
    }

    // Sync butler details to PaymentHistory
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Sync butler details to PaymentHistory
    await PaymentHistory.updateMany(
      { bookingId: id },
      { $set: { butler: booking.butler || [] } }
    );

    const { email, phone, firstName, serviceName } = booking;

    // Construct review link
    const reviewLink = `https://hunky-butler.vercel.app/review/${email}/?id=${butlerid || ''}`;

    let subject = "";
    let emailHtml = "";
    let smsMessage = "";

    if (status === "accepted") {
      await storeNotification(email, `Your ${serviceName} Booking Accept`, "", "/dashboard");
      subject = "Booking Accepted";
      smsMessage = `Hunky Butler: Good news! Your booking for ${serviceName} has been accepted.`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border:2px solid #ff1673; border-radius:12px;">
          <h2 style="color: #ff1673;">Booking Accepted</h2>
          <p>Hello ${firstName},</p>
          <p>Your booking for <strong>${serviceName}</strong> has been accepted. Thank you for choosing our service!</p>
        </div>
      `;
    } else if (status === "completed") {
      await storeNotification(email, `Your ${serviceName} Booking Completed. Make a Review?`, "", reviewLink);
      subject = "Service Completed";
      smsMessage = `Hunky Butler: Your ${serviceName} service is complete! We'd love your feedback: ${reviewLink}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border:2px solid #ff1673; border-radius:12px;">
          <h2 style="color: #ff1673;">Service Completed</h2>
          <p>Hello ${firstName},</p>
          <p>Your service <strong>${serviceName}</strong> has been completed. Thank you for staying with us!</p>
          <p style="margin-top:20px;">
            <a href="${reviewLink}" style="background-color:#ff1673; color:#fff; padding:12px 24px; border-radius:9999px; text-decoration:none; font-weight:600;">
              Give a Review
            </a>
          </p>
        </div>
      `;
    }

    // Send notification
    if (emailHtml) {
      await sendNotification({
        email,
        phone,
        subject,
        message: smsMessage,
        html: emailHtml,
        smsMessage
      });
    }

    res.status(200).json({
      message: "Booking status updated and notifications sent",
      data: updatedBookingResult,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const assginToButler = async (req, res) => {
  try {
    const { butlerId, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const { firstName, lastName, serviceName, dateOfEvent } = booking;

    const formattedButlers = butlerId.map((id) => ({
      id: new mongoose.Types.ObjectId(id),
      accepted: false,
    }));

    await Booking.updateOne(
      { _id: bookingId },
      { $push: { butler: { $each: formattedButlers } } },
    );

    const updatedBooking = await Booking.findById(bookingId);
    if (updatedBooking) {
      await PaymentHistory.updateMany(
        { bookingId: bookingId },
        { $set: { butler: updatedBooking.butler || [] } }
      );
    }

    const butlers = await User.find({ _id: { $in: butlerId } });

    const notificationPromises = butlers.map(async (butler) => {
      const butlerEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background:#fff; text-align:center; border:2px solid #ff1673; border-radius:12px;">
          <h2 style="color:#ff1673;">New Booking Assigned</h2>
          <p>Hello ${butler.firstName} ${butler.lastName},</p>
          <p>You have been assigned a new booking:</p>
          <p><strong>Client:</strong> ${firstName} ${lastName}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</p>
          <p>Please accept the booking within 15 minutes.</p>
        </div>
      `;

      const smsMsg = `Hunky Butler: New booking assigned! ${serviceName} for ${firstName} on ${new Date(dateOfEvent).toLocaleDateString()}. Please check your dashboard to accept.`;

      // Send Email + SMS to butler
      await sendNotification({
        email: butler.email,
        phone: butler.phone,
        subject: "New Booking Assigned",
        message: smsMsg,
        html: butlerEmailHtml,
        smsMessage: smsMsg
      });

      await storeNotification(butler.email, `A New ${serviceName} Service assign to you`, "", `/dashboard`);
    });

    await Promise.all(notificationPromises);

    // Timeout logic
    butlers.forEach((butler) => {
      setTimeout(async () => {
        try {
          const checkBooking = await Booking.findById(bookingId);
          if (checkBooking) {
            const butlerAssignment = checkBooking.butler.find(
              (b) => b.id.toString() === butler._id.toString() && b.accepted === false
            );

            if (butlerAssignment) {
              await Booking.updateOne(
                { _id: bookingId },
                { $pull: { butler: { id: butler._id, accepted: false } } }
              );

              const updatedBooking = await Booking.findById(bookingId);
              await PaymentHistory.updateMany(
                { bookingId: bookingId },
                { $set: { butler: updatedBooking ? (updatedBooking.butler || []) : [] } }
              );

              await storeNotification(adminGmail, `Booking Needs Reassignment - ${firstName} ${lastName}`, "", "/dashboard");
              
              const timeoutMsg = "Hunky Butler: Booking not accepted in time and has been removed from your assignments.";
              await sendNotification({
                email: butler.email,
                phone: butler.phone,
                subject: "Booking Assignment Expired",
                message: timeoutMsg,
                smsMessage: timeoutMsg
              });
            }
          }
        } catch (err) {
          console.error("Error in butler timeout:", err);
        }
      }, 15 * 60 * 1000);
    });

    res.status(200).json({
      message: "Butlers assigned and notifications sent successfully",
      data: butlerId,
    });
  } catch (error) {
    console.error("Error in assginToButler:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

export const getBookingOverviewCustomer = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await Booking.aggregate([
      { $match: { email: email } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$price" },
          totalServiceTaken: { $sum: 1 },
        },
      },
    ]);

    let totalSpent = 0;
    let totalServiceTaken = 0;

    if (result.length > 0) {
      totalSpent = result[0].totalSpent;
      totalServiceTaken = result[0].totalServiceTaken;
    }

    return res.status(200).json({ email, totalSpent, totalServiceTaken });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getBookingOverviewButler = async (req, res) => {
  try {
    const id = req.params.id;
    const bookings = await Booking.find({ "butler.id": id });
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
    const totalServiceProvided = bookings.length;

    return res.status(200).json({ totalSpent, totalServiceProvided });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

export const getButlerOverview = async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalBookingCompleted = await Booking.countDocuments({
      "butler.id": id,
      status: "completed",
    });

    const totalEarningThisMonth = await Booking.aggregate([
      {
        $match: {
          "butler.id": id,
          status: "completed",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    res.status(200).json({ totalBookingCompleted, totalEarningThisMonth });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};

export const sendEmail = async (req, res) => {
  try {
    // Find bookings that are not fully paid (either completely unpaid or only deposit paid)
    const bookingsToRemind = await Booking.find({ 
      paid: { $in: ["unpaid", "pending"] },
      status: { $ne: "cancelled" }
    });

    for (const booking of bookingsToRemind) {
      const { email, phone, firstName, serviceName, price, amountDue, paymentStatus } = booking;
      
      const isDepositPaid = paymentStatus === 'deposit_paid';
      const balance = isDepositPaid ? amountDue : price;

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Payment Reminder - Hunky Butler</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #ff1673; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border: 1px solid #eee; border-top: none; }
                .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; }
                .button { display: inline-block; padding: 14px 30px; background-color: #ff1673; color: white !important; text-decoration: none; border-radius: 9999px; margin: 25px 0; font-weight: bold; }
                .details { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ff1673; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header"><h1>Payment Reminder</h1></div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>This is a friendly reminder regarding your booking for <strong>${serviceName}</strong>.</p>
                
                <div class="details">
                  <p><strong>Total Price:</strong> £${price}</p>
                  <p><strong>Status:</strong> ${isDepositPaid ? "Deposit Paid ✅" : "Unpaid ⚠️"}</p>
                  <p style="color: #ff1673; font-size: 18px;"><strong>Remaining Balance: £${balance}</strong></p>
                </div>

                <p>Please complete your payment to ensure your booking is fully confirmed and secured.</p>
                <p style="text-align: center;"><a href="https://hunky-butler.vercel.app/dashboard" class="button">Pay Balance Now</a></p>
                <p>If you have already paid, please ignore this email.</p>
                <p>Best regards,<br>Hunky Butler Team</p>
            </div>
            <div class="footer"><p>© ${new Date().getFullYear()} Hunky Butler. All rights reserved.</p></div>
        </body>
        </html>
      `;

      const smsMsg = `Hunky Butler: Friendly reminder for your ${serviceName} booking. Remaining balance: £${balance}. Please pay at: https://hunky-butler.vercel.app/dashboard`;

      await sendNotification({
        email,
        phone,
        subject: `Payment Reminder: ${serviceName} Booking`,
        message: smsMsg,
        html: htmlTemplate,
        smsMessage: smsMsg
      });

      // Throttle to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (res) {
      res.status(200).json({ success: true, message: `Payment reminders sent to ${bookingsToRemind.length} users` });
    }
  } catch (error) {
    console.error("Error sending payment reminders:", error);
    if (res) {
      res.status(500).json({ success: false, message: "Failed to send payment reminder emails", error: error.message });
    }
  }
};

// Run weekly at 9 AM every Monday
cron.schedule("0 9 * * 1", () => {
  sendEmail();
});
