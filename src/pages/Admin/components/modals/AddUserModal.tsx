import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateUserByAdminMutation } from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddUserFormData) => void;
}

export interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [createUserByAdmin] = useCreateUserByAdminMutation()
  const [form, setForm] = useState<AddUserFormData>({
    name: "",
    email: "",
    password: "",
    role: "bank_operator",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserByAdmin(form).unwrap()
      toast.success("User created successfully")
      onClose();
    } catch (error: any) {
      console.log("error", error?.data?.message)
      // toast.error(error?.data?.message || "Failed to create user")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white shadow-2xl mx-4 p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in duration-200 scroll-bar scroll-smooth fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Add New User</h2>
            <p className="mt-0.5 text-gray-500 text-sm">
              Create a new user account and assign their role in the platform.
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Full Name */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="px-3.5 py-2.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/30 w-full text-gray-800 text-sm transition-all placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="px-3.5 py-2.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/30 w-full text-gray-800 text-sm transition-all placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="px-3.5 py-2.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/30 w-full text-gray-800 text-sm transition-all placeholder-gray-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-white px-3.5 py-2.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/30 w-full text-gray-800 text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="user">Investor</option>
                <option value="bank_operator">Bank User</option>
                {/* <option value="admin">Admin</option> */}
              </select>
              <div className="top-1/2 right-3.5 absolute -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700 text-sm">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-white px-3.5 py-2.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/30 w-full text-gray-800 text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="top-1/2 right-3.5 absolute -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-color-main hover:bg-[#b5156a] disabled:opacity-60 py-2.5 rounded-xl font-semibold text-white text-sm transition-all cursor-pointer"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 hover:bg-gray-50 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
