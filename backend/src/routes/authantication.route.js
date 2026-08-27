import { Router } from "express";
import { changePassword, fortgetPassword, login, userRegister } from "../controller/Authantication.controller.js";
import { verifyUser } from "../middleware/privateRoute.js";
import { limitByEmail, FIFTEEN_MINUTES } from "../middleware/rateLimit.js";

const router = Router();

router.post('/register', userRegister);

// Unlimited password guesses were accepted. The administrator password is
// currently "123", so the account could be taken in a few seconds, and every
// authorization rule in the system depends on it. Ten attempts per address in
// fifteen minutes leaves a real person who has forgotten their password plenty
// of room while making a password search useless.
router.post(
  '/login',
  limitByEmail({
    limit: 10,
    windowMs: FIFTEEN_MINUTES,
    scope: 'login',
    message: 'Too many sign in attempts for this account. Please wait a few minutes and try again.',
  }),
  login
);

// A reset both emails the account holder and lets an attacker work through OTPs.
router.put(
  '/forgotPassword',
  limitByEmail({
    limit: 5,
    windowMs: FIFTEEN_MINUTES,
    scope: 'forgot-password',
    message: 'Too many password reset attempts for this account. Please wait a few minutes and try again.',
  }),
  fortgetPassword
);

router.put('/changePassword', verifyUser, changePassword);

export default router;
