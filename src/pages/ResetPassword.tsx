import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/nav/logo.png";
import { useVerifyForgotPasswordOtpMutation } from "@/store/features/auth/auth.api";

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must be numeric"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // email passed from ForgotPassword page via location state
  const email: string = (location.state as { email?: string })?.email ?? "";

  const [verifyForgotPasswordOtp, { isLoading }] = useVerifyForgotPasswordOtpMutation();

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setServerError(null);
    try {
      await verifyForgotPasswordOtp({
        email,
        otp: data.otp,
        newPassword: data.password,
      }).unwrap();

      // On success, redirect to login
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message ?? "Password reset failed. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="w-40 mb-6" />
        <h2 className="text-4xl font-bold text-black mb-1 font-inter">Reset Password</h2>
        <p className="text-base text-[#454F5B] font-normal">
          Enter the OTP sent to{" "}
          {email && <span className="font-semibold text-black">{email}</span>} and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* OTP Field */}
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            {...register("otp")}
            className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm tracking-widest placeholder:text-[#454F5B] placeholder:tracking-normal"
          />
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full pr-10 p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full pr-10 p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-color-main text-white py-3 rounded-xl font-semibold hover:bg-color-main/90 transition-colors shadow-lg shadow-color-main/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
