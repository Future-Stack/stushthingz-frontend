import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import logo from "@/assets/nav/logo.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: ForgotPasswordFormInputs) => {
    console.log("Forgot Password Data:", data);
    navigate("/verify-otp");
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <img src={logo} alt="Vanessa" className="mb-6" />
        <h2 className="text-4xl font-bold text-black mb-1 font-inter">Forgot Password!</h2>
        <p className="text-base text-[#454F5B] font-normal leading-relaxed">
          Do you forgot your password? It's ease to reset, just provide your email address. We'll send you a OTP code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-base font-normal text-color-jet-black mb-1">
            Admin Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="admin@reviewiq.com"
              {...register("email")}
              className="w-full pl-10 pr-3 py-3 bg-[#F3F3F5] border border-[#00000000] rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main text-sm placeholder:text-[#454F5B]"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex-1 px-4 py-3 border border-[#344054] rounded-xl text-[#344054] font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-color-main text-white py-3 rounded-xl font-semibold hover:bg-color-main/90 transition-colors shadow-lg cursor-pointer"
          >
            Send OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
