import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import OverviewTab from "./ModalTabs/OverviewTab";
import FinancialTab from "./ModalTabs/FinancialTab";
import DocumentsTab from "./ModalTabs/DocumentsTab";
import NotesTab from "./ModalTabs/NotesTab";
import { useGetInvestorProfileQuery } from "@/store/api/bankApi";

interface InvestorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId?: string | null;
  profile?: any;
}

type TabType = "Overview" | "Financial" | "Documents" | "Log";

const InvestorProfileModal: React.FC<InvestorProfileModalProps> = ({
  isOpen,
  onClose,
  investorId,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  const { data: profileResponse, isLoading, isError, refetch } = useGetInvestorProfileQuery(
    investorId!,
    {
      skip: !isOpen || !investorId,
    }
  );

  if (!isOpen) return null;

  const profile = profileResponse?.data;
  const tabs: TabType[] = ["Overview", "Financial", "Documents", "Log"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start relative border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.overview.fullName || "Investor Profile"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage investor details and application status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Header */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                  activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#D91E75]" />
              <p className="text-sm font-medium">Fetching investor profile...</p>
            </div>
          ) : isError || !profile ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-500 mb-3">Failed to load investor profile details.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-1.5 bg-[#D91E75] text-white text-xs font-bold rounded-lg hover:bg-[#c21a69] cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {activeTab === "Overview" && <OverviewTab profile={profile} />}
              {activeTab === "Financial" && <FinancialTab profile={profile} />}
              {activeTab === "Documents" && <DocumentsTab profile={profile} />}
              {activeTab === "Log" && <NotesTab profile={profile} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorProfileModal;
