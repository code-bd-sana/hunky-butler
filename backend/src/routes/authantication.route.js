import { Router } from "express";
import { fortgetPassword, login, userRegister } from "../controller/Authantication.controller.js";

const router = Router();


router.post('/register', userRegister);
router.post('/login', login);
router.put('/forgotPassword', fortgetPassword)



export default router;