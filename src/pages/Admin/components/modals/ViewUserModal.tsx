import React, { useState } from "react";
import { X } from "lucide-react";
import WarningModal from "./WarningModal";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  lastActive: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onDelete?: (userId: string) => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user, onDelete }) => {
  const [warnOpen, setWarnOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await onDelete?.(user.id);
    } finally {
      setDeleting(false);
      setWarnOpen(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900">View User</h2>
              <p className="text-sm text-gray-500 mt-0.5">View User details in the platform.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 mt-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50">
                {user.name}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50">
                {user.email}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50">
                {user.status}
              </div>
            </div>

            {/* Joined & Last Active */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Joined</label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50">
                  {user.joined}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Active</label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50">
                  {user.lastActive}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setWarnOpen(true)}
                className="flex-1 bg-color-main hover:bg-[#b5156a] text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-95"
              >
                Delete User
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning modal — rendered above view modal (z-[60]) */}
      <WarningModal
        isOpen={warnOpen}
        onClose={() => setWarnOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User?"
        message={`Are you sure you want to permanently delete "${user.name}"? This action cannot be undone.`}
        confirmLabel="Delete User"
        loading={deleting}
      />
    </>
  );
};

export default ViewUserModal;
