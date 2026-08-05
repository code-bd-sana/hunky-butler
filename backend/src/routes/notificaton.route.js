import { Router } from "express";
import { createNotification, getNotification, markSeen, markSeenAllNotification } from "../controller/notificaiton.controller.js";
import { verifyUser } from "../middleware/privateRoute.js";

const router = Router();
router.get(`/:email`, verifyUser, getNotification);
router.put(`/:id`, verifyUser, markSeen);
router.put('/markAll/:email', verifyUser, markSeenAllNotification);
router.post('/', createNotification);
export default router;