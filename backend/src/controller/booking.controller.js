import Booking from "../models/booking.model.js";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import Notificaton from "../models/notification.model.js";
import { adminGmail, storeNotification } from "../utils/utils.js";
import PaymentHistory from "../models/payment.model.js";

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
      .populate("butler");

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

    let filter = {butler: id};
    if (status && status !== "all") {
      filter.status = status.toLowerCase();
    }

    // Apply filter in both find() and countDocuments()
    const allBooking = await Booking.find(filter)
    .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .populate("butler");

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
      .populate("butler");

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
    const { id, status } = req.body;

    // Update booking status
    const updated = await Booking.updateOne(
      { _id: id },
      { $set: { status: status } }
    );

    // If completed, mark as paid
    // if (status === "completed") {
    //   await Booking.updateOne(
    //     { _id: id },
    //     { $set: { paid: "Paid" } }
    //   );
    // }

    // Fetch booking info for email
    const booking = await Booking.findById(id);
    const { email, firstName, serviceName, butler } = booking;

    // Find butler info (if assigned)
    const butlerId = butler ? butler.toString() : null;

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
  try {
    const { butlerId, bookingId } = req.body;

    // Butler assign
    const updatedBooking = await Booking.updateOne(
      { _id: bookingId },
      { $set: { butler: butlerId } }
    );

    // Find butler info
    const butler = await User.findById(butlerId);
    const butlerEmail = butler.email;
    const butlerName = butler.firstName || "Butler";

    // Find booking info
    const booking = await Booking.findById(bookingId);
    const { firstName, lastName, email, serviceName, dateOfEvent } = booking;
   await PaymentHistory.updateOne(
  { bookingId: bookingId },
  {
    $set: {
      butlerId: butlerId
    }
  }
);

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


        res.status(200).json({
      message: "Butler assigned and email sent successfully",
      data: updatedBooking,
    });

        await storeNotification(butlerEmail, `A New ${serviceName} Service assign to you`, '', `/dashboard`)

    // Email to Butler (assigned)
    const butlerEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#fff; text-align:center; border:2px solid #ff1673; border-radius:12px;">
        <h2 style="color:#ff1673;">New Booking Assigned</h2>
        <p>Hello ${butlerName},</p>
        <p>You have been assigned a new booking:</p>
        <p><strong>Client:</strong> ${firstName} ${lastName}</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Date:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</p>
        <p>Please accept the booking within 15 minutes.</p>
      </div>
    `;

   transporter.sendMail({
      from: '"Hunky Butler Service"',
      to: butlerEmail,
      subject: "New Booking Assigned",
      html: butlerEmailHtml,
    });



    // 15 min timeout
    setTimeout(async () => {
      try {
        const checkBooking = await Booking.findById(bookingId);

        if (checkBooking && checkBooking.status !== "accepted") {
          // Butler remove
          await Booking.updateOne(
            { _id: bookingId },
            { $set: { butler: null } }

          
          );
 await PaymentHistory.updateOne(
  { bookingId: bookingId },
  {
    $set: {
      butlerId: null
    }
  }
);

               storeNotification(adminGmail, `Booking Needs Reassignmen - The booking for ${firstName} ${lastName} (${serviceName} on ${new Date(dateOfEvent).toLocaleDateString()}) was not accepted by the assigned butler.`, '', '/dashboard')
               
          await storeNotification(butlerEmail, 'Booking Not Accepted In Time and has been removed from your assignments', '', '')

          // Email to Butler (late acceptance)
          const lateEmailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#fff; text-align:center; border:2px solid #ff1673; border-radius:12px;">
              <h2 style="color:#ff1673;">Booking Not Accepted in Time</h2>
              <p>Hello ${butlerName},</p>
              <p>The booking for ${firstName} ${lastName} (${serviceName} on ${new Date(dateOfEvent).toLocaleDateString()}) was not accepted in time and has been removed from your assignments.</p>
            </div>
          `;

          await transporter.sendMail({
            from: '"Hunky Butler Service"',
            to: butlerEmail,
            subject: "Booking Removed Due to Late Acceptance",
            html: lateEmailHtml,
          });


          // Email to Admin
          const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#fff; text-align:center; border:2px solid #ff1673; border-radius:12px;">
              <h2 style="color:#ff1673;">Booking Needs Reassignment</h2>
              <p>The booking for ${firstName} ${lastName} (${serviceName} on ${new Date(dateOfEvent).toLocaleDateString()}) was not accepted by the assigned butler.</p>
              <p>Kindly check the dashboard and reassign.</p>
            </div>
          `;

          await transporter.sendMail({
            from: '"Hunky Butler Service"',
            to: adminGmail, // admin
            subject: "Booking Requires Reassignment",
            html: adminEmailHtml,
          });

     


          console.log(`Butler removed from booking ${bookingId} due to no acceptance`);
        }
      } catch (err) {
        console.error("Error inside timeout:", err.message);
      }
    }, 15 * 60 * 1000); // 15 min

  } catch (error) {
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
    const bookings = await Booking.find({ butler: id });

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
      butler: id,
      status: "completed", 
    });

    
    const totalEarningThisMonth = await Booking.aggregate([
      {
        $match: {
          butler: id,
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

    res.status(200).json({
      totalBookingCompleted,
      totalEarningThisMonth: totalEarningThisMonth.length > 0 ? totalEarningThisMonth[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error,
    });
  }
};


