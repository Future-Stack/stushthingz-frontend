import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/nav/logo.png";
import chatLogo from "@/assets/home/ai_chat_icon.png";
import wishlistIcon from "@/assets/home/wishlistIcon.png";
import ScrollToTop from "@/common/ScrollToTop";
import { useGetWishlistPropertiesQuery } from "@/store/api/propertyApi";
import { User, Lock, Heart, LogOut, ChevronDown } from "lucide-react";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import { useLogoutUserMutation } from "@/store/features/auth/auth.api";

const InvestorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: wishlistData } = useGetWishlistPropertiesQuery();
  const wishlistCount = wishlistData?.data?.length || 0;
  const [logoutUser] = useLogoutUserMutation();

  const isChatPage = location.pathname === "/investor/chat";

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

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/investor/dashboard?tab=profile");
  };

  const handleWishlistClick = () => {
    setIsDropdownOpen(false);
    navigate("/investor/interest");
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    setIsChangePasswordOpen(true);
  };

  // Avatar: profile image or initials
  const userName = currentUser?.name || "";
  const profileImage = currentUser?.profileImage || currentUser?.image;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-[#212a31]">
      <ScrollToTop />
      {/* Header */}
      <header className="top-0 z-30 sticky bg-white border-[#919EAB] border-b w-full">
        <div className="flex justify-between items-center mx-auto px-4 py-2.5 max-w-7xl">
          <img src={logo} alt="logo" className="w-40 cursor-pointer" onClick={() => navigate("/investor/dashboard")} />

          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => navigate("/investor/interest")}
              className="relative flex justify-center items-center bg-[#D91A7C33] hover:bg-pink-100 p-2 border border-pink-100/40 rounded-full w-10 h-10 text-[#364153] hover:text-color-main transition-colors cursor-pointer"
              title="Express Interest List"
            >
              <img src={wishlistIcon} className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="-top-1.5 -right-1.5 absolute flex justify-center items-center bg-color-main shadow-md border-2 border-white rounded-full w-5 h-5 font-bold text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-pink-50 pl-1 pr-3 py-1 border border-gray-200 hover:border-pink-200 rounded-full transition-all duration-200 cursor-pointer group"
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
                <ChevronDown
                  size={14}
                  className={`text-gray-500 group-hover:text-color-main transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="top-full right-0 absolute mt-2 bg-white shadow-xl border border-gray-100 rounded-2xl w-56 overflow-hidden animate-fadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-gray-100 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex justify-center items-center bg-gradient-to-br from-[#D91A7C] to-[#9c1654] rounded-full w-9 h-9 overflow-hidden shrink-0">
                        {profileImage ? (
                          <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-white text-xs">{initials || "?"}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#212a31] text-sm truncate">{userName || "Investor"}</p>
                        <p className="text-gray-400 text-xs truncate">{currentUser?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 hover:bg-pink-50 px-3 py-2.5 rounded-xl w-full text-left text-gray-700 hover:text-color-main transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-center items-center bg-gray-100 group-hover:bg-pink-100 rounded-lg w-7 h-7 transition-colors">
                        <User size={14} className="text-gray-500 group-hover:text-color-main" />
                      </div>
                      <span className="font-medium text-sm">Profile</span>
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-3 hover:bg-pink-50 px-3 py-2.5 rounded-xl w-full text-left text-gray-700 hover:text-color-main transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-center items-center bg-gray-100 group-hover:bg-pink-100 rounded-lg w-7 h-7 transition-colors">
                        <Lock size={14} className="text-gray-500 group-hover:text-color-main" />
                      </div>
                      <span className="font-medium text-sm">Change Password</span>
                    </button>

                    <button
                      onClick={handleWishlistClick}
                      className="flex items-center gap-3 hover:bg-pink-50 px-3 py-2.5 rounded-xl w-full text-left text-gray-700 hover:text-color-main transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-center items-center bg-gray-100 group-hover:bg-pink-100 rounded-lg w-7 h-7 transition-colors">
                        <Heart size={14} className="text-gray-500 group-hover:text-color-main" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="flex justify-center items-center bg-color-main rounded-full w-4 h-4 font-bold text-[9px] text-white">
                            {wishlistCount}
                          </span>
                        )}
                      </div>
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
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Main Content Area */}
      <main className="mx-auto p-4 max-w-7xl animate-fadeIn">
        <Outlet />
      </main>

      {/* Sticky AI Chatbot Icon */}
      {!isChatPage && (
        <button
          onClick={() => navigate("/investor/chat")}
          className="right-10 bottom-10 z-40 fixed flex justify-center items-center bg-white shadow-2xl hover:shadow-pink-200/50 border border-pink-100 rounded-full w-18 h-18 hover:rotate-6 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Chat with Vanessa"
        >
          <img src={chatLogo} alt="AI Assistant" className="w-14 h-14 object-contain" />
          <span className="top-1 right-1 absolute flex w-3.5 h-3.5">
            <span className="inline-flex absolute bg-pink-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
            <span className="inline-flex relative bg-color-main rounded-full w-3.5 h-3.5"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default InvestorLayout;
