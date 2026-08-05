import express from "express";
import {
  getAllServices,
  createService,
  getServiceBySlug,
  updateService,
  deleteService,
} from "../controller/ServiceController.js";
import { verifyAdmin } from "../middleware/privateRoute.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:slug", getServiceBySlug);
router.post("/", verifyAdmin, createService);
router.put("/:slug", verifyAdmin, updateService);
router.delete("/:id", verifyAdmin, deleteService);

export default router;

