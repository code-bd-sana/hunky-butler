import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Blogs"],
  endpoints: (builder) => ({
    // Fetch all blogs
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blogs"],
    }),

    // Fetch single blog by Slug
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blogs", slug }],
    }),

    // Add new blog
    addBlog: builder.mutation({
      query: (newBlog) => ({
        url: "/blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogBySlugQuery, useAddBlogMutation } =
  blogApi;
