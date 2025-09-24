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




  }),
});

export const { useSaveRegisterMutation, useLoginMutation,   useVerifyOtpMutation, useSendOtpMutation } = authApi;
