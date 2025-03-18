import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = process.env.REACT_APP_OPEN_DOTA_API_KEY;

export const opendotaApi = createApi({
  reducerPath: "opendotaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.opendota.com/api",
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `/players/${id}${API_KEY ? `?api_key=${API_KEY}` : ""}`,
    }),
    getLastMatches: builder.query({
      query: (id) =>
        `/players/${id}/matches${API_KEY ? `?api_key=${API_KEY}` : ""}`,
    }),
    getMatchInfo: builder.query({
      query: (id) => `/matches/${id}${API_KEY ? `?api_key=${API_KEY}` : ""}`,
    }),
  }),
});

export const { useGetUserQuery, useGetLastMatchesQuery, useGetMatchInfoQuery } =
  opendotaApi;
