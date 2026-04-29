import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout, selectUser } from "@/store/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/nav/logo.png"
import CommonWrapper from "@/common/CommonWrapper";

// const navLinks = [
//   { to: "/", label: "Home", end: true },
//   { to: "/about", label: "About" },
//   { to: "/services", label: "Services" },
//   { to: "/contact", label: "Contact" },
// ];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    return user?.role === "admin" ? "/admin" : "/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#C4CDD5] backdrop-blur-md shadow-lg">
      <CommonWrapper>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="logo" className="w-50" />
            {/* <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#124e66] to-[#748d92] flex items-center justify-center font-bold text-white text-sm shadow-lg group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-white text-lg font-bold tracking-tight hidden sm:block">
              My<span className="text-[#748d92]">App</span>
            </span> */}
          </Link>

          {/* Desktop Nav Links */}
          {/* <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div> */}

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                    <Avatar className="w-8 h-8">
                      {user.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt={user.fullName} />
                      ) : (
                        <AvatarFallback className="bg-linear-to-br from-[#124e66] to-[#748d92] text-white text-sm font-bold">
                          {user.fullName?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm text-gray-300 max-w-24 truncate">{user.fullName}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 bg-[#2e3944] border border-white/10 text-white p-2 rounded-xl shadow-2xl">
                  <div className="px-2 py-2 mb-1">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="h-px bg-white/10 mb-1" />
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <div className="h-px bg-white/10 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-color-main rounded-full px-6 py-2 text-base font-medium text-white hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Log In
                </Link>
                {/* <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-linear-to-r from-[#124e66] to-[#2e3944] text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg border border-white/10"
                >
                  Sign Up
                </Link> */}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </CommonWrapper>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#212a31] px-4 py-3 space-y-1">
          {/* {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`
              }
            >
              {label}
            </NavLink>
          ))} */}
          <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-sm font-bold text-white">
                    {user.fullName?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.fullName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-white/10 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 text-sm font-medium bg-linear-to-r from-[#124e66] to-[#2e3944] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
