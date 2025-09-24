import { Router } from "express";
import { sendOtp, verifyUser } from "../controller/otp.controller.js";

const router = Router();
router.post('/send/:email', sendOtp);
router.post('/verifyUser', verifyUser)


export default router;