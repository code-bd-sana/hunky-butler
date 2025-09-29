import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

export const GetAdminSummary = async (req, res) => {
  try {
    const now = new Date();

    // Current month start & end
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Find bookings created in current month
const totalMonthly = await Booking.countDocuments({
  createdAt: {
    $gte: startOfMonth,
    $lte: endOfMonth,
  },
});

const totalMonthlyData = await Booking.find({
  createdAt: {
    $gte: startOfMonth,
    $lte: endOfMonth,
  },
  paid:"Paid"
});

const activePerformer = await User.countDocuments({role:"butler"});

const unpaidBooking = await Booking.find({ paid: "unpaid" });

const totalPendingBooking = unpaidBooking.reduce((sum, booking) => {
  return sum + booking.price;
}, 0);

const toatlRevenue = totalMonthlyData.reduce((sum, booking) => {
  return sum + booking.price;
}, 0);




console.log(totalMonthly);

    res.status(200).json({ 
        booking:totalMonthly,
        performer: activePerformer ,
        pendingPayout: totalPendingBooking,
        revenue: toatlRevenue



    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error?.message,
    });
  }
};
