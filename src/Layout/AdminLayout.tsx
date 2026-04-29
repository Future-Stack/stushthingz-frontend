import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import logo from "@/assets/nav/logo.png";

const AdminLayout: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-inter">
      {/* ── Top Navbar ───────────────────────────────────────────────────── */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <img src={logo} alt="Vanessa" className="w-40" />
          </Link>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-none">
                {user?.fullName ?? "Admin User"}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                {user?.email ?? "admin@vanessa.com"}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-color-main flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user?.fullName?.[0] ?? "A"}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
