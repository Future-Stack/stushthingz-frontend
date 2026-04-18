import React from "react";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

const sampleUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", status: true, joined: "Jan 12, 2025" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "normal_user", status: true, joined: "Feb 3, 2025" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "provider", status: false, joined: "Mar 7, 2025" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "normal_user", status: true, joined: "Mar 15, 2025" },
  { id: 5, name: "Eva Chen", email: "eva@example.com", role: "provider", status: true, joined: "Apr 1, 2025" },
];

const roleBadge: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400",
  normal_user: "bg-blue-500/20 text-blue-400",
  provider: "bg-green-500/20 text-green-400",
};

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all registered users.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors">
              <Filter size={14} />
              Filter
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white text-sm font-medium hover:opacity-90 transition-opacity">
              + Add User
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">#</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Role</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Joined</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((user, idx) => (
                <tr key={user.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx === sampleUsers.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center text-xs font-bold text-white">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleBadge[user.role] || "bg-gray-500/20 text-gray-400"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-400">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.joined}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
