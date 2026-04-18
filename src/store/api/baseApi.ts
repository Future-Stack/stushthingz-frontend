import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const baseQueryAPI = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL, // Vite env variable — set in .env as VITE_API_URL=https://your-api.com
  // For Next.js use: process.env.NEXT_PUBLIC_SERVER_URL
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryAPI,
  tagTypes: ["Auth", "Overview", "userProfile"],
  endpoints: () => ({}),
});
