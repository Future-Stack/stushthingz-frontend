import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditInvestmentGuideModal, { GuideItem } from "../modals/EditInvestmentGuideModal";

const ContentTab: React.FC = () => {
  // ─── State Management ───────────────────────────────────────────────────────
  const [guides, setGuides] = useState<GuideItem[]>([
    { id: 1, title: "Buying Process", sections: 4, lastUpdated: "2026-03-15" },
    { id: 2, title: "Cost Overview", sections: 5, lastUpdated: "2026-03-20" },
    { id: 3, title: "Financing Guide", sections: 3, lastUpdated: "2026-04-01" },
    { id: 4, title: "Risks & Considerations", sections: 4, lastUpdated: "2026-04-05" },
  ]);

  // AI Prompts
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to Vanessa. I'll guide you through your Jamaica investment journey."
  );
  const [readinessPrompt, setReadinessPrompt] = useState(
    "Let's assess your financial readiness for investing in Jamaica real estate."
  );

  // Financial Rules
  const [minSavings, setMinSavings] = useState("25");
  const [maxDti, setMaxDti] = useState("4.3");

  // Interaction State
  const [editingGuide, setEditingGuide] = useState<GuideItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleEditClick = (guide: GuideItem) => {
    setEditingGuide({ ...guide });
  };

  const handleSaveGuide = (updatedGuide: GuideItem) => {
    setGuides((prev) =>
      prev.map((g) =>
        g.id === updatedGuide.id ? updatedGuide : g
      )
    );
    setEditingGuide(null);
    showToast(`Successfully updated "${updatedGuide.title}" Guide!`);
  };

  const handleSavePrompts = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("AI Prompts updated successfully!");
  };

  const handleUpdateRules = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Financial rules updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* ── Toast Notification ────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg border border-gray-800 text-sm font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white transition-colors ml-2 cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Investment Guide Content Card ────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          {/* <Settings2 size={18} className="text-[#64748B]" /> */}
          <h2 className="text-lg font-bold text-gray-900">Investment Guide Content</h2>
        </div>

        <div className="space-y-3.5">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-gray-200/80 transition-all duration-200"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900">{guide.title}</h3>
                <p className="text-xs text-[#64748B] font-medium flex items-center gap-1.5">
                  <span>{guide.sections} sections</span>
                  <span className="w-1 h-1 rounded-full bg-[#cbd5e1]" />
                  <span>Last updated: {guide.lastUpdated}</span>
                </p>
              </div>
              <button
                onClick={() => handleEditClick(guide)}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 size={13} className="text-gray-500" />
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Prompt Configuration Card ─────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          {/* <Sparkles size={18} className="text-[#64748B]" /> */}
          <h2 className="text-lg font-bold text-gray-900">AI Prompt Configuration</h2>
        </div>

        <form onSubmit={handleSavePrompts} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vanessa Welcome Message
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all min-h-[64px] resize-none"
              placeholder="Enter welcome message prompt"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Readiness Assessment Prompts
            </label>
            <textarea
              value={readinessPrompt}
              onChange={(e) => setReadinessPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all min-h-[64px] resize-none"
              placeholder="Enter assessment prompt config"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="bg-color-main hover:bg-[#b5156a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ── Financial Rules Configuration Card ────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-[18px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          {/* <Sliders size={18} className="text-[#64748B]" /> */}
          <h2 className="text-lg font-bold text-gray-900">Financial Rules Configuration</h2>
        </div>

        <form onSubmit={handleUpdateRules} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Savings Ratio
              </label>
              <input
                type="text"
                value={minSavings}
                onChange={(e) => setMinSavings(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all"
                placeholder="25"
              />
              <span className="text-xs text-gray-400 mt-1.5 block">
                % of investment budget required in savings
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Debt-to-Income Ratio
              </label>
              <input
                type="text"
                value={maxDti}
                onChange={(e) => setMaxDti(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main focus:bg-white transition-all"
                placeholder="4.3"
              />
              <span className="text-xs text-gray-400 mt-1.5 block">
                Maximum acceptable DTI ratio
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-color-main hover:bg-[#b5156a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Update Rules
            </button>
          </div>
        </form>
      </div>

      {/* ── Interactive Modal for Editing Guides ─────────────────────────── */}
      <EditInvestmentGuideModal
        isOpen={!!editingGuide}
        guide={editingGuide}
        onClose={() => setEditingGuide(null)}
        onSave={handleSaveGuide}
      />
    </div>
  );
};

export default ContentTab;
