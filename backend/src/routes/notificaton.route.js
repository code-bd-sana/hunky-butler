import { Router } from "express";
import { createNotification, getNotification, markSeen, markSeenAllNotification } from "../controller/notificaiton.controller.js";

const router = Router();
router.get(`/:email`, getNotification);
router.put(`/:id`, markSeen);
router.put('/markAll/:email', markSeenAllNotification);
router.post('/', createNotification)
export default router;