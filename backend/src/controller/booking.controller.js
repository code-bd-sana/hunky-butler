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
