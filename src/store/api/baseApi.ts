import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { toast } from "react-toastify";

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

const baseQueryWithToast: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryAPI(args, api, extraOptions);

  const method = typeof args === "string" ? "GET" : args.method || "GET";

  if (method !== "GET") {
    if (result.error) {
      const errorData = result.error.data as any;
      toast.error(errorData?.message || "An error occurred");
    } else if (result.data) {
      const data = result.data as any;
      if (data?.message) {
        toast.success(data.message);
      }
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithToast,
  tagTypes: ["Auth", "Overview", "userProfile"],
  endpoints: () => ({}),
});
