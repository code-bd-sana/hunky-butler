import { prepareAuthHeaders } from "@/lib/apiAuth";
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
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
    }),
    createNotification: builder.mutation({
      query:(data)=>({
        url:`/notification`,
        method: "POST",
        body:data
      })
    })

  }),
});

export const { useMyNotificationQuery, useMarkSeenMutation, useMarkSeenAllMutation, useCreateNotificationMutation } = notificationApi;
