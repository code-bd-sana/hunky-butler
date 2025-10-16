import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: () => "locations",
    }),
    getLocationBySlug: builder.query({
      query: (slug) => `locations/${slug}`,
    }),
  }),
});

export const { useGetLocationsQuery, useGetLocationBySlugQuery } = locationApi;
