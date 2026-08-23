import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: async (headers) => {
      if (typeof window !== "undefined") {
        const session = await getSession();
        if (session?.user?.email) {
          headers.set("x-user-email", session.user.email);
          headers.set("x-user-role", session.user.role || "customer");
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Blogs"],

  endpoints: (builder) => ({
    // ✅ Fetch all blogs
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blogs"],
    }),

    // Admin listing, includes unpublished drafts. The public /blogs route
    // returns published posts only, so the dashboard needs this one.
    getAllBlogsForAdmin: builder.query({
      query: () => "/blogs/admin/all",
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
  useGetAllBlogsForAdminQuery,
  useGetBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
