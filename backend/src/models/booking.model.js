import mongoose from "mongoose";
import User from "./user.model.js";

const bookingSchema = mongoose.Schema(
  {
    firstName: {
      type: String,

      required: [true, "First Name is Required"],
    },

    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
    },

    phone: {
      type: String,
      required: [true, "Phone Number is Required"],
    },
    postCode: {
      type: Number,
      required: [true, "Post Code is required"],
    },
    dateOfEvent: {
      type: Date,
      required: [true, "Date Of Evenet is Required"],
    },
    numberOfStaff: {
      type: Number,
      required: [true, "Number Of Staff is Required"],
    },
    startTime: {
      type: String,
      required: [true, "Start Time is Required"],
    },

    durationHours: {
      type: Number,
      required: [true, "Duration Hours is Required"],
    },
    durationMinutes: {
      type: Number,
      required: [true, "Duration Minutes Is Required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service Name is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    status: {
      type: String,
      enum: ["completed", "ongoing", "cancel", "cancelled", "accepted"],
      default: "ongoing",
    },
    butler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },

    paid: {
      type: String,
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
