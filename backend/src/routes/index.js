import { Router } from "express"
import auth from './authantication.route.js'
import otp from './otp.route.js'
import user from './user.route.js'

const router = Router();



router.use('/auth', auth);
router.use("/otp", otp)
router.use('/user', user)
router.get('/', (req, res)=>{
    return res.status(200).json({
        message:"Server Running successfully!"
    })
})

export default router;