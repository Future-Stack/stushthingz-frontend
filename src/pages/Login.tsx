import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import logo from "@/assets/nav/logo.png";
import { Eye, EyeOff } from "lucide-react";
import googleIcon from "@/assets/home/googleIcon.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    dispatch(setUser(data));
    navigate("/investor/opportunities");
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="mb-6" />
        <h2 className="text-4xl font-bold text-black mb-1 font-inter">Welcome Back</h2>
        <p className="text-base text-[#454F5B] font-normal">Continue your investment journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-color-main text-white py-3 rounded-lg font-semibold hover:bg-color-main/90 transition-colors shadow-sm cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <div className="text-right mt-3">
        <Link to="/forgot-password" title="Forgot Password" className="text-sm font-medium text-black hover:underline">
          Forgot Password?
        </Link>
      </div>

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

      <p className="text-center text-sm text-[#4A5565]">
        Don't have an account?{" "}
        <Link to="/signup" className="text-base font-medium text-color-main hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
