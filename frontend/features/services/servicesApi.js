import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service",
    }),
    addService: builder.mutation({
      query: (serviceData) => ({
        url: "/service",
        method: "POST",
        body: serviceData,
      }),
    }),
  }),
});

export const { useGetServicesQuery, useAddServiceMutation } = servicesApi; // ✅ named export
