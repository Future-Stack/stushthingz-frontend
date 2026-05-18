import React, { useState } from "react";
import { X } from "lucide-react";
import { InvestorProfileDetails } from "./data/mockData";
import OverviewTab from "./ModalTabs/OverviewTab";
import FinancialTab from "./ModalTabs/FinancialTab";
import DocumentsTab from "./ModalTabs/DocumentsTab";
import NotesTab from "./ModalTabs/NotesTab";

interface InvestorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: InvestorProfileDetails | null;
}

type TabType = "Overview" | "Financial" | "Documents" | "Notes";

const InvestorProfileModal: React.FC<InvestorProfileModalProps> = ({ isOpen, onClose, profile }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  if (!isOpen || !profile) return null;

  const tabs: TabType[] = ["Overview", "Financial", "Documents", "Notes"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start relative">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Investor Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Review and manage investor details and application status.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto">
          {activeTab === "Overview" && <OverviewTab profile={profile} />}
          {activeTab === "Financial" && <FinancialTab profile={profile} />}
          {activeTab === "Documents" && <DocumentsTab profile={profile} />}
          {activeTab === "Notes" && <NotesTab profile={profile} />}
        </div>
      </div>
    </div>
  );
};

export default InvestorProfileModal;
