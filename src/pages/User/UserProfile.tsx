import React, { useState } from "react";
import { Save, Camera, Lock, Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

const UserProfile: React.FC = () => {
    const user = useAppSelector(selectUser);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-[#212a31]">My Profile</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your personal information and preferences.</p>
            </div>

            {/* Avatar Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-3xl font-bold text-white">
                        {user?.fullName?.[0] || "U"}
                    </div>
                    <button
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#124e66] hover:bg-[#2e3944] flex items-center justify-center text-white shadow-md transition-colors"
                        title="Change avatar"
                    >
                        <Camera size={14} />
                    </button>
                </div>
                <div>
                    <h2 className="font-bold text-lg text-[#212a31]">{user?.fullName || "Demo User"}</h2>
                    <p className="text-sm text-gray-400">{user?.email || "user@example.com"}</p>
                    <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                        {user?.role?.replace("_", " ") || "normal user"}
                    </span>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-[#212a31] mb-5">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "First Name", value: user?.first_name || "", placeholder: "John" },
                        { label: "Last Name", value: user?.last_name || "", placeholder: "Doe" },
                        { label: "Email Address", value: user?.email || "", placeholder: "john@example.com", type: "email", colSpan: true },
                        { label: "Phone Number", value: user?.phone_number || "", placeholder: "+1 (555) 000-0000" },
                        { label: "City", value: user?.city || "", placeholder: "New York" },
                    ].map(({ label, value, placeholder, type, colSpan }) => (
                        <div key={label} className={colSpan ? "sm:col-span-2" : ""}>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                            <input
                                type={type || "text"}
                                defaultValue={value}
                                placeholder={placeholder}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#212a31] placeholder-gray-300 focus:outline-none focus:border-[#124e66] focus:ring-1 focus:ring-[#124e66] transition-all"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        <Save size={15} />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Lock size={18} className="text-[#124e66]" />
                    <h2 className="font-semibold text-[#212a31]">Change Password</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm text-[#212a31] placeholder-gray-300 focus:outline-none focus:border-[#124e66] focus:ring-1 focus:ring-[#124e66] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#212a31] transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#212a31] placeholder-gray-300 focus:outline-none focus:border-[#124e66] focus:ring-1 focus:ring-[#124e66] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#212a31] placeholder-gray-300 focus:outline-none focus:border-[#124e66] focus:ring-1 focus:ring-[#124e66] transition-all"
                        />
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
