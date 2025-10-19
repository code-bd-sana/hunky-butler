import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const summuryApi = createApi({
  reducerPath: "summuryApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url, credentials: "include" }),
  tagTypes: ["summuryApi"],
  endpoints: (builder) => ({
    getAdminSummury: builder.query({
      query: () => "/summury/admin",
      providesTags: ["summuryApi"],
    }),
 getCustomerSummury: builder.query({
  // remove extra }
  query: (email) => `summury/customer/${encodeURIComponent(email)}`,
  providesTags: ["summuryApi"],
}),

  }),
});

export const { useGetAdminSummuryQuery, useGetCustomerSummuryQuery } = summuryApi;
