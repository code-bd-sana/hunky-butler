import { Router } from "express";
import { login, userRegister } from "../controller/Authantication.controller.js";

const router = Router();


router.post('/register', userRegister);
router.post('/login', login)


export default router;