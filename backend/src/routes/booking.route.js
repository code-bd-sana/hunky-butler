import { Router } from "express";
import { assginToButler, createBooking, deleteBooking, getAllBooking, getBookingButler, getBookingCustomer, getBookingOverviewButler, getBookingOverviewCustomer, getButlerOverview,  updateStatus } from "../controller/booking.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/privateRoute.js";

const router = Router();


router.get('/', verifyAdmin, getAllBooking);
router.post('/', createBooking); // Public for quote form
router.get('/:id', verifyUser, getBookingButler);
router.get('/customer/:email', verifyUser, getBookingCustomer)
router.delete('/:id', verifyAdmin, deleteBooking);
router.put('/update', verifyUser, updateStatus);
router.put('/assign', verifyAdmin, assginToButler);
router.get('/customerBooking/:email', verifyUser, getBookingOverviewCustomer);
router.get('/butlerBookingOverview/:id', verifyUser, getBookingOverviewButler);
router.get('/butlerOverview/:id', verifyUser, getButlerOverview)


export default router;


