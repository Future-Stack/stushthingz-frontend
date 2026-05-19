import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "@/assets/nav/logo.png";
import ScrollToTop from "@/common/ScrollToTop";
import { ShoppingCart } from "lucide-react";
import { useInterest } from "@/hooks/useInterest";

const InvestorLayout: React.FC = () => {
  const navigate = useNavigate();
  const { interestedIds } = useInterest();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#212a31] font-sans">
      <ScrollToTop />
      {/* Header */}
      <header className="w-full bg-white border-b border-[#919EAB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-2.5 px-4">
          <img src={logo} alt="logo" className="w-40 cursor-pointer" onClick={() => navigate("/investor/dashboard")} />
          
          <button 
            onClick={() => navigate("/investor/interest")}
            className="relative p-2 text-[#364153] hover:text-color-main transition-colors cursor-pointer flex items-center justify-center"
            title="Express Interest List"
          >
            <ShoppingCart size={24} />
            {interestedIds.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-color-main text-[10px] font-bold text-white shadow-sm">
                {interestedIds.length}
              </span>
            )}
          </button>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorLayout;
