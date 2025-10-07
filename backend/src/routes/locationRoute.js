import express from "express";
import { getAllLocations } from "../controller/LocationController.js";

const router = express.Router();

router.get("/", getAllLocations);

export default router;
