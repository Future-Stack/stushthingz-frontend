import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/nav/logo.png";
import googleIcon from "@/assets/home/googleIcon.png";
import { useRegisterMutation } from "@/store/features/auth/auth.api";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: SignupFormInputs) => {
    setServerError(null);
    try {
      // Backend expects: name, email, password (no phone or file yet)
      await registerUser({
        name: data.fullName,
        email: data.email,
        password: data.password,
      }).unwrap();

      // Navigate to OTP page, passing email via state for verification
      navigate("/verify-otp", {
        state: { email: data.email, mode: "register" },
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message ?? "Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="mb-6" />
        <h2 className="text-3xl font-bold text-black mb-2 leading-tight font-inter">
          Start investing in Jamaica's growing property market today.
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Name"
            {...register("fullName")}
            className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+250 0005222"
            {...register("phoneNumber")}
            className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm pr-10 placeholder:text-[#454F5B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full p-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm pr-10 placeholder:text-[#454F5B]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
          className="w-full bg-color-main text-white py-3 rounded-lg font-semibold hover:bg-color-main/90 transition-colors shadow-sm mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#EAECF0]"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[#667085]">or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D0D5DD] rounded-lg bg-white text-[#344054] font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer mb-3"
      >
        <img src={googleIcon} alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <p className="text-center text-sm text-[#4A5565] mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-base font-medium text-color-main hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
