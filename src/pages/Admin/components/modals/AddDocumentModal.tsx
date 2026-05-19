import React, { useState } from "react";
import { X } from "lucide-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddDocumentFormData) => void;
}

export interface AddDocumentFormData {
  documentName: string;
  category: string;
  description: string;
  required: boolean;
}

const CATEGORIES = ["Identity Documents", "Financial Documents", "Property Documents"];

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<AddDocumentFormData>({
    documentName: "",
    category: "",
    description: "",
    required: true,
  });
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add Document Template</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a new document requirement template for the investor checklist.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Document Name
            </label>
            <input
              type="text"
              name="documentName"
              value={form.documentName}
              onChange={handleChange}
              placeholder="e.g., Valid Passport"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all"
            />
          </div>

          {/* Category - Custom Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all cursor-pointer"
            >
              <span className={form.category ? "text-gray-800" : "text-gray-400"}>
                {form.category || "Select category"}
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, category: cat }));
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className={form.category === cat ? "text-color-main font-medium" : "text-gray-700"}>
                      {cat}
                    </span>
                    {form.category === cat && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8L6.5 11.5L13 4.5"
                          stroke="#D91A7C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter document description and requirements"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all resize-none"
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-gray-700">Required Document</span>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, required: !prev.required }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                form.required ? "bg-color-main" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.required ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-color-main hover:bg-[#b5156a] text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Document"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;
