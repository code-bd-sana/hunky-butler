// features/butler.js
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const butlerApi = createApi({
  reducerPath: "butlerApi",
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
  tagTypes: ["butler"],
  endpoints: (builder) => ({
    getAllButler: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => 
        `/user/butlers?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["butler"],
    }),
    activeButler:builder.mutation({
      query:(email)=>({
        url:`/user/activeButler/${email}`,
        method:"PUT",


      })
    }),
    rejectButler:builder.mutation({
      query:(email)=>({
        url:`/user/rejectButler/${email}`,
        method:"PUT",


      })
    }),

    getServiceJoyBangla: builder.query({
      query:(slug)=>`/service/${slug}`
    })
  }),
});

export const { useGetAllButlerQuery , useActiveButlerMutation, useRejectButlerMutation,  useGetServiceJoyBanglaQuery} = butlerApi;

