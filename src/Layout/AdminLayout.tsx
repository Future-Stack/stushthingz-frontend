import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Lock, User, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import logo from "@/assets/nav/logo.png";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import { useLogoutUserMutation } from "@/store/features/auth/auth.api";

const AdminLayout: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logoutUser] = useLogoutUserMutation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logoutUser().unwrap();
    } catch (e) {
      console.error("Backend logout error", e);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    setIsChangePasswordOpen(true);
  };

  const userName = user?.name || "Admin";
  const profileImage = user?.profileImage || user?.image;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-inter">
      {/* ── Top Navbar ───────────────────────────────────────────────────── */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex flex-col">
            <img src={logo} alt="Vanessa" className="w-40" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 bg-gray-50 hover:bg-pink-50 pl-1.5 pr-3 py-1 border border-gray-200 hover:border-pink-200 rounded-full transition-all duration-200 cursor-pointer group"
              title="Account"
            >
              {/* Avatar */}
              <div className="flex justify-center items-center bg-gradient-to-br from-[#D91A7C] to-[#9c1654] rounded-full w-8 h-8 overflow-hidden shrink-0">
                {profileImage ? (
                  <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-white text-xs">
                    {initials || <User size={16} />}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col items-start text-left pr-1">
                <span className="text-xs font-semibold text-gray-900 leading-none">
                  {userName}
                </span>
                <span className="text-[10px] text-color-main font-medium uppercase mt-0.5">
                  Admin
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`text-gray-500 group-hover:text-color-main transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="top-full right-0 absolute mt-2 bg-white shadow-xl border border-gray-100 rounded-2xl w-60 overflow-hidden animate-fadeIn z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-gray-100 border-b bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-gradient-to-br from-[#D91A7C] to-[#9c1654] rounded-full w-9 h-9 overflow-hidden shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-white text-xs">{initials || "A"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#212a31] text-sm truncate">{userName}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email || ""}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1.5">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 hover:bg-pink-50 px-3 py-2.5 rounded-xl w-full text-left text-gray-700 hover:text-color-main transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-center items-center bg-gray-100 group-hover:bg-pink-100 rounded-lg w-7 h-7 transition-colors">
                      <Lock size={14} className="text-gray-500 group-hover:text-color-main" />
                    </div>
                    <span className="font-medium text-sm">Change Password</span>
                  </button>

                  <div className="bg-gray-100 my-1.5 h-px" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 hover:bg-red-50 px-3 py-2.5 rounded-xl w-full text-left text-red-500 hover:text-red-600 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-center items-center bg-red-50 group-hover:bg-red-100 rounded-lg w-7 h-7 transition-colors">
                      <LogOut size={14} className="text-red-400 group-hover:text-red-500" />
                    </div>
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
