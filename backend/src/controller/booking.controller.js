import Booking from "../models/booking.model.js";

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

export const getSingleBooking = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Booking.findOne({ _id: id });
    res.status(200).json({
      message: "Success",
      data,
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
    const newData = new Booking(data);
    const savedData = await newData.save();
    const {email} = req.body;
      res.status(200).json({
      message: "Success",
      data: savedData,
    });
    await User.updateOne(
  { email: email },
  { $inc: { serviceTaken: 1 } }  
);

    res.status(200).json({
      message: "Success",
      data: savedData,
    });
  } catch (error) {
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
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const updated = await Booking.updateOne(
      { _id: id },
      {
        $set: {
          status: status,
        },
      }
    );

    if (status === "completed") {
      await Booking.updateOne(
        { _id: id },
        {
          $set: {
            paid: "Paid",
          },
        }
      );
    }

    res.status(200).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const assginToButler = async (req, res) => {
  try {
    const { butlerId, bookingId } = req.body;
    const updatedBookings = await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          butler: butlerId,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updatedBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong!",
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

