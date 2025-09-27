import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    thumbnailUrl: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// indexes for fast queries
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
