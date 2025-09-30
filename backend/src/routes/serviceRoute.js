import express from "express";
import {
  getAllServices,
  createService,
  getServiceBySlug,
  updateService,
  deleteService,
} from "../controller/ServiceController.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:slug", getServiceBySlug);
router.post("/", createService);
router.put("/:slug", updateService);
router.delete("/:id", deleteService);

export default router;
