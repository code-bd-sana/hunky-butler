import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/services",
    }),
  }),
});

export const { useGetServicesQuery } = servicesApi; // ✅ named export
