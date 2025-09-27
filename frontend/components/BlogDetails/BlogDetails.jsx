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
              alt={blog.title}
              fill
              className="object-cover rounded-t-2xl"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="p-6 md:p-10 space-y-6 relative z-10">
          {/* Render HTML content */}
          <div
            className="blog-content text-gray-600 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog?.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
