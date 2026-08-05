import { Router } from "express";
import { allPaymentHistory, createCheckoutSession, createCheckoutSessionExistngBooking, paymentHistoryForButler, paymentHistoryForCustomer } from "../controller/payment.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/privateRoute.js";

const router = Router();

// Public routes (for quote form)
router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-checkout-session-exist', createCheckoutSessionExistngBooking);

// Protected routes
router.get('/allPayments', verifyAdmin, allPaymentHistory);
router.get('/customer/:email', verifyUser, paymentHistoryForCustomer);
router.get('/butler/:id', verifyUser, paymentHistoryForButler);


export default router;

