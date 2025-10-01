import { Router } from "express";
import { allButler, allCustomer, getAllUsers } from "../controller/user.controller.js";

const router = Router();
router.get('/', getAllUsers);
router.get('/customers', allCustomer);
router.get('/butlers', allButler)
export default router;