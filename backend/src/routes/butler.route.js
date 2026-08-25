import { Router } from "express";
import { getAllButler } from "../controller/butler.controller.js";

import { verifyUser } from "../middleware/privateRoute.js";

const router = Router();


router.get('/', verifyUser, getAllButler)
export default router;