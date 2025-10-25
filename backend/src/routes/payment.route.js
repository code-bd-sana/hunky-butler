import { Router } from "express";
import { allPaymentHistory, createCheckoutSession, createCheckoutSessionExistngBooking,  paymentHistoryForButler, paymentHistoryForCustomer } from "../controller/payment.controller.js";

const router = Router();
router.post('/create-checkout-session', createCheckoutSession);
router.get('/allPayments', allPaymentHistory)
router.post('/create-checkout-session-exist', createCheckoutSessionExistngBooking);
router.get('/customer/:email', paymentHistoryForCustomer);
router.get('/butler/:id', paymentHistoryForButler);



export default router;