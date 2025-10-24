import { Router } from "express";
import { allPaymentHistory, createCheckoutSession, createCheckoutSessionExistngBooking, getSquareLocations, paymentHistoryForButler, paymentHistoryForCustomer } from "../controller/payment.controller.js";

const router = Router();
router.post('/create-checkout-session', createCheckoutSession);
router.get('/allPayments', allPaymentHistory)
router.post('/create-checkout-session-exist', createCheckoutSessionExistngBooking);
router.get('/customer/:email', paymentHistoryForCustomer);
router.get('/butler/:id', paymentHistoryForButler);
router.get('/aso', getSquareLocations)


export default router;