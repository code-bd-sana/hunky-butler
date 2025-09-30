import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service",
      providesTags: ["Service"],
    }),
    getService: builder.query({
      query: (slug) => `/service/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Service", id: slug }],
    }),
    addService: builder.mutation({
      query: (serviceData) => ({
        url: "/service",
        method: "POST",
        body: serviceData,
      }),
    }),
    // Update service by slug
    updateService: builder.mutation({
      query: ({ slug, ...data }) => ({
        url: `/service/${slug}`,
        method: "PUT",
        body: data, // ekhane 'data' holo FormData
        // **Content-Type na set korlei browser auto handle korbe multipart/form-data**
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Service", id: slug },
      ],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useAddServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi; // ✅ named export
