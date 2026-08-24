import { prepareAuthHeaders } from "@/lib/apiAuth";
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: base_url,
        credentials: "include",
        prepareHeaders: prepareAuthHeaders,
    }),
    tagTypes: ["booking"],
 
    endpoints: (builder) => ({
        getBooking: builder.query({
            query: ({ limit = 10, skip = 0, status="all" }) => `/booking/?skip=${skip}&limit=${limit}&&status=${status}`,
            providesTags: ["booking"]
        }),
        getBookingButler: builder.query({
            query: ({ limit = 10, skip = 0, status="all", id }) => `/booking/${id}/?skip=${skip}&limit=${limit}&&status=${status}`,
            providesTags: ["booking"]
        }),
        getBookingCustomer: builder.query({
            query: ({ limit = 10, skip = 0, status="all", email }) => `/booking/customer/${email}/?skip=${skip}&limit=${limit}&&status=${status}`,
            providesTags: ["bookingCustomer"]
        }),
        booking: builder.mutation({
            query: (data) => ({
                url: '/booking',
                method: "POST",
                body: data
            })
        }),
          updaterStatus: builder.mutation({
            query:(data)=>({
                url:'/booking/update',
                method:"PUT",
                body:data
                 
            })
        }),

        assignToButler:builder.mutation({
            query:(data)=>({
                url:'/booking/assign',
                method:"PUT",
                body:data
            })
        }),

        getCustomerOverviw:builder.query({
            query:(email)=> `/booking/customerBooking/${email}`
        }),
        getButlerOverviw:builder.query({
            query:(id)=> `/booking/butlerBookingOverview/${id}`
        }),
        submitReview:builder.mutation({
            query:(data)=>({
                url:'/review',
                method:"POST",
                body:data
            })

        }),
        getButlerPersonalOverview:builder.query({
            query:(id)=> `/booking/butlerOverview/${id}`
        }),
      // features/booking/bookingApi.ts
getPaymentHistory: builder.query({
  query: ({ skip = 0, limit = 5 }) => 
    `/payment/allPayments?skip=${skip}&limit=${limit}`
}),
getCustomerPaymentHistory: builder.query({
    query:({skip = 0 , limit = 5, email })=>
        `/payment/customer/${email}/?skip=${skip}&limit=${limit}` 
}),
getButlerPaymentHistory: builder.query({
    query:({skip = 0 , limit = 5, id })=>
        `/payment/butler/${id}/?skip=${skip}&limit=${limit}` 
})

      

      


    })
});

export const { useGetBookingQuery, useBookingMutation, useUpdaterStatusMutation, useAssignToButlerMutation , useGetCustomerOverviwQuery, useGetButlerOverviwQuery, useGetBookingButlerQuery, useGetBookingCustomerQuery , useSubmitReviewMutation , useGetButlerPersonalOverviewQuery, useGetPaymentHistoryQuery, useGetCustomerPaymentHistoryQuery,     useGetButlerPaymentHistoryQuery  } = bookingApi;