// redux/services/authApi.js or wherever you defined it

import { base_url } from '@/utils/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${base_url}` }),
  endpoints: (builder) => ({
    saveRegister: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),

   
    sendOtp: builder.mutation({
      query: (email) => ({
        url: `/otp/send/${email}`,
        method: 'POST',
      }),
    }),
    verifyOtp: builder.mutation({
  query: (data) => ({
    url: `/otp/verifyUser`,
    method: 'POST',
    body: data,
  }),
}),

   
  
forgotPassword: builder.mutation({
  query: (data) => ({
    url: '/auth/forgotPassword',
    method: 'PUT',
    body: data, 
  }),
}),

    getAllUser: builder.query({
            query: () => `/user`,
            providesTags: ["user"]
        }),
        myProfile:builder.query({
          query:(id)=> `user/profile/${id}`,
          providesTags: ['user']
        }),


        updateMyProfile: builder.mutation({
         
            query:(data) => ({
              url:`/user/updateProfile`,
              method:"PUT",
              body: data
            
          })
        }),
        changePassword: builder.mutation({
          query:(data)=>({
            url:`/auth/changePassword`,
            method:"PUT",
            body:data

           
          })
        })




  }),
});

export const { useSaveRegisterMutation, useLoginMutation,   useVerifyOtpMutation, useSendOtpMutation, useForgotPasswordMutation, useGetAllUserQuery, useMyProfileQuery, useUpdateMyProfileMutation, useChangePasswordMutation } = authApi;
