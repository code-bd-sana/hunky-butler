"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetBlogsQuery } from "@/features/blogApi";

const BlogSection = () => {
  const router = useRouter();
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();

  if (isLoading) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 py-4 md:py-12">
        <p className="text-center text-gray-500">Loading blogs...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-[1240px] mx-auto px-4 py-4 md:py-12">
        <p className="text-center text-red-500">Failed to load blogs.</p>
      </section>
    );
  }

  // filter active blogs only
  const activeBlogs = blogs.filter((post) => post.status === "active");

  return (
    <section className="max-w-[1240px] mx-auto px-4 py-4 md:py-12 pb-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {activeBlogs.map((post) => (
          <div
            key={post._id}
            className="rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/blog/${post.slug}`)} 
          >
            {/* Thumbnail */}
            {post.thumbnailUrl && (
              <Image
                src={post.thumbnailUrl}
                alt="Hen party ideas and games UK"
                width={396}
                height={372}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            {/* Blog Info */}
            <div className="mt-4">
              <p className="text-pink-600 text-sm font-medium">
                {new Date(post.date || post.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
              <h3 className="text-lg sm:text-xl font-semibold mt-2 leading-snug text-[#141414] break-words [overflow-wrap:anywhere]">
                {post.title}
              </h3>
              <p className="text-[#808080] text-base mt-2">
                {post.content
                  ?.replace(/<[^>]+>/g, "")
                  .replace(post.title, "")
                  .trim()
                  .slice(0, 100)}
                ...
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
