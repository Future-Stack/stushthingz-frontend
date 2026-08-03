import { AddUserFormData } from "@/pages/Admin/components/modals/AddUserModal";
import { baseAPI } from "@/store/api/baseApi";
import { TUser } from "@/store/storeTypes/user";

// ─── Request Types ──────────────────────────────────────────────────────────

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type TVerifyRegisterOtpRequest = {
  email: string;
  otp: string;
};

export type TResendRegisterOtpRequest = {
  email: string;
};

export type TForgotPasswordRequest = {
  email: string;
};

export type TVerifyForgotPasswordOtpRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type TChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────

export type TLoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};

export type TVerifyRegisterOtpResponse = {
  success: boolean;
  message: string;
  data: {
    result: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    sessionId: string;
  };
};

export type TGetMeResponse = {
  success: boolean;
  message: string;
  data: TUser;
};

export type TAdminDashboardStatsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    investors: number;
    bankOperators: number;
    totalProperties: number;
  };
};

export type TAllUsersQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
};

export type TBackendUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  isVerified: boolean;
};

export type TAllUsersResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: TBackendUser[];
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const authAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // POST /auth/login
    login: build.mutation<TLoginResponse, TLoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // GET /auth/me
    getMe: build.query<TGetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // POST /auth/register  (multipart/form-data — send only name, email, password)
    register: build.mutation<{ success: boolean; message: string }, TRegisterRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        return {
          url: "/auth/register",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    // POST /auth/verify-register-otp
    verifyRegisterOtp: build.mutation<TVerifyRegisterOtpResponse, TVerifyRegisterOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-register-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // POST /auth/resend-register-otp
    resendRegisterOtp: build.mutation<{ success: boolean; message: string }, TResendRegisterOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-register-otp",
        method: "POST",
        body: data,
      }),
    }),

    // POST /auth/forgotten-password
    forgotPassword: build.mutation<{ success: boolean; message: string }, TForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgotten-password",
        method: "POST",
        body: data,
      }),
    }),

    // POST /auth/verify-forgotten-password-otp
    verifyForgotPasswordOtp: build.mutation<{ success: boolean; message: string }, TVerifyForgotPasswordOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-forgotten-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    // POST /auth/change-password
    changePassword: build.mutation<{ success: boolean; message: string }, TChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),


    // create user by admin
    createUserByAdmin: build.mutation<{ success: boolean; message: string }, AddUserFormData>({
      query: (data) => {
        return {
          url: "/auth/admin-create-user",
          method: "POST",
          body: data,
        };
      },
    }),

    // GET /auth/admin/dashboard-stats
    getAdminDashboardStats: build.query<TAdminDashboardStatsResponse, void>({
      query: () => ({
        url: "/auth/admin/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["Overview"],
    }),

    // GET /auth/all-users
    getAllUsers: build.query<TAllUsersResponse, TAllUsersQueryParams>({
      query: (params) => ({
        url: "/auth/all-users",
        method: "GET",
        params,
      }),
      providesTags: ["Auth"],
    }),

    // PATCH /auth/update-user-status/:id
    updateUserStatus: build.mutation<{ success: boolean; message: string }, { id: string; status: "active" | "suspended" }>({
      query: ({ id, status }) => ({
        url: `/auth/update-user-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Auth", "Overview"],
    }),

    // POST /auth/logout
    logoutUser: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // PATCH /auth/profile (multipart/form-data — text fields + optional image for S3)
    updateProfile: build.mutation<{ success: boolean; message: string; data: TUser }, FormData>({
      query: (formData) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Auth", "userProfile"],
    }),

    // GET /auth/progress-tracker
    getProgressTracker: build.query<{
      success: boolean;
      data: {
        overallReadiness: number;
        onboarding: { percentage: number; status: string };
        financialReadiness: { percentage: number; status: string };
        investmentGuide: { percentage: number; completedSections: number; totalSections: number; status: string };
        documents: { uploadedCount: number; status: string };
      };
    }, void>({
      query: () => ({
        url: "/auth/progress-tracker",
        method: "GET",
      }),
      providesTags: ["Auth", "InvestmentGuide", "userProfile"],
    }),

    // ──────────────────────────────Ends──────────────────────────────
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useChangePasswordMutation,
  useCreateUserByAdminMutation,
  useGetAdminDashboardStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useLogoutUserMutation,
  useUpdateProfileMutation,
  useGetProgressTrackerQuery,
} = authAPI;
