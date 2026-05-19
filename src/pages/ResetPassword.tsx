import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UserCircle, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/nav/logo.png";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: ResetPasswordFormInputs) => {
    console.log("Reset Password Data:", data);
    navigate("/login");
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="w-40 mb-6" />
        <h2 className="text-4xl font-bold text-black mb-1 font-inter">Reset Password</h2>
        <p className="text-base text-[#454F5B] font-normal">
          You are all set. Now it's time to create a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
              <UserCircle size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="admin123"
              {...register("password")}
              className="w-full pl-10 pr-10 py-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
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

        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
              <UserCircle size={20} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="admin123"
              {...register("confirmPassword")}
              className="w-full pl-10 pr-10 py-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
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

        <button
          type="submit"
          className="w-full bg-color-main text-white py-3 rounded-xl font-semibold hover:bg-color-main/90 transition-colors shadow-lg shadow-color-main/20 cursor-pointer"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
