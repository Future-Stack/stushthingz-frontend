import React from "react";
import { BarChart2, Clock, Star, ArrowUpRight, Package, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const quickStats = [
  { label: "Total Orders", value: "24", icon: Package, color: "from-[#124e66] to-[#2e3944]" },
  { label: "Rewards Points", value: "1,840", icon: Star, color: "from-[#1a7a5e] to-[#124e66]" },
  { label: "Hours Saved", value: "68", icon: Clock, color: "from-[#2e3944] to-[#748d92]" },
  { label: "Growth", value: "+14%", icon: BarChart2, color: "from-[#748d92] to-[#124e66]" },
];

const recentOrders = [
  { id: "#ORD-1021", product: "Premium Plan", date: "Mar 1, 2025", status: "Completed", statusColor: "bg-green-100 text-green-700" },
  { id: "#ORD-0984", product: "Add-on Pack", date: "Feb 20, 2025", status: "Pending", statusColor: "bg-yellow-100 text-yellow-700" },
  { id: "#ORD-0941", product: "Starter Plan", date: "Feb 5, 2025", status: "Completed", statusColor: "bg-green-100 text-green-700" },
];

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#124e66] to-[#2e3944] p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #748d92 0%, transparent 60%)" }} />
        <h1 className="text-xl font-bold">
          Account Overview
        </h1>
        <p className="text-sm text-white/70 mt-1">
          Here's a summary of your account activity.
        </p>
        <Link
          to="/dashboard/profile"
          className="inline-flex items-center gap-1.5 mt-4 text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Profile <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-[#212a31]">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-[#212a31]">Recent Orders</h2>
          <button className="text-xs text-[#124e66] hover:text-[#2e3944] transition-colors flex items-center gap-1">
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map(({ id, product, date, status, statusColor }) => (
            <div key={id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-[#212a31]">{product}</p>
                <p className="text-xs text-gray-400 mt-0.5">{id} · {date}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/profile"
          className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#124e66]/30 transition-all group"
        >
          <div>
            <p className="font-semibold text-sm text-[#212a31]">Update Profile</p>
            <p className="text-xs text-gray-400 mt-1">Edit your personal information</p>
          </div>
          <ArrowUpRight size={18} className="text-[#124e66] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#124e66]/30 transition-all group"
        >
          <div>
            <p className="font-semibold text-sm text-[#212a31]">Account Settings</p>
            <p className="text-xs text-gray-400 mt-1">Manage password & preferences</p>
          </div>
          <ArrowUpRight size={18} className="text-[#124e66] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
