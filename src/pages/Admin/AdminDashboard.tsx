import React from "react";
import { Users, TrendingUp, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "12,489",
    change: "+12%",
    positive: true,
    icon: Users,
    color: "from-[#124e66] to-[#2e3944]",
  },
  {
    label: "Revenue",
    value: "$84,320",
    change: "+8.2%",
    positive: true,
    icon: TrendingUp,
    color: "from-[#1a7a5e] to-[#124e66]",
  },
  {
    label: "Total Orders",
    value: "3,842",
    change: "-2.1%",
    positive: false,
    icon: ShoppingCart,
    color: "from-[#2e3944] to-[#748d92]",
  },
  {
    label: "Active Sessions",
    value: "618",
    change: "+5.4%",
    positive: true,
    icon: Activity,
    color: "from-[#748d92] to-[#124e66]",
  },
];

const recentActivity = [
  { user: "Alice Johnson", action: "Registered", time: "2 min ago", badge: "New User", badgeColor: "bg-blue-500/20 text-blue-400" },
  { user: "Bob Martinez", action: "Placed order #4521", time: "15 min ago", badge: "Order", badgeColor: "bg-green-500/20 text-green-400" },
  { user: "Carol White", action: "Updated profile", time: "1 hr ago", badge: "Update", badgeColor: "bg-yellow-500/20 text-yellow-400" },
  { user: "David Kim", action: "Submitted support ticket", time: "3 hr ago", badge: "Support", badgeColor: "bg-red-500/20 text-red-400" },
  { user: "Eva Chen", action: "Completed verification", time: "5 hr ago", badge: "Verified", badgeColor: "bg-purple-500/20 text-purple-400" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(({ label, value, change, positive, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                  ${positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
              >
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Activity</h2>
          <button className="text-xs text-[#748d92] hover:text-white transition-colors">View all →</button>
        </div>
        <div className="space-y-4">
          {recentActivity.map(({ user, action, time, badge, badgeColor }) => (
            <div
              key={user}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{user}</p>
                <p className="text-xs text-gray-400 truncate">{action}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}>
                  {badge}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add User", desc: "Create a new user account" },
          { label: "View Reports", desc: "Download analytics data" },
          { label: "Manage Roles", desc: "Update user permissions" },
          { label: "System Logs", desc: "View application logs" },
        ].map(({ label, desc }) => (
          <button
            key={label}
            className="bg-[#1a1d27] border border-white/5 hover:border-[#124e66]/50 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#124e66]/10"
          >
            <p className="font-semibold text-sm text-white">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
