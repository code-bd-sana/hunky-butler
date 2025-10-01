// features/butler.js
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const butlerApi = createApi({
  reducerPath: "butlerApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["butler"],
  endpoints: (builder) => ({
    getAllButler: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => 
        `/user/butlers?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["butler"],
    }),
  }),
});

export const { useGetAllButlerQuery } = butlerApi;