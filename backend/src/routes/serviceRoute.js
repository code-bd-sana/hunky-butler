import express from "express";
import {
  getAllServices,
//   getServiceBySlug,
  createService,
  getServiceBySlug,
//   updateService,
//   deleteService
} from "../controller/ServiceController.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:slug", getServiceBySlug);
router.post("/", createService);
// router.put("/:slug", updateService);
// router.delete("/:slug", deleteService);

export default router;
