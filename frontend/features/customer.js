import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
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
  tagTypes: ["customer"],
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => 
        `/user/customers?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["customer"],
    }),
  }),
});

export const { useGetAllCustomerQuery } = customerApi;