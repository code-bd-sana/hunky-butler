"use client";

import React from "react";
import Image from "next/image";

const BlogDetails = ({ blog }) => {
  return (
    <div
      className="py-10 px-4 flex justify-center relative"
      style={{
        backgroundImage: "url('/BlogDetails/blogDetailsBg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
      }}
    >
      <div className="max-w-[1240px] w-full bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Top Image (from backend) */}
        {blog?.thumbnailUrl && (
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={blog.thumbnailUrl}
              alt="Hen party ideas and games UK"
              fill
              className="object-cover rounded-t-2xl"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="p-6 md:p-10 space-y-6 relative z-10">
          {blog?.title && (
            <header className="space-y-2 border-b border-gray-100 pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-[#141414] break-words [overflow-wrap:anywhere]">
                {blog.title}
              </h1>
              <p className="text-sm sm:text-base font-medium text-pink-600">
                {new Date(blog.date || blog.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
            </header>
          )}

          {/* Render HTML content */}
          <div
            className="blog-content text-gray-600 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog?.content }}
          />

          {/* Tags Section */}
          {blog?.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-[#FF006A] hover:text-white cursor-pointer transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
