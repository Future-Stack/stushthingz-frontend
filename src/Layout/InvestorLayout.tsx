import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/nav/logo.png";
import chatLogo from "@/assets/home/aiChatLogo.png";
import wishlistIcon from "@/assets/home/wishlistIcon.png";
import ScrollToTop from "@/common/ScrollToTop";
import { useGetWishlistPropertiesQuery } from "@/store/api/propertyApi";

const InvestorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: wishlistData } = useGetWishlistPropertiesQuery();
  const wishlistCount = wishlistData?.data?.length || 0;

  const isChatPage = location.pathname === "/investor/chat";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-[#212a31]">
      <ScrollToTop />
      {/* Header */}
      <header className="top-0 z-30 sticky bg-white border-[#919EAB] border-b w-full">
        <div className="flex justify-between items-center mx-auto px-4 py-2.5 max-w-7xl">
          <img src={logo} alt="logo" className="w-40 cursor-pointer" onClick={() => navigate("/investor/dashboard")} />

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
        </div>
      </header>
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
          <img src={chatLogo} alt="AI Assistant" className="w-16 h-16 object-contain" />
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
