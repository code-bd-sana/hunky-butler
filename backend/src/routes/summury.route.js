import { Router } from "express";
import { GetAdminSummary } from "../controller/summury.controller.js";

const router = Router();


router.get('/admin', GetAdminSummary)


export default router;