import React, { useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "../../../../hooks/useOnClickOutside";
import { TInvestorProfileData, useUpdateDocumentStatusMutation, TDocumentStatus } from "@/store/api/bankApi";

interface OverviewTabProps {
  profile: TInvestorProfileData;
}

type ApplicationStatus = "Under Review" | "Approved" | "Rejected" | "Need More Info";

const STATUS_OPTIONS: ApplicationStatus[] = ["Under Review", "Approved", "Rejected", "Need More Info"];

const STATUS_TO_DOC_STATUS: Record<ApplicationStatus, TDocumentStatus> = {
  "Under Review": "underReview",
  "Approved": "accepted",
  "Rejected": "rejected",
  "Need More Info": "pending",
};

const OverviewTab: React.FC<OverviewTabProps> = ({ profile }) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    (profile.overview.applicationStatusLabel as ApplicationStatus) || "Under Review"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [updateDocumentStatus] = useUpdateDocumentStatusMutation();

  useOnClickOutside(dropdownRef, () => setStatusDropdownOpen(false));

  const handleStatusSelect = async (status: ApplicationStatus) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);

    const uploadedDocs = profile.documents.uploadedDocuments;
    if (uploadedDocs && uploadedDocs.length > 0) {
      try {
        await updateDocumentStatus({
          id: uploadedDocs[0].id,
          body: {
            status: STATUS_TO_DOC_STATUS[status],
            note: `Application status changed to ${status}`,
          },
        }).unwrap();
      } catch (err) {
        console.error("Failed to update status from overview:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Full Name</p>
          <p className="text-sm text-gray-900">{profile.overview.fullName || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Country of Residence</p>
          <p className="text-sm text-gray-900">{profile.overview.countryOfResidence || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Investment Goal</p>
          <p className="text-sm text-gray-900">{profile.overview.investmentGoal || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Budget Range</p>
          <p className="text-sm text-gray-900">{profile.overview.budgetRange || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Timeline</p>
          <p className="text-sm text-gray-900">{profile.overview.timeline || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Readiness Status</p>
          <p className="text-sm text-gray-900">
            {profile.overview.readinessLabel
              ? `${profile.overview.readinessPercentage}% ${profile.overview.readinessLabel}`
              : "N/A"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Application Status</p>
        {/* Dropdown wrapper */}
        <div className="relative mt-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-4 flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            {selectedStatus}
            <motion.span
              animate={{ rotate: statusDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ChevronDown size={16} className="text-gray-500" />
            </motion.span>
          </button>

          <AnimatePresence>
            {statusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-full left-0 w-full mb-1 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-20 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Update Status
                </div>
                <div className="px-1">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleStatusSelect(option)}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                        selectedStatus === option
                          ? "bg-gray-50 text-gray-900 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      {option}
                      {selectedStatus === option && (
                        <Check size={15} className="text-[#D91E75]" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
