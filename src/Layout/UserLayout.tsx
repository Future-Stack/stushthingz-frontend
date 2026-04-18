import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser } from "@/store/features/auth/auth.slice";

const userNavLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const UserLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] text-[#212a31] overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center font-bold text-sm text-white">
                            M
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[#212a31]">MyApp</span>
                    </Link>
                    <button
                        className="md:hidden text-gray-400 hover:text-[#212a31]"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
                        Menu
                    </p>
                    {userNavLinks.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                                    ? "bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white shadow-lg"
                                    : "text-gray-500 hover:text-[#212a31] hover:bg-gray-50"
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                            <ChevronRight
                                size={14}
                                className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity"
                            />
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {user?.fullName?.[0] || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-[#212a31]">
                                {user?.fullName || "Demo User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email || "user@example.com"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-400 hover:text-[#212a31]"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="font-semibold text-[#212a31] text-sm hidden sm:block">
                                Welcome back, {user?.fullName?.split(" ")[0] || "User"} 👋
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg text-gray-400 hover:text-[#212a31] hover:bg-gray-50 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#124e66] rounded-full" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-sm font-bold text-white">
                            {user?.fullName?.[0] || "U"}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
