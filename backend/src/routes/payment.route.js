import { Router } from "express";
import { allPaymentHistory, createCheckoutSession, createCheckoutSessionExistngBooking, paymentHistoryForButler, paymentHistoryForCustomer } from "../controller/payment.controller.js";
import { verifyUser } from "../middleware/privateRoute.js";

const router = Router();

// Public routes (for quote form)
router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-checkout-session-exist', createCheckoutSessionExistngBooking);

// NOTE: '/mock-pay-success' was removed on purpose.
// It was an unauthenticated GET route that called handleSuccessfulPayment
// directly, so anyone who knew a booking id could mark that booking fully paid
// - and trigger the confirmation email - without any money changing hands.
// It existed only for sandbox testing and must never be reachable in production.

// Protected routes
router.get('/allPayments', verifyUser, allPaymentHistory)
router.get('/customer/:email', verifyUser, paymentHistoryForCustomer);
router.get('/butler/:id', verifyUser, paymentHistoryForButler);


export default router;
