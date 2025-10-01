import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 



export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: fetchBaseQuery({ baseUrl: base_url, credentials:"include" }),
    tagTypes: ["booking"], 
    endpoints: (builder) => ({
        getBooking: builder.query({
            query: ({ limit = 10, skip = 0, status="all" }) => `/booking/?skip=${skip}&limit=${limit}&&status=${status}`,
            providesTags: ["booking"]
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
        })

      

      


    })
});

export const { useGetBookingQuery, useBookingMutation, useUpdaterStatusMutation, useAssignToButlerMutation , useGetCustomerOverviwQuery, useGetButlerOverviwQuery  } = bookingApi;