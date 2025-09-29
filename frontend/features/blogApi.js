import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    // ✅ Fetch all blogs
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blogs"],
    }),

    // ✅ Fetch single blog by Slug
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blogs", slug }],
    }),

    // ✅ Add new blog
    addBlog: builder.mutation({
      query: (newBlog) => ({
        url: "/blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ Update blog (for edit or toggle status)
    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ Delete blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

// Export hooks
export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
