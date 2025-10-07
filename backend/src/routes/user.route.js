import { Router } from "express";
import { activeButler, allButler, allCustomer, getAllUsers, getPendingButler, myProfile, rejectButler, updateProfile } from "../controller/user.controller.js";

const router = Router();
router.get('/', getAllUsers);
router.get('/customers', allCustomer);
router.get('/butlers', allButler);
router.get('/profile/:id', myProfile);
router.put(`/updateProfile`, updateProfile);
router.get('/all/butlerApplicaiton', getPendingButler);
router.put(`/activeButler/:email`, activeButler);
router.put(`/rejectButler/:email`, rejectButler)

export default router;