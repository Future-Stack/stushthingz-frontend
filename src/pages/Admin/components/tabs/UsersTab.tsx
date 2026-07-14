import React, { useState } from "react";
import { Eye, Search, UserX, UserCheck } from "lucide-react";
import AddUserModal from "../modals/AddUserModal";
import ViewUserModal, { AdminUser } from "../modals/ViewUserModal";
import WarningModal from "../modals/WarningModal";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "@/store/features/auth/auth.api";

const ITEMS_PER_PAGE = 10;

const formatRole = (role: string) => {
  if (role === "bank_operator") return "Bank User";
  if (role === "user") return "Investor";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Investor":
    case "investor":
    case "user":
      return "bg-[#D91A7C] text-white";
    case "Bank User":
    case "bank_operator":
      return "bg-[#2B7FFF] text-white";
    case "Admin":
    case "admin":
      return "bg-[#AD46FF] text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const UsersTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  
  // Queries & Mutations
  const { data: usersData, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: searchInput || undefined,
  });
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Warning modal (row status toggle)
  const [warnRowOpen, setWarnRowOpen] = useState(false);
  const [pendingStatusUser, setPendingStatusUser] = useState<AdminUser | null>(null);

  // Map API users to AdminUser structure
  const users: AdminUser[] = (usersData?.data || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: formatRole(user.role),
    status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
    joined: user.createdAt ? user.createdAt.split("T")[0] : "N/A",
    lastActive: user.createdAt ? user.createdAt.split("T")[0] : "N/A", // API doesn't provide lastActive, fallback to joined
  }));

  const totalPages = usersData?.meta?.totalPage || 1;

  const buildPages = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++)
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleToggleStatusClick = (user: AdminUser) => {
    setPendingStatusUser(user);
    setWarnRowOpen(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatusUser) {
      const isSuspended = pendingStatusUser.status.toLowerCase() === "suspended";
      const nextStatus: "active" | "suspended" = isSuspended ? "active" : "suspended";
      try {
        await updateStatus({ id: pendingStatusUser.id, status: nextStatus }).unwrap();
      } catch (err) {
        console.error("Failed to update status", err);
      }
      setPendingStatusUser(null);
    }
    setWarnRowOpen(false);
  };

  return (
    <>
      <div className="bg-white px-6 py-4 border border-gray-300 rounded-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
          <h2 className="font-bold text-color-jet-black text-xl">User Management</h2>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1); // reset to page 1 on new search
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-color-main focus:border-color-main transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-color-main hover:bg-[#b5156a] shadow-sm px-4 py-2.5 rounded-lg font-semibold text-white text-sm active:scale-95 transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="pb-4 overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-gray-100 border-b">
                {["Name", "Email", "Role", "Status", "Joined", "Last Active", "Actions"].map((h) => (
                  <th key={h} className="pr-4 last:pr-0 pb-3 font-medium text-color-jet-black text-sm text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSuspended = user.status.toLowerCase() === "suspended";
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/60 border-gray-200 border-b transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-color-jet-black text-sm whitespace-nowrap">{user.name}</td>
                      <td className="py-3.5 pr-4 font-normal text-color-jet-black text-sm whitespace-nowrap">{user.email}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-white text-xs ${
                          isSuspended ? "bg-red-500" : "bg-[#4CAF50]"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-normal text-color-jet-black text-sm whitespace-nowrap">{user.joined}</td>
                      <td className="py-3.5 pr-4 font-normal text-color-jet-black text-sm whitespace-nowrap">{user.lastActive}</td>
                      <td className="py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="bg-white hover:bg-gray-100 px-2.5 py-1.75 border border-[#0000001A] rounded-lg text-color-jet-black hover:text-gray-600 transition-colors cursor-pointer"
                            title="View user"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatusClick(user)}
                            className={`bg-white px-2.5 py-1.75 border border-[#0000001A] rounded-lg transition-colors cursor-pointer ${
                              isSuspended ? "hover:bg-green-50 text-green-600" : "hover:bg-red-50 text-red-400 hover:text-red-600"
                            }`}
                            title={isSuspended ? "Activate user" : "Suspend user"}
                          >
                            {isSuspended ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 hover:bg-gray-100 disabled:opacity-40 px-4 py-2 rounded-xl font-medium text-gray-600 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>

            {buildPages().map((p, idx) =>
              p === "..." ? (
                <span key={`e${idx}`} className="px-2 text-gray-400 text-sm">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all cursor-pointer ${currentPage === p ? "bg-color-main text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 hover:bg-gray-100 disabled:opacity-40 px-4 py-2 rounded-xl font-medium text-gray-600 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={selectedUser}
      />
      {/* Row status warning */}
      <WarningModal
        isOpen={warnRowOpen}
        onClose={() => { setWarnRowOpen(false); setPendingStatusUser(null); }}
        onConfirm={confirmStatusChange}
        title={pendingStatusUser?.status.toLowerCase() === "suspended" ? "Activate User?" : "Suspend User?"}
        message={`Are you sure you want to change status for "${pendingStatusUser?.name}"?`}
        confirmLabel={pendingStatusUser?.status.toLowerCase() === "suspended" ? "Activate" : "Suspend"}
        loading={isUpdatingStatus}
      />
    </>
  );
};

export default UsersTab;
