import { Router } from "express";
import { assginToButler, createBooking, deleteBooking, getAllBooking, getSingleBooking, updateStatus } from "../controller/booking.controller.js";

const router = Router();


router.get('/', getAllBooking);
router.post('/', createBooking);
router.get('/:id', getSingleBooking);
router.delete('/:id', deleteBooking);
router.put('/update', updateStatus);
router.put('/assign', assginToButler)

export default router;