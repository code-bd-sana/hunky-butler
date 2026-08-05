import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const summuryApi = createApi({
  reducerPath: "summuryApi",
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
