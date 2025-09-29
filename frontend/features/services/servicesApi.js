import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service",
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
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Service", id: slug },
      ],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useAddServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
} = servicesApi; // ✅ named export
