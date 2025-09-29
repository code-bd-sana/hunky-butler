"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetBlogsQuery } from "@/features/blogApi";

const RelatedBlog = ({ currentBlog }) => {
  const router = useRouter();
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load blogs.</p>;

  // All active blogs except current
  const activeBlogs = blogs.filter(
    (b) => b._id !== currentBlog._id && b.status === "active"
  );

  // Step 1: Tag-based related blogs
  let relatedBlogs = activeBlogs.filter((b) =>
    b.tags?.some((tag) => currentBlog.tags?.includes(tag))
  );

  // Step 2: Ensure we always return exactly 3
  if (relatedBlogs.length < 3) {
    // Get blogs not already in related
    const remaining = activeBlogs.filter(
      (b) => !relatedBlogs.some((rb) => rb._id === b._id)
    );

    // Shuffle & pick enough to fill 3
    const filler = remaining
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 - relatedBlogs.length);

    relatedBlogs = [...relatedBlogs, ...filler];
  }

  // Always cap at 3 blogs
  relatedBlogs = relatedBlogs.slice(0, 3);

  return (
    <section className="max-w-[1240px] mx-auto px-4 py-4 md:py-12">
      <div className="text-center mb-6 md:mb-20 space-y-6">
        <h1 className="text-2xl md:text-5xl font-semibold">
          Related <span className="text-[#FF006A] italic">Blog</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {relatedBlogs.map((post) => (
          <div
            key={post._id}
            className="rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/blog/${post.slug}`)}
          >
            {/* Thumbnail */}
            {post.thumbnailUrl && (
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
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
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
              <h3 className="text-2xl font-semibold mt-2">{post.title}</h3>
              <p className="text-[#808080] text-base mt-2">
                {post.content
                  ?.replace(/<[^>]+>/g, "")
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

export default RelatedBlog;
