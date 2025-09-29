import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // note '/react'

export const butlerApi = createApi({
  reducerPath: "butlerApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["butler"],
  endpoints: (builder) => ({
    getAllButler: builder.query({
      query: () => `/butler`,
      providesTags: ["butler"],
    }),
  }),
});

export const { useGetAllButlerQuery } = butlerApi;
