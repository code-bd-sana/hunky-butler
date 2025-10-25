
import Booking from "../models/booking.model.js";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import Notificaton from "../models/notification.model.js";
import { adminGmail, storeNotification } from "../utils/utils.js";
import PaymentHistory from "../models/payment.model.js";
import mongoose from "mongoose";
import cron from 'node-cron';


export const getAllBooking = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0; // convert string to number
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    console.log(skip, "skip");
    console.log(limit, "limit");
    console.log(status, "status");

    let filter = {};
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    // Apply filter in both find() and countDocuments()
    const allBooking = await Booking.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .populate("butler.id");

    const total = await Booking.countDocuments(filter).sort({createdAt: -1});

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
    const skip = parseInt(req.query.skip) || 0; // convert string to number
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const id = req.params.id

    console.log(skip, "skip");
    console.log(limit, "limit");
    console.log(status, "status");

let filter = {"butler.id": id};
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    // Apply filter in both find() and countDocuments()
    const allBooking = await Booking.find(filter)
    .sort({createdAt: -1})
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

  console.log("aso khelbo")

  try {
    const skip = parseInt(req.query.skip) || 0; // convert string to number
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const email = req.params.email

    console.log(skip, "skip");
    console.log(limit, "limit");
    console.log(status, "status");

    let filter = {email: email};
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    // Apply filter in both find() and countDocuments()
    const allBooking = await Booking.find(filter)
    .sort({createdAt: -1})
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














// export const getSingleBooking = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const data = await Booking.findOne({ _id: id });
//     res.status(200).json({
//       message: "Success",
//       data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong!",
//       error: error.message,
//     });
//   }
// };

export const createBooking = async (req, res) => {
  console.log("Hit");
  try {
    const data = req.body;
    const newData = new Booking(data);
    const savedData = await newData.save();
    const { email, serviceName } = req.body;

    // Update user's serviceTaken
    await User.updateOne(
      { email: email },
      { $inc: { serviceTaken: 1 } }
    );


const notificationData = {
  receiver: adminGmail,
  message: `New ${serviceName} Service Order Received`
}


    await storeNotification(adminGmail, `New ${serviceName}`, '', '/dashboard',)

        // Response after user email sent
    res.status(200).json({
      message: "Booking created and emails sent successfully",
      data: savedData,
    })

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "bannah76769@gmail.com",
        pass: "noqq kzxv olzf clzz",
      },
    });

    // User email HTML template
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center;">
        <h1 style="color: #ff1673;">Thank You for Your Booking!</h1>
        <p style="font-size:16px; margin:20px 0;">
          Your booking for <strong>${serviceName}</strong> has been received.
        </p>
        <p style="font-size:16px;">
          Please wait, your booking will be accepted by our team shortly.
        </p>
      </div>
    `;

    // Send email to user
    await transporter.sendMail({
      from: '"Hunky Butler Service"',
      to: email,
      subject: "Booking Confirmation",
      html: userEmailHtml,
    });

    // Send email to admin
    const adminEmail = "rakib.fbinternational@gmail.com";
 const adminEmailHtml = `
  <div style="
    font-family: Arial, sans-serif;
    background: #fff;
    color: #3D3D3D;
    padding: 30px;
    text-align: center;
    border: 2px solid #ff1673;
    border-radius: 12px;
  ">
    <h2 style="color: #ff1673; margin-bottom: 20px;">New Booking Alert</h2>
    <p style="font-size:16px;">
      A new booking has been made. Kindly check the dashboard.
    </p>
  </div>
`;


    await transporter.sendMail({
      from: '"Hunky Butler Service"',
      to: adminEmail,
      subject: "New Booking Alert",
      html: adminEmailHtml,
    });

;




  } catch (error) {
    console.log(error, "confusion unga bunga");
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};












export const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteBooking = await Booking.deleteOne({ _id: id });
    res.status(200).json({
      message: "Success",
      data: deleteBooking,
    });
  } catch (error) {

    console.log(error, "This is your error ok?")
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status, butlerid} = req.body;



 const updateData = { status: status };

    // If completed, mark as paid
   

    // Update booking status and paid status
    const updatedBooking = await Booking.updateOne(
      { _id: id },
      { $set: updateData }
    );

    // If butlerid is provided, update the accepted status in butler array
    if (butlerid) {
      await Booking.updateOne(
        { 
          _id: id,
          "butler.id": butlerid  // Find the specific butler in the array
        },
        { 
          $set: { 
            "butler.$.accepted": true  // Update only the matched butler's accepted status
          } 
        }
      );
      await PaymentHistory.updateOne(
        { 
          bookingId: id
        },
        { 
          $push: { 
            butler: {
              id: butlerid,
              accepted: true
            }
          } 
        }
      );
      
      console.log(`Butler ${butlerid} accepted the booking ${id}`);
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      data: {
        bookingId: id,
        status: status,
        butlerAccepted: butlerid ? true : false
      }
    });

    // Fetch booking info for email
    const booking = await Booking.findById(id);
    const { email, firstName, serviceName } = booking;

    // Find butler info (if assigned)
    

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "bannah76769@gmail.com",
        pass: "noqq kzxv olzf clzz",
      },
    });

    // Construct review link (customer email + butler id)
    const reviewLink = `https://hunky-butler.vercel.app/review/${email}/?id=${butlerId}`;

    // Email template
    let subject = "";
    let emailHtml = "";

    if (status === "accepted") {

     await storeNotification (email, `Your ${serviceName} Booking Accept`, '', '/dashboard')
      subject = "Booking Accepted";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border:2px solid #ff1673; border-radius:12px;">
          <h2 style="color: #ff1673;">Booking Accepted</h2>
          <p>Hello ${firstName},</p>
          <p>Your booking for <strong>${serviceName}</strong> has been accepted. Thank you for choosing our service!</p>
        </div>
      `;
    } else if (status === "completed") {

           await storeNotification (email, `Your ${serviceName} Booking Completed. Make a Review?`, '', `https://hunky-butler.vercel.app/review/${email}/?id=${butlerId}`)
      subject = "Service Completed";
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


      res.status(200).json({
      message: "Status updated and email sent successfully",
      data: updated,
    });

        res.status(200).json({
      message: "Status updated and email sent successfully",
      data: updated,
    });
    // Send email if status is accepted or completed
    if (emailHtml) {
      await transporter.sendMail({
        from: '"Hunky Butler Service"',
        to: email,
        subject: subject,
        html: emailHtml,
      });
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};



export const assginToButler = async (req, res) => {
  console.log("Hit");
  try {
    const { butlerId, bookingId } = req.body;

    console.log(butlerId, bookingId, "salar bacca madari");

    // Find booking info
    const booking = await Booking.findById(bookingId);
    const { firstName, lastName, email, serviceName, dateOfEvent } = booking;

     const existingButlers = booking.butler || [];
    const alreadyAssignedButlers = [];

    butlerId.forEach(id => {
      const isAlreadyAssigned = existingButlers.some(
        butler => butler.id.toString() === id.toString()
      );
      if (isAlreadyAssigned) {
        alreadyAssignedButlers.push(id);
      }
    });

    // If any butler is already assigned, return error
    if (alreadyAssignedButlers.length > 0) {
      return res.status(400).json({
        message: "Some butlers are already assigned to this booking",
        alreadyAssignedButlers: alreadyAssignedButlers,
        error: "BUTLER_ALREADY_ASSIGNED"
      });
    }


    // Format butlers array
    const formattedButlers = butlerId.map(id => ({
      id: new mongoose.Types.ObjectId(id),
      accepted: false,
    }));

    console.log(formattedButlers, "ha ha kore haste icca korsa");

    // Push multiple butlers safely
    const updatedBooking = await Booking.updateOne(
      { _id: bookingId },
      { $push: { butler: { $each: formattedButlers } } }
    );

    // Find all butlers info for email and notification
    const butlers = await User.find({ 
      _id: { $in: butlerId } 
    });

    console.log(butlers, "Found butlers");

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "bannah76769@gmail.com",
        pass: "noqq kzxv olzf clzz",
      },
    });

    // Send email to each butler individually
    const emailPromises = butlers.map(async (butler) => {
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

      // Send email
      await transporter.sendMail({
        from: '"Hunky Butler Service"',
        to: butler.email,
        subject: "New Booking Assigned",
        html: butlerEmailHtml,
      });

      // Store notification for each butler
      await storeNotification(
        butler.email, 
        `A New ${serviceName} Service assign to you`, 
        '', 
        `/dashboard`
      );

      console.log(`Email and notification sent to ${butler.email}`);
    });

    // Wait for all emails and notifications to be sent
    await Promise.all(emailPromises);

    // Set up 15 min timeout for each butler individually
  // Set up 15 min timeout for each butler individually
butlers.forEach(async (butler) => {
  setTimeout(async () => {
    try {
      const checkBooking = await Booking.findById(bookingId);

      if (checkBooking) {
        // Find the specific butler in the booking
        const butlerAssignment = checkBooking.butler.find(
          b => b.id.toString() === butler._id.toString()
        );

        // If this specific butler hasn't accepted, remove only them
        if (butlerAssignment && butlerAssignment.accepted === false) {
          await Booking.updateOne(
            { _id: bookingId },
            { $pull: { butler: { id: butler._id, accepted: false } } }
          );

          // Update payment history if this was the only butler and all are removed
          const updatedBooking = await Booking.findById(bookingId);
          const hasAcceptedButler = updatedBooking.butler.some(b => b.accepted === true);
          
          // If no butler has accepted after removal, clear payment history
          if (!hasAcceptedButler) {
            await PaymentHistory.updateOne(
              { bookingId: bookingId },
              { $set: { butlerId: null } }
            );
          }

          // Store notification for admin
          await storeNotification(
            adminGmail,
            `Booking Needs Reassignment - The booking for ${firstName} ${lastName} (${serviceName} on ${new Date(
              dateOfEvent
            ).toLocaleDateString()}) was not accepted by butler ${butler.firstName} ${butler.lastName}.`,
            "",
            "/dashboard"
          );

          // Store notification for the butler
          await storeNotification(
            butler.email,
            "Booking Not Accepted In Time and has been removed from your assignments",
            "",
            ""
          );

          console.log(`❌ Butler ${butler.firstName} removed from booking ${bookingId} due to no acceptance`);
        } else {
          console.log(`✅ Butler ${butler.firstName} accepted the booking, no removal needed`);
        }
      }
    } catch (err) {
      console.error("Error inside timeout for butler:", butler._id, err.message);
    }
  }, 2 * 60 * 1000); // 15 minutes
});

    res.status(200).json({
      message: "Butlers assigned and emails sent successfully",
      data: updatedBooking,
      butlersAssigned: butlers.map(b => ({
        id: b._id,
        name: `${b.firstName} ${b.lastName}`,
        email: b.email
      }))
    });

  } catch (error) {
    console.log(error);
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
          totalSpent: { $sum: "$price" },         // সব price যোগ
          totalServiceTaken: { $sum: 1 }          // মোট booking সংখ্যা
        }
      }
    ]);

    let totalSpent = 0;
    let totalServiceTaken = 0;

    if (result.length > 0) {
      totalSpent = result[0].totalSpent;
      totalServiceTaken = result[0].totalServiceTaken;
    }

    return res.status(200).json({
      email,
      totalSpent,
      totalServiceTaken
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong!"
    });
  }
};




export const getBookingOverviewButler = async (req, res) => {
  
  try {
    const id = req.params.id;

    // Get all bookings for this butler
    const bookings = await Booking.find({ "butler.id": id });

    // Calculate totalSpent and totalServiceProvided
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
    const totalServiceProvided = bookings.length;

    return res.status(200).json({
      totalSpent,
      totalServiceProvided
    });

  } catch (error) {
    console.error("Booking Overview Error:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message
    });
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

    
 const bookings = await Booking.find({
  "butler.id": id,
  status: "completed",
  createdAt: { $gte: startOfMonth, $lte: endOfMonth },
});

const totalEarningThisMonth = bookings.reduce((sum, booking) => {
  return sum + (booking.butlerFee || 0);
}, 0);

console.log(totalEarningThisMonth, 'total earning this months')
   

    res.status(200).json({
      totalBookingCompleted,
      totalEarningThisMonth,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error,
    });
  }
};








export const sendEmail = async (req, res) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "bannah76769@gmail.com",
      pass: "noqq kzxv olzf clzz",
    },})
  
  try {
    // Get all pending payments
    const allEmail = await Booking.find({ paid: "pending" });
    
    // Limit to 5 emails per day
    const emailsToSend = allEmail.slice(0, 5);
    
    // Send email to each recipient
    for (const booking of emailsToSend) {
      const userEmail = booking.email; // assuming email field exists in Booking
      
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Payment Reminder</title>
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
                    padding: 12px 25px;
                    background-color: #e60459;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                    font-size: 16px;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
                .payment-reminder {
                  background: #fff3f7;
                  padding: 15px;
                  border-radius: 5px;
                  border-left: 4px solid #e60459;
                  margin: 15px 0;
                }
                .urgent {
                  color: #e60459;
                  font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Payment Reminder</h1>
            </div>
            <div class="content">
                <p>Dear Customer,</p>
                
                <div class="payment-reminder">
                    <p class="urgent">Your payment is still <strong>pending</strong>!</p>
                    <p>We noticed that you haven't completed the payment for your booking yet.</p>
                </div>
                
                <p>You want to payment but it's still not paid. Please complete your payment to confirm your booking.</p>
                
                <p style="text-align: center;">
                    <a href="https://hunky-butler.vercel.app/dashboard" class="button">
                        Complete Your Payment Now
                    </a>
                </p>
                
                <p>This link will take you directly to your dashboard where you can complete the payment process.</p>
                
                <p>If you have already made the payment, please ignore this email.</p>
                
                <p>Best regards,<br>Our Team</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Our Company. All rights reserved.</p>
                <p>
                    <a href="#" style="color: #e60459;">Privacy Policy</a> | 
                    <a href="#" style="color: #e60459;">Terms of Service</a>
                </p>
            </div>
        </body>
        </html>
      `;

      // Email configuration
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Payment Reminder - Your Payment is Still Pending',
        html: htmlTemplate
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`Payment reminder sent to: ${userEmail}`);
      
      // Optional: Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Successfully sent ${emailsToSend.length} payment reminder emails`);
    
    // Send response
    res.status(200).json({
      success: true,
      message: `Payment reminders sent to ${emailsToSend.length} users`,
      data: emailsToSend.length
    });

  } catch (error) {
    console.log('Error sending emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment reminder emails',
      error: error.message
    });
  }
};




// Run every day at 5 AM
cron.schedule('0 5 * * *', () => {
  sendEmail();
});