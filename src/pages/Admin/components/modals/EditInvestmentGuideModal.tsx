import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  guide: GuideItem | null;
  onSave: (updatedGuide: GuideItem) => void;
}

const EditInvestmentGuideModal: React.FC<EditInvestmentGuideModalProps> = ({
  isOpen,
  onClose,
  guide,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sections, setSections] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    if (guide) {
      setTitle(guide.title || "");
      setContent(guide.content || "");
      setSections(guide.sections || 0);
      setLastUpdated(guide.lastUpdated || "");
    }
  }, [guide]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;
    onSave({
      ...guide,
      title,
      content,
      sections,
      lastUpdated,
    });
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] mx-4 p-6"
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
                Update the content for {guide?.title || "Buying Process"}. Changes will be reflected in the Investment Guide.
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

              {/* Content (Markdown Supported) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content (Markdown Supported)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all min-h-[140px] resize-none font-mono placeholder:font-mono placeholder:text-gray-400"
                  placeholder="Enter guide content using Markdown formatting..."
                />
              </div>

              {/* Number of Sections & Last Updated */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Sections
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={sections}
                    onChange={(e) => setSections(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all font-medium"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <input
                    type="text"
                    required
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all font-medium"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
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
