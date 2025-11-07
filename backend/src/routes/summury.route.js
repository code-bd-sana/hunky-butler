import { Router } from "express";
import { GetAdminSummary, GetCustomerSummury } from "../controller/summury.controller.js";

const router = Router();


router.get('/admin', GetAdminSummary);
router.get('/customer/:email', GetCustomerSummury)


export default router;