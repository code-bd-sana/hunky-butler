import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
export const GetAdminSummary = async (req, res) => {
  try {
    const now = new Date();

    // Current month start & end
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

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
   
    });

    const totalCustomerThisMonths = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      role: "customer",
    });

    const activePerformer = await User.countDocuments({ role: "butler" });
    const totalCustomer = await User.countDocuments({ role: "customer" });

    // Get all unpaid, pending, and deposit_paid bookings
    const unpaidBookings = await Booking.find({
      paid: { $in: ["unpaid", "pending", "deposit_paid"] }
    });

    const activeBooking = await Booking.countDocuments({ status: "ongoing" });
    const totalVerifiedButler = await User.countDocuments({
      role: 'butler',
      isVerified: true
    });

    // Calculate total pending payout
    const totalPendingBooking = unpaidBookings.reduce((sum, booking) => {
      if (booking.paid === "deposit_paid") {
        // For deposit_paid, subtract $20 from the price
        return sum + (booking.price - 20);
      } else {
        // For unpaid and pending, use full price
        return sum + booking.price;
      }
    }, 0);

    const toatlRevenue = totalMonthlyData.reduce((sum, booking) => {
      return sum + booking.price;
    }, 0);

    console.log(totalMonthly);

    res.status(200).json({
      booking: totalMonthly,
      performer: activePerformer,
      pendingPayout: totalPendingBooking,
      revenue: toatlRevenue,
      totalCustomer: totalCustomer,
      activeBooking: activeBooking,
      totalCustomerThisMonths: totalCustomerThisMonths,
      totalVerifiedButler: totalVerifiedButler
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error?.message,
    });
  }
};
