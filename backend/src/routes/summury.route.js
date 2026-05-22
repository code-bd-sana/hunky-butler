import { Router } from "express";
import { GetAdminSummary, GetCustomerSummury } from "../controller/summury.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/privateRoute.js";

const router = Router();


router.get('/admin', verifyAdmin, GetAdminSummary);
router.get('/customer/:email', verifyUser, GetCustomerSummury)


export default router;