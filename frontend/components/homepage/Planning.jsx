"use client";
import { useGetBlogsQuery } from "@/features/blogApi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Planning = ({ title, highlight, description }) => {
  const { data = [] } = useGetBlogsQuery();
  const router = useRouter();

  // ✅ only first 3 active blogs
  const posts = data.slice(0, 3);

  return (
    <section className='max-w-[1240px] mx-auto px-4 py-4 md:py-12 pb-[500px]'>
      <div className='text-center mb-6 md:mb-20 space-y-6'>
        <h2 className='text-2xl md:text-5xl font-semibold'>
          {title}
          <span className='text-[#FF006A] italic'>{highlight}</span>
        </h2>
        <p className='text-base md:text-lg md:w-3/5 mx-auto'>{description}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6'>
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => router.push(`/blog/${post.slug}`)}
            className='rounded-2xl cursor-pointer overflow-hidden'>
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              title={post.title}
              width={396}
              height={372}
              className='w-full h-64 object-cover rounded-lg'
            />

            <div className='mt-4'>
              <p className='text-pink-600 text-sm font-medium'>
                {new Date(post.date || post.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </p>

              <h3 className='text-2xl font-semibold mt-2'>{post.title}</h3>

              <p className='text-[#808080] text-base mt-2 line-clamp-2'>
                {/* short preview from content */}
                {post.content?.replace(/<[^>]*>/g, "")?.slice(0, 120)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Planning;
