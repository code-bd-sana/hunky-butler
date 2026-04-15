"use client";
import RelatedBlog from "@/components/blog/RelatedBlog";
import BlogDetails from "@/components/BlogDetails/BlogDetails";
import Footer from "@/components/homepage/Footer";
import Banner from "@/components/shared/Banner";
import { useGetBlogBySlugQuery } from "@/features/blogApi";
import { store } from "@/store/store";
import { useParams } from "next/navigation";
import { Provider } from "react-redux";
import blogBg from "../../../../public/Blog/blog2.jpg";

const BlogDetailsContent = () => {
  const { slug } = useParams();
  const { data: blog, isLoading, isError } = useGetBlogBySlugQuery(slug);

  if (isLoading) return <p className='text-center py-10'>Loading blog...</p>;
  if (isError)
    return (
      <p className='text-center py-10 text-red-500'>Failed to load blog.</p>
    );
  if (!blog)
    return <p className='text-center py-10 text-gray-500'>Blog not found.</p>;

  return (
    <div className='min-h-screen mt-28 bg-white'>
      {/* <Banner
        image={blogBg}
        service='Blog'
        title={blog.title}
        description={new Date(blog.date || blog.createdAt).toLocaleDateString(
          "en-US",
          { month: "long", day: "numeric", year: "numeric" },
        )}
      /> */}
      <BlogDetails blog={blog} />
      <RelatedBlog currentBlog={blog} />
      <div className='mt-96'>
        <Footer />
      </div>
    </div>
  );
};

const BlogDetailsPage = () => {
  return (
    <Provider store={store}>
      <BlogDetailsContent />
    </Provider>
  );
};

export default BlogDetailsPage;
