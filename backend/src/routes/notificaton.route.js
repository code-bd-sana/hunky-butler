import { Router } from "express";
import {
  createNotification,
  getNotification,
  getAudienceCount,
  markSeen,
  markSeenAllNotification,
} from "../controller/notificaiton.controller.js";
import { verifyUser, verifyAdmin } from "../middleware/privateRoute.js";

const router = Router();

// Declared before the `/:email` route below, otherwise Express matches
// "audience" as an email and this never runs.
router.get(`/audience/count`, verifyAdmin, getAudienceCount);

router.get(`/:email`, verifyUser, getNotification);
router.put(`/:id`, verifyUser, markSeen);
router.put('/markAll/:email', verifyUser, markSeenAllNotification);

// The broadcast was mounted with no middleware at all, while every other route
// here required a session. Any unauthenticated caller could write a message to
// every user on file. It is admin-only now.
router.post('/', verifyAdmin, createNotification);

export default router;
