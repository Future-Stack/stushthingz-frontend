import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditInvestmentGuideModal from "../modals/EditInvestmentGuideModal";
import { useGetInvestmentGuideQuery, useUpdateGuideSectionMutation } from "@/store/features/investmentGuide/investmentGuide.api";
import type { TGuideSection } from "@/store/storeTypes/investmentGuide";

const ContentTab: React.FC = () => {
  // ─── API ─────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useGetInvestmentGuideQuery();
  const [updateSection] = useUpdateGuideSectionMutation();
  const sections = data?.data ?? [];

  // ─── AI Prompts (local state — no backend yet) ────────────────────────────
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to Vanessa. I'll guide you through your Jamaica investment journey."
  );
  const [readinessPrompt, setReadinessPrompt] = useState(
    "Let's assess your financial readiness for investing in Jamaica real estate."
  );

  // Financial Rules
  const [minSavings, setMinSavings] = useState("25");
  const [maxDti, setMaxDti] = useState("4.3");

  // ─── Interaction State ────────────────────────────────────────────────────
  const [editingSection, setEditingSection] = useState<TGuideSection | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // ─── Actions ─────────────────────────────────────────────────────────────
  // const showToast = (message: string, type: "success" | "info" = "success") => {
  //   setToast({ message, type });
  //   setTimeout(() => setToast(null), 3000);
  // };

  const handleEditClick = (section: TGuideSection) => {
    setEditingSection(section);
  };

  const handleSaveSection = async (id: string, data: { title: string; subtitle: string; content: string }) => {
    try {
      await updateSection({ id, data }).unwrap();
      setEditingSection(null);
      // showToast(`Successfully updated "${data.title}"!`);
    } catch {
      // error toast handled by baseQueryWithToast
    }
  };

  const handleSavePrompts = (e: React.FormEvent) => {
    e.preventDefault();
    // showToast("AI Prompts updated successfully!");
  };

  const handleUpdateRules = (e: React.FormEvent) => {
    e.preventDefault();
    // showToast("Financial rules updated successfully!");
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
            className="top-6 right-6 z-50 fixed flex items-center gap-2.5 bg-gray-900 shadow-lg px-4 py-3 border border-gray-800 rounded-xl font-medium text-white text-sm"
          >
            <div className="flex justify-center items-center bg-emerald-500 rounded-full w-5 h-5 shrink-0">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Investment Guide Content Card ────────────────────────────────── */}
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-[18px]">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-bold text-gray-900 text-lg">Investment Guide Content</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 border border-gray-100 rounded-xl animate-pulse">
                <div className="bg-gray-200 mb-2 rounded w-40 h-4" />
                <div className="bg-gray-100 rounded w-56 h-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3.5">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex justify-between items-center bg-white hover:shadow-md p-4 border border-gray-100 hover:border-gray-200/80 rounded-xl transition-all duration-200"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-sm">{section.title}</h3>
                  <p className="flex items-center gap-1.5 font-medium text-[#64748B] text-xs">
                    <span>{section.items.length} items</span>
                    <span className="bg-[#cbd5e1] rounded-full w-1 h-1" />
                    <span>Last updated: {new Date(section.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleEditClick(section)}
                  className="flex items-center gap-1.5 hover:bg-gray-50 px-3.5 py-1.5 border border-gray-200 rounded-lg font-semibold text-gray-700 text-xs transition-colors cursor-pointer"
                >
                  <Edit3 size={13} className="text-gray-500" />
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI Prompt Configuration Card ─────────────────────────────────── */}
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-[18px]">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-bold text-gray-900 text-lg">AI Prompt Configuration</h2>
        </div>

        <form onSubmit={handleSavePrompts} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">
              Vanessa Welcome Message
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="bg-[#F8FAFC] focus:bg-white px-4 py-3 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full min-h-[64px] text-gray-800 text-sm transition-all resize-none"
              placeholder="Enter welcome message prompt"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">
              Readiness Assessment Prompts
            </label>
            <textarea
              value={readinessPrompt}
              onChange={(e) => setReadinessPrompt(e.target.value)}
              className="bg-[#F8FAFC] focus:bg-white px-4 py-3 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full min-h-[64px] text-gray-800 text-sm transition-all resize-none"
              placeholder="Enter assessment prompt config"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="bg-color-main hover:bg-[#b5156a] shadow-sm px-5 py-2.5 rounded-xl font-semibold text-white text-sm active:scale-95 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ── Financial Rules Configuration Card ────────────────────────────── */}
      <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-[18px]">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-bold text-gray-900 text-lg">Financial Rules Configuration</h2>
        </div>

        <form onSubmit={handleUpdateRules} className="space-y-6">
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                Minimum Savings Ratio
              </label>
              <input
                type="text"
                value={minSavings}
                onChange={(e) => setMinSavings(e.target.value)}
                className="bg-[#F8FAFC] focus:bg-white px-4 py-3 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full text-gray-800 text-sm transition-all"
                placeholder="25"
              />
              <span className="block mt-1.5 text-gray-400 text-xs">
                % of investment budget required in savings
              </span>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                Maximum Debt-to-Income Ratio
              </label>
              <input
                type="text"
                value={maxDti}
                onChange={(e) => setMaxDti(e.target.value)}
                className="bg-[#F8FAFC] focus:bg-white px-4 py-3 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full text-gray-800 text-sm transition-all"
                placeholder="4.3"
              />
              <span className="block mt-1.5 text-gray-400 text-xs">
                % of Maximum acceptable DTI ratio
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-color-main hover:bg-[#b5156a] shadow-sm px-5 py-2.5 rounded-xl font-semibold text-white text-sm active:scale-95 transition-all cursor-pointer"
            >
              Update Rules
            </button>
          </div>
        </form>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <EditInvestmentGuideModal
        isOpen={!!editingSection}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveSection}
      />
    </div>
  );
};

export default ContentTab;
