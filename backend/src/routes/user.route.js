import { Router } from "express";
import { activeButler, allButler, allCustomer, getAllUsers, getPendingButler, myProfile, rejectButler, updateProfile } from "../controller/user.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/privateRoute.js";

const router = Router();
router.get('/', verifyAdmin, getAllUsers);
router.get('/customers', verifyAdmin, allCustomer);
router.get('/butlers', verifyAdmin, allButler);
router.get('/profile/:id', verifyUser, myProfile);
router.put(`/updateProfile`, verifyUser, updateProfile);
router.get('/all/butlerApplicaiton', verifyAdmin, getPendingButler);
router.put(`/activeButler/:email`, verifyAdmin, activeButler);
router.put(`/rejectButler/:email`, verifyAdmin, rejectButler)

export default router;