import { Router } from "express";
import { allButler, allCustomer, getAllUsers, getPendingButler, myProfile, updateProfile } from "../controller/user.controller.js";

const router = Router();
router.get('/', getAllUsers);
router.get('/customers', allCustomer);
router.get('/butlers', allButler);
router.get('/profile/:id', myProfile);
router.put(`/updateProfile`, updateProfile);
router.get('/butlerApplicaiton', getPendingButler)
export default router;