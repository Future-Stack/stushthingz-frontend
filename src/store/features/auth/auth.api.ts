import { baseAPI } from "@/store/api/baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerClient: build.mutation({
      query: (data) => ({
        url: "/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyOTP: build.mutation({
      query: (data) => ({
        url: "/auth/signup-verify-otp/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    updatePassword: build.mutation({
      query: (payload) => ({
        url: "/user/update-password",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterClientMutation,
  useVerifyOTPMutation,
  useUpdatePasswordMutation,
} = userAPI;
