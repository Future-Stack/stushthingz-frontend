import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TGuideSection } from "@/store/storeTypes/investmentGuide";

// Keep the old GuideItem export for any other imports that might use it
export interface GuideItem {
  id: number;
  title: string;
  sections: number;
  lastUpdated: string;
  content?: string;
}

interface EditInvestmentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: TGuideSection | null;
  onSave: (id: string, data: { title: string; subtitle: string; content: string }) => void;
}

const EditInvestmentGuideModal: React.FC<EditInvestmentGuideModalProps> = ({
  isOpen,
  onClose,
  section,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (section) {
      setTitle(section.title || "");
      setSubtitle(section.subtitle || "");
      // Combine all item content into a single editable string
      // Each item is separated by a blank line, prefixed with its title if it has one
      const combined = section.items
        .map((item) => {
          if (item.title) return `${item.title}\n${item.content}`;
          return item.content;
        })
        .join("\n\n");
      setContent(combined);
    }
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!section) return;
    onSave(section.id, { title, subtitle, content });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] mx-4 p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 pr-6">
              <h2 className="text-[19px] font-bold text-gray-900 leading-snug">
                Edit Investment Guide Content
              </h2>
              <p className="text-sm text-gray-500 font-normal mt-1 leading-relaxed">
                Update the content for <strong>{section?.title}</strong>. Changes will be reflected in the Investment Guide.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Guide Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guide Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all font-medium"
                  placeholder="Enter guide title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all font-medium"
                  placeholder="Enter subtitle"
                />
              </div>

              {/* Content — one item per line, sections separated by blank lines */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Each line is a bullet point. Separate groups with a blank line. The first line of a group becomes the heading.
                </p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all min-h-[180px] resize-none font-mono placeholder:font-mono placeholder:text-gray-400"
                  placeholder={"1. Property Search\nLocation: proximity to amenities\nProperty type: villa, condo\n\n2. Offer & Negotiation\nWritten offer through attorney"}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-color-main hover:bg-[#b5156a] text-white py-3 rounded-xl text-[15px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-900 hover:bg-gray-50 py-3 rounded-xl text-[15px] font-semibold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditInvestmentGuideModal;
