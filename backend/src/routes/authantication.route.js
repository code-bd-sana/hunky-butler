import { Router } from "express";
import { changePassword, fortgetPassword, login, userRegister } from "../controller/Authantication.controller.js";
import { verifyUser } from "../middleware/privateRoute.js";

const router = Router();


router.post('/register', userRegister);
router.post('/login', login);
router.put('/forgotPassword', fortgetPassword);
router.put('/changePassword', verifyUser, changePassword);



export default router;