import { Router } from "express";
import { getAllButler } from "../controller/butler.controller.js";

const router = Router();


router.get('/', getAllButler)
export default router;