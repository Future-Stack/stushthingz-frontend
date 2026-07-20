import React, { useState } from "react";
import { Users, TrendingUp, Building2, FileText, BookOpen, Activity } from "lucide-react";
import { motion } from "framer-motion";
import UsersTab from "./components/tabs/UsersTab";
import ContentTab from "./components/tabs/ContentTab";
import DocumentsTab from "./components/tabs/DocumentsTab";
import PropertiesTab from "./components/tabs/PropertiesTab";
// import AddUserModal, { AddUserFormData } from "./components/modals/AddUserModal";
import { useGetAdminDashboardStatsQuery } from "@/store/features/auth/auth.api";
import AddUserModal from "./components/modals/AddUserModal";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "users",
    label: "Users",
    icon: (
      <Users size={16} />
    ),
  },
  {
    id: "content",
    label: "Content",
    icon: (
      <BookOpen size={16} />
    ),
  },
  {
    id: "documents",
    label: "Documents",
    icon: (
      <FileText size={16} />
    ),
  },
  {
    id: "properties",
    label: "Properties",
    icon: (
      <Activity size={16} />
    ),
  },
];

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const { data: statsData, isLoading } = useGetAdminDashboardStatsQuery();

  const stats = [
    { label: "Total Users", value: isLoading ? "..." : String(statsData?.data?.totalUsers ?? 0), icon: Users, iconBg: "bg-[#2B7FFF]", valueColor: "text-color-main" },
    { label: "Investors", value: isLoading ? "..." : String(statsData?.data?.investors ?? 0), icon: TrendingUp, iconBg: "bg-[#F0B100]", valueColor: "text-[#E45339]" },
    { label: "Bank Users", value: isLoading ? "..." : String(statsData?.data?.bankOperators ?? 0), icon: Building2, iconBg: "bg-[#7CA17A]", valueColor: "text-[#13C018]" },
    { label: "Properties", value: isLoading ? "..." : String(statsData?.data?.totalProperties ?? 0), icon: FileText, iconBg: "bg-[#B82FBA]", valueColor: "text-[#701AD9]" },
  ];

  // const handleGlobalAddUser = (data: AddUserFormData) => {
  //   // TODO: wire to API — POST /api/admin/users

  //   console.log("banker added", data);
  // };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="font-bold text-color-jet-black text-3xl">Admin Dashboard</h1>
          <p className="mt-1 font-normal text-[#4A5565] text-base">
            Manage users, content, and system configuration
          </p>
        </div>
        <button
          onClick={() => setAddUserOpen(true)}
          className="flex items-center gap-2 bg-color-main hover:bg-[#b5156a] shadow-sm px-5 py-2.5 rounded-lg font-semibold text-white text-sm active:scale-95 transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add User
        </button>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconBg, valueColor }) => (
          <div
            key={label}
            className="flex justify-between items-center bg-white hover:shadow-md p-5 border border-gray-200 rounded-[14px] transition-shadow"
          >
            <div className="space-y-2">
              <p className="font-medium text-[#4A5565] text-base">{label}</p>
              <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs — pill style matching PropertyTabs ───────────────────────── */}
      <div>
        {/* Tab Bar */}
        <div className="flex bg-[#ECECF0] p-1 rounded-full max-w-full overflow-x-auto scroll-smooth scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 mr-2 rounded-full text-color-jet-black text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
                ${activeTab === tab.id ? "" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
            >
              {/* Animated active pill */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute inset-0 bg-white shadow-sm rounded-full"
                  transition={{ type: "spring", duration: 0.45 }}
                />
              )}
              {/* Icon + label */}
              <span className="z-10 relative flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "content" && <ContentTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "properties" && <PropertiesTab />}
        </div>
      </div>

      {/* Global Add User Modal */}
      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        // onSubmit={handleGlobalAddUser}
      />
    </div>
  );
};

export default AdminDashboard;
