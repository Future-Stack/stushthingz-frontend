import React from "react";
import { Outlet } from "react-router-dom";
import logo from "@/assets/nav/logo.png";

const InvestorLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#212a31] font-sans">
      {/* Header */}
      <header className="w-full px-4 md:px-80 bg-white border-b border-[#919EAB] sticky top-0 z-30 pt-4 pb-5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <div>
            <img src={logo} alt="logo" className="w-36" />
            <p className="text-xs font-poppins font-normal text-[#4A5565] ml-12 -mt-2">Your Investment Guide</p>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorLayout;
