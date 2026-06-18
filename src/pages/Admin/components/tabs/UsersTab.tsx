import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import AddUserModal, { AddUserFormData } from "../modals/AddUserModal";
import ViewUserModal, { AdminUser } from "../modals/ViewUserModal";
import WarningModal from "../modals/WarningModal";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah.johnson@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "2", name: "John Smith", email: "john.smith@bank.com", role: "Bank User", status: "Active", joined: "2026-02-01", lastActive: "2026-04-13" },
  { id: "3", name: "Admin User", email: "admin@vanessa.com", role: "Admin", status: "Active", joined: "2025-12-01", lastActive: "2026-04-15" },
  { id: "4", name: "Tom Clark", email: "tommy5@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "5", name: "Joe Hendry", email: "hendrijoe@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "6", name: "John Chena", email: "chena@bank.com", role: "Bank User", status: "Active", joined: "2026-02-01", lastActive: "2026-04-13" },
  { id: "7", name: "Tom Moody", email: "moddy45@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "8", name: "Admin User", email: "admin@vanessa.com", role: "Admin", status: "Active", joined: "2025-12-01", lastActive: "2026-04-15" },
  { id: "9", name: "Sakib hasan", email: "sakib45@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "10", name: "Tylor Swift", email: "stylore@email.com", role: "Investor", status: "Active", joined: "2026-01-15", lastActive: "2026-04-14" },
  { id: "11", name: "Emma Wilson", email: "emma.w@email.com", role: "Investor", status: "Active", joined: "2026-01-20", lastActive: "2026-04-12" },
  { id: "12", name: "Mark Davis", email: "mark.d@bank.com", role: "Bank User", status: "Active", joined: "2026-02-10", lastActive: "2026-04-11" },
];

const ITEMS_PER_PAGE = 10;

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Investor": return "bg-[#D91A7C] text-white";
    case "Bank User": return "bg-[#2B7FFF] text-white";
    case "Admin": return "bg-[#AD46FF] text-white";
    default: return "bg-gray-200 text-gray-700";
  }
};

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Warning modal (row delete)
  const [warnRowOpen, setWarnRowOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const pagedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

  // ── Handlers ──────────────────────────────────────────────────────────────
  // const handleAddUser = (data: AddUserFormData) => {
  //   const newUser: AdminUser = {
  //     id: String(Date.now()),
  //     name: data.fullName,
  //     email: data.email,
  //     role: data.role,
  //     status: data.status,
  //     joined: new Date().toISOString().split("T")[0],
  //     lastActive: new Date().toISOString().split("T")[0],
  //   };
  //   setUsers((prev) => [newUser, ...prev]);
  //   setAddModalOpen(false);
  // };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // Row trash icon → open warning modal
  const requestRowDelete = (userId: string) => {
    setPendingDeleteId(userId);
    setWarnRowOpen(true);
  };

  const confirmRowDelete = () => {
    if (pendingDeleteId) {
      setUsers((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      setPendingDeleteId(null);
    }
    setWarnRowOpen(false);
  };

  // Called from ViewUserModal's delete button
  const handleDeleteFromView = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setViewModalOpen(false);
  };

  return (
    <>
      <div className="bg-white px-6 py-4 border border-gray-300 rounded-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <h2 className="font-bold text-color-jet-black text-xl">User Management</h2>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-color-main hover:bg-[#b5156a] shadow-sm px-4 py-2.5 rounded-lg font-semibold text-white text-sm active:scale-95 transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add User
          </button>
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
              {pagedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 border-gray-200 border-b transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-color-jet-black text-sm whitespace-nowrap">{user.name}</td>
                  <td className="py-3.5 pr-4 font-normal text-color-jet-black text-sm whitespace-nowrap">{user.email}</td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 bg-[#4CAF50] px-3 py-1 rounded-full font-semibold text-white text-xs">
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
                        onClick={() => requestRowDelete(user.id)}
                        className="bg-white hover:bg-red-50 px-2.5 py-1.75 border border-[#0000001A] rounded-lg text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        // onSubmit={handleAddUser}
      />
      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={selectedUser}
        onDelete={handleDeleteFromView}
      />
      {/* Row delete warning */}
      <WarningModal
        isOpen={warnRowOpen}
        onClose={() => { setWarnRowOpen(false); setPendingDeleteId(null); }}
        onConfirm={confirmRowDelete}
        title="Delete User?"
        message="This will permanently remove the user from the platform. This action cannot be undone."
        confirmLabel="Delete User"
      />
    </>
  );
};

export default UsersTab;
