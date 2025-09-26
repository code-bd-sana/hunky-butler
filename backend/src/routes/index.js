import { Router } from "express";
import auth from "./authantication.route.js";
import otp from "./otp.route.js";
import service from "./services.js";

const router = Router();

router.use("/auth", auth);
router.use("/otp", otp);
router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server Running successfully!",
  });
});
router.use("/services", service);

export default router;
