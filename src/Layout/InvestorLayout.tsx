import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "@/assets/nav/logo.png";

const InvestorLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#212a31] font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#919EAB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 py-2.5 px-4">
          <img src={logo} alt="logo" className="w-40 cursor-pointer" onClick={() => navigate("/investor/dashboard")} />
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
