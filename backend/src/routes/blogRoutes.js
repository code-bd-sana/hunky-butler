import { Router } from "express";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";

const router = Router();

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
