import { Router } from "express";
import { sendOtp, verifyUser } from "../controller/otp.controller.js";
import { limitByEmail, FIFTEEN_MINUTES } from "../middleware/rateLimit.js";

const router = Router();

// Open and unlimited, so anyone could have this address emailed repeatedly, at
// the cost of the mail reputation of the sending domain as well as the nuisance.
router.post(
  '/send/:email',
  limitByEmail({
    limit: 5,
    windowMs: FIFTEEN_MINUTES,
    scope: 'otp-send',
    message: 'Too many codes requested for this address. Please wait a few minutes and try again.',
  }),
  sendOtp
);

router.post('/verifyUser', verifyUser);

export default router;
