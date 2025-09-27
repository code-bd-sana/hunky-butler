// routes/index.js
import { Router } from 'express';
import auth from './authantication.route.js';
import otp from './otp.route.js';
import user from './user.route.js';
// import service from './Service.js';
import blogRoutes from './blogRoutes.js';

const router = Router();

// Mount routes
router.use('/auth', auth);
router.use('/otp', otp);
router.use('/user', user);
// router.use('/services', service);
router.use('/blogs', blogRoutes);


router.get('/', (req, res) => {
  return res.status(200).json({ message: 'High Tech Server Running successfully!' });
});

export default router;
