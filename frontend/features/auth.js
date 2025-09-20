
import { base_url } from '@/utils/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${base_url}/auth` }),
  endpoints: (builder) => ({
  
    saveRegister: builder.mutation({

          query: ( data) => ({
        url: `/register`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({

          query: ( data) => ({
        url: `/login`,
        method: 'POST',
        body: data,
      }),
    })
  }),
})


export const { useSaveRegisterMutation, useLoginMutation } = authApi;