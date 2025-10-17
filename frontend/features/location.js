import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({ baseUrl:  base_url }),
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
