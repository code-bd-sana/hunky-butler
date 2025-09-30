"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import author from "@/public/Dashboard/article/author.png";
import WritingBlog from "./WritingBlog";
import {
  useGetBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/features/blogApi";

export default function ArticleManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [addNewArticle, setAddNewArticle] = useState(false);
  const [editArticle, setEditArticle] = useState(null); // track editing blog

  // Fetch blogs
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();

  // Mutations
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  // Keep local copy for UI
  const [localArticles, setLocalArticles] = useState([]);

  // Sync blogs -> local state
  useEffect(() => {
    if (blogs?.length) {
      setLocalArticles(
        blogs.map((b) => ({
          _id: b._id,
          title: b.title,
          content: b.content,
          tags: b.tags || [],
          date: new Date(b.date || b.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          author: b.author || "Unknown Author",
          image: b.thumbnailUrl || "/placeholder.png",
          status: b.status || "inactive",
        }))
      );
    }
  }, [blogs]);

  // Toggle status (connected with backend)
  const toggleArticleStatus = async (id, currentStatus) => {
    try {
      await updateBlog({
        id,
        status: currentStatus === "active" ? "inactive" : "active",
      }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Delete blog (connected with backend)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  // Filter logic
  const filteredArticles = localArticles.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return a.status === "active";
    if (activeTab === "inactive") return a.status === "inactive";
    return true;
  });

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading articles...</p>;
  }

  if (isError) {
    return <p className="p-4 text-red-500">Failed to load articles.</p>;
  }

  return (
    <div>
      <div className={`p-4 ${addNewArticle ? "hidden" : "block"}`}>
        {/* Tabs + Add Button */}
        <section className="lg:flex justify-between items-center">
          <ul className="p-2 bg-white rounded-full flex items-center gap-2 shadow-sm">
            <li
              className={`py-2 px-4 rounded-full cursor-pointer ${
                activeTab === "all" ? "bg-[#FF006A] text-white" : "text-[#555]"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All ({localArticles.length})
            </li>
            <li
              className={`py-2 px-4 rounded-full cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#FF006A] text-white"
                  : "text-[#555]"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active (
              {localArticles.filter((a) => a.status === "active").length})
            </li>
            <li
              className={`py-2 px-4 rounded-full cursor-pointer ${
                activeTab === "inactive"
                  ? "bg-[#FF006A] text-white"
                  : "text-[#555]"
              }`}
              onClick={() => setActiveTab("inactive")}
            >
              Inactive (
              {localArticles.filter((a) => a.status === "inactive").length})
            </li>
          </ul>

          <button
            onClick={() => {
              setAddNewArticle(true);
              setEditArticle(null); // ✅ new blog mode
            }}
            className="bg-[#FF006A] rounded-full mt-4 lg:mt-0 mx-auto lg:mx-0 px-5 py-3 cursor-pointer text-white flex items-center gap-2 shadow-md"
          >
            <FiPlus className="text-lg" />
            <span>Add New Article</span>
          </button>
        </section>

        {/* Article List */}
        <section className="mt-6 space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white rounded-2xl p-4 lg:flex items-center justify-between shadow"
            >
              {/* Left Side: Image + Info */}
              <div className="flex items-center gap-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  className="w-20 h-18 object-cover rounded-xl"
                  width={200}
                  height={200}
                />
                <div>
                  <h3 className="font-semibold text-[#141414]">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {article.date} |{" "}
                    <span className="inline-flex items-center gap-1">
                      <Image
                        src={author}
                        alt="author"
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="mt-2">{article.author}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: Status Toggle + Actions */}
              <div className="flex items-center gap-4">
                {/* Status Toggle Switch */}
                <div
                  className={`${
                    article.status === "active"
                      ? "bg-[#FF006A]"
                      : "bg-[#3D3D3D]"
                  } w-22 h-7 p-2 cursor-pointer rounded-2xl transition-colors duration-300 relative`}
                  onClick={() =>
                    toggleArticleStatus(article._id, article.status)
                  }
                >
                  {article.status === "active" && (
                    <span className="text-white ml-2 -mt-1 absolute text-sm mr-8">
                      Active
                    </span>
                  )}
                  <div
                    className={`${
                      article.status === "active"
                        ? "translate-x-7 -mt-[10px] mb-4 w-5 h-8 bg-white rounded-full ml-8"
                        : "translate-x-0 w-5 -mt-[10px] h-8 bg-white rounded-full -ml-2 -mb-4"
                    }  transition-all duration-300`}
                    style={{ boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)" }}
                  >
                    {article.status !== "active" && (
                      <span className="text-white absolute text-center ml-6 mr-8 text-sm mt-[4px]">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit + Delete */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setEditArticle(article); // ✅ set blog to edit
                    setAddNewArticle(true);
                  }}
                >
                  <FiEdit />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                  onClick={() => handleDelete(article._id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Writing Blog */}
      <section>
        {addNewArticle && (
          <WritingBlog
            initialData={editArticle} // ✅ pass if editing
            onClose={() => {
              setAddNewArticle(false);
              setEditArticle(null);
            }}
          />
        )}
      </section>
    </div>
  );
}
