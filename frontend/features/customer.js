import { prepareAuthHeaders } from "@/lib/apiAuth";
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
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