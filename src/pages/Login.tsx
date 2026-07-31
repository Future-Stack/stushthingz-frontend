import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import { useLoginMutation, useLazyGetMeQuery } from "@/store/features/auth/auth.api";
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
  const [serverError, setServerError] = useState<string | null>(null);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [getMe, { isLoading: isFetchingMe }] = useLazyGetMeQuery();

  const isLoading = isLoggingIn || isFetchingMe;

  const redirectByRole = (role: string) => {
    if (role === "admin") return navigate("/admin");
    if (role === "user") return navigate("/investor/dashboard");
    if (role === "bank_operator") return navigate("/bank");
    return navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const baseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
    window.location.href = `${baseUrl}/auth/google`;
  };

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    try {
      // 1. Login — get access token
      const loginRes = await login(data).unwrap();
      const accessToken = loginRes.data.accessToken;

      // Store the token first so getMe can attach it in headers
      dispatch(setUser({ accessToken }));

      // 2. Fetch user profile
      const meRes = await getMe().unwrap();
      const user = meRes.data;

      // 3. Store user + token in Redux (persisted)
      dispatch(setUser({ user, accessToken }));

      // 4. Redirect based on role
      redirectByRole(user.role);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="mb-6" />
        <h2 className="mb-1 font-inter font-bold text-black text-4xl">Welcome Back</h2>
        <p className="font-normal text-[#454F5B] text-base">Continue your investment journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-normal text-color-jet-black text-base">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="bg-[#F3F3F5] p-3 border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main w-full placeholder:text-[#454F5B] text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-normal text-color-jet-black text-base">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="bg-[#F3F3F5] p-3 pr-10 border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main w-full placeholder:text-[#454F5B] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="right-3 absolute inset-y-0 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-color-main hover:bg-color-main/90 disabled:opacity-60 shadow-sm py-3 rounded-lg w-full font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-3 text-right">
        <Link to="/forgot-password" title="Forgot Password" className="font-medium text-black text-sm hover:underline">
          Forgot Password?
        </Link>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="border-[#EAECF0] border-t w-full"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[#667085]">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex justify-center items-center gap-3 bg-white hover:bg-gray-50 mb-3 px-4 py-3 border border-[#D0D5DD] rounded-lg w-full font-semibold text-[#344054] text-sm transition-colors cursor-pointer"
      >
        <img src={googleIcon} alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <p className="text-[#4A5565] text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-color-main text-base hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
