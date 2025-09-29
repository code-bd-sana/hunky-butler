import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    
    baseQuery: fetchBaseQuery({ baseUrl: base_url, credentials:"include" }),
    tagTypes: ["booking"], 
    endpoints: (builder) => ({
        getBooking: builder.query({
            query: () => "/booking",
            providesTags: ["booking"]
        }),
        booking:builder.mutation({
            query:(data)=>({
                url:'/booking',
                method:"POST",
                body:data
            })
        })
    })
});


export const { useGetBookingQuery, useBookingMutation } = bookingApi;
