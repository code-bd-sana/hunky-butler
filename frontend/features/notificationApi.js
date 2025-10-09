import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    myNotification: builder.query({
      query: (email) => `/notification/${email}`,
      providesTags: ["notification"],
    }),

    markSeen: builder.mutation({
      query:(id) => ({
        url:`/notification/${id}`,
        method: "PUT",
        
      }),
      providesTags:["notification"]
    }),
    markSeenAll: builder.mutation({
      query:(email) => ({
        url:`/notification/markAll/${email}`,
        method: "PUT",
        
      }),
      providesTags:["notification"]
    })
  }),
});

export const { useMyNotificationQuery, useMarkSeenMutation, useMarkSeenAllMutation } = notificationApi;
