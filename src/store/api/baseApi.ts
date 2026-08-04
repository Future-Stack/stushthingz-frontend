import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { toast } from "react-toastify";
import { logout } from "../features/auth/auth.slice";

const baseQueryAPI = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
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

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    if (window.location.pathname !== "/login") {
      toast.error("Unauthorized or session expired. Please log in again.");
      window.location.href = "/login";
    }
  }

  const method = typeof args === "string" ? "GET" : args.method || "GET";

  if (method !== "GET") {
    if (result.error) {
      const errorData = result.error.data as any;
      if (result.error.status !== 401) {
        toast.error(errorData?.message || "An error occurred");
      }
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
  tagTypes: ["Auth", "Overview", "userProfile", "Property", "Wishlist", "InvestmentGuide", "BankPortal"],
  endpoints: () => ({}),
});
