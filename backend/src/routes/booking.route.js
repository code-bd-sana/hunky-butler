import { Router } from "express";
import { assginToButler, createBooking, deleteBooking, getAllBooking, getBookingButler, getBookingCustomer, getBookingOverviewButler, getBookingOverviewCustomer, getButlerOverview,  updateStatus } from "../controller/booking.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/privateRoute.js";

const router = Router();


router.get('/', getAllBooking);
router.post('/', createBooking);
router.get('/:id', getBookingButler);
router.get('/customer/:email', getBookingCustomer)
router.delete('/:id', deleteBooking);
router.put('/update', updateStatus);
router.put('/assign', assginToButler);
router.get('/customerBooking/:email', getBookingOverviewCustomer);
router.get('/butlerBookingOverview/:id', getBookingOverviewButler);
router.get('/butlerOverview/:id', getButlerOverview)


export default router;