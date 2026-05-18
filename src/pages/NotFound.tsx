import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6 font-inter">
      {/* ── Outer Wrapper with Animation ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-xl shadow-slate-100/50 relative overflow-hidden"
      >
        {/* Abstract decorative backgrounds */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-color-main/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4c1d95]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        {/* ── Animated Illustration ─────────────────────────────────────────── */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 border border-pink-100/50 shadow-inner"
        >
          <FileQuestion size={44} className="text-color-main" strokeWidth={1.5} />
        </motion.div>

        {/* ── Status Code with Gradient ─────────────────────────────────────── */}
        <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-color-main to-[#ec4899] tracking-tight leading-none mb-4 selection:bg-pink-100">
          404
        </h1>

        {/* ── Page Titles ──────────────────────────────────────────────────── */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* ── Call To Action Buttons ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-color-main hover:bg-[#b5156a] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 duration-200 cursor-pointer"
          >
            <Home size={16} />
            Back to Home
          </Link>

          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-sm active:scale-95 duration-200 cursor-pointer"
          >
            <ArrowLeft size={16} className="text-gray-500" />
            Go Back
          </button>
        </div>
      </motion.div>

      {/* ── Footer Branding ───────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-gray-400 mt-6 select-none"
      >
        © {new Date().getFullYear()} Vanessa. All rights reserved.
      </motion.p>
    </div>
  );
};

export default NotFound;