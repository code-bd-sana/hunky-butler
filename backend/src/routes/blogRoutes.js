import { Router } from "express";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";
import { verifyAdmin } from "../middleware/privateRoute.js";

const router = Router();

router.post("/", verifyAdmin, createBlog);
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.put("/:id", verifyAdmin, updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);

export default router;

