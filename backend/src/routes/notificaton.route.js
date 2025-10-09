import { Router } from "express";
import { getNotification, markSeen, markSeenAllNotification } from "../controller/notificaiton.controller.js";

const router = Router();
router.get(`/:email`, getNotification);
router.put(`/:id`, markSeen);
router.put('/markAll/:email', markSeenAllNotification)
export default router;