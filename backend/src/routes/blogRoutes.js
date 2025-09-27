import { Router } from "express";

import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";

const router = Router();

router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
