import Blog from "../models/Blog.js";

// Create
export const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Read all published posts.
 *
 * This endpoint is public and unauthenticated, and it was returning every post
 * regardless of status. That included unpublished drafts, which at the time of
 * writing were placeholder lorem-ipsum records. The listing page filtered them
 * out in the UI, but anyone calling the API directly still saw them.
 *
 * Drafts are filtered here, at the boundary. The admin dashboard uses
 * getAllBlogsForAdmin below, which is behind verifyAdmin.
 */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Read every post, including drafts. Admin only.
 *
 * The public route above deliberately cannot serve drafts, so the dashboard
 * needs its own authenticated route to manage unpublished content.
 */
export const getAllBlogsForAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one (by slug instead of id)
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
