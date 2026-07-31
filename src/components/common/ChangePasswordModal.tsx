import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useChangePasswordMutation } from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password cannot be the same as current password",
    path: ["newPassword"],
  });

type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormInputs>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ChangePasswordFormInputs) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password. Please check your current password.");
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative bg-white shadow-2xl p-6 border border-gray-100 rounded-2xl w-full max-w-md transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-4 border-gray-100 border-b">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-[#D91A7C15] rounded-xl w-10 h-10 text-color-main">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Change Password</h2>
              <p className="text-gray-500 text-xs">Update your account password</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block mb-1.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter current password"
                {...register("oldPassword")}
                className="bg-gray-50 focus:bg-white px-3.5 py-2.5 pr-10 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none w-full text-gray-900 text-sm transition-all placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2"
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-1 text-red-500 text-xs">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password (min. 6 characters)"
                {...register("newPassword")}
                className="bg-gray-50 focus:bg-white px-3.5 py-2.5 pr-10 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none w-full text-gray-900 text-sm transition-all placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-red-500 text-xs">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="bg-gray-50 focus:bg-white px-3.5 py-2.5 pr-10 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none w-full text-gray-900 text-sm transition-all placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 mt-6 pt-3 border-gray-100 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="hover:bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-color-main hover:bg-pink-700 disabled:opacity-50 shadow-md hover:shadow-lg px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
