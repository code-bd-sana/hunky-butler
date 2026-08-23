import { Router } from "express";

import {
  createBlog,
  getBlogs,
  getAllBlogsForAdmin,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";
import { verifyAdmin } from "../middleware/privateRoute.js";

const router = Router();

router.post("/", verifyAdmin, createBlog);
// Public listing: published posts only.
router.get("/", getBlogs);
// Admin listing: includes drafts. Declared before "/:slug" so the two-segment
// path is matched here rather than being treated as a slug.
router.get("/admin/all", verifyAdmin, getAllBlogsForAdmin);
router.get("/:slug", getBlogBySlug);
router.put("/:id", verifyAdmin, updateBlog);
router.delete("/:id", verifyAdmin, deleteBlog);

export default router;

