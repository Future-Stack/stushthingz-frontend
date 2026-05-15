import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DollarSign, FileText, House, TriangleAlert } from "lucide-react";

export const SECTIONS = [
  {
    id: "buying-process",
    title: "Buying Process",
    subtitle: "Step-by-step guide to purchasing property in Jamaica",
    icon: <House className="w-6 h-6 text-color-main" />,
    content: (
      <div className="space-y-6 mt-4 text-sm text-gray-700">
        <div>
          <h4 className="text-sm font-medium text-black mb-4">1. Property Search</h4>
          <p className="text-sm font-normal text-[#364153] mb-2">Work independently and understands foreign buyer needs. Key considerations:</p>
          <ul className="text-sm font-normal text-[#364153] list-disc pl-5 space-y-1">
            <li>Location: proximity to amenities, beaches, airports</li>
            <li>Property type: villa, condo, land, commercial</li>
            <li>Title verification: ensure clear ownership</li>
            <li>Development potential and zoning restrictions</li>
          </ul>
        </div>
        <div className="border-t border-[#7171827b] pt-4 flex justify-between items-center cursor-pointer">
          <span className="text-sm font-medium text-black">2. Offer & Negotiation</span>
          <FaChevronDown className="text-gray-400" />
        </div>
        <div className="border-t border-[#7171827b] pt-4 flex justify-between items-center cursor-pointer">
          <span className="text-sm font-medium text-black">3. Legal Process</span>
          <FaChevronDown className="text-gray-400" />
        </div>
        <div className="border-t border-[#7171827b] pt-4 flex justify-between items-center cursor-pointer">
          <span className="text-sm font-medium text-black">4. Closing</span>
          <FaChevronDown className="text-gray-400" />
        </div>
      </div>
    ),
  },
  {
    id: "cost-overview",
    title: "Cost Overview",
    subtitle: "Understanding the full financial picture",
    icon: <DollarSign className="w-6 h-6 text-color-main" />,
    content: (
      <div className="space-y-4 mt-4 text-sm text-gray-700">
        <div className="border-l-4 pl-5 border-color-main">
          <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">Stamp Duty</h4>
          <p className="text-gray-600">5-7.5% of property value depending on price tier</p>
        </div>
        <div className="border-l-4 pl-5 border-color-main">
          <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">Transfer Tax</h4>
          <p className="text-gray-600">4-5% of property value</p>
        </div>
        <div className="border-l-4 pl-5 border-color-main">
          <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">Legal Fees</h4>
          <p className="text-gray-600">Typically 2-3% of purchase price plus disbursements</p>
        </div>
        <div className="border-l-4 pl-5 border-color-main">
          <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">Agent Commission</h4>
          <p className="text-gray-600">Usually 5% paid by seller, but verify in agreement</p>
        </div>
        <div className="border-l-4 pl-5 border-[#FE9A00]">
          <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">Hidden Costs to Consider</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Property insurance</li>
            <li>Ongoing maintenance and property management</li>
            <li>Utilities setup and deposits</li>
            <li>Annual property tax (0.75-1% of property value)</li>
            <li>Currency exchange fees</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "financing-guide",
    title: "Financing Guide",
    subtitle: "Mortgage options for foreign buyers",
    icon: <FileText className="w-6 h-6 text-color-main" />,
    content: (
      <div className="space-y-4 mt-4 text-sm text-gray-700">
        <div>
          <h4 className="text-lg font-semibold text-[#364153] mb-2">Eligibility Basics</h4>
          <ul className="text-[#364153] text-base font-normal pl-5 space-y-1">
            <li>Most Jamaican banks offer mortgages to foreign nationals</li>
            <li>Typical down payment: 15-25% for non-residents</li>
            <li>Interest rates: 7-11% depending on bank and profile</li>
            <li>Maximum loan-to-value: 60-75% for foreign buyers</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#364153] mb-2">Required Documents</h4>
          <ul className="text-[#364153] text-base font-normal pl-5 space-y-1">
            <li>Proof of income (pay stubs, tax returns, employment letter)</li>
            <li>Bank statements (last 6 months)</li>
            <li>Credit report from home country</li>
            <li>Valid passport and proof of address</li>
            <li>Property valuation and title documents</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#364153] mb-2">Bank Expectations</h4>
          <ul className="text-[#364153] text-base font-normal pl-5 space-y-1">
            <li>Debt-to-income ratio below 40%</li>
            <li>Strong credit history in home country</li>
            <li>Stable employment (2+ years)</li>
            <li>Sufficient reserves for 6+ months payments</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "risks-considerations",
    title: "Risks & Considerations",
    subtitle: "Important factors to understand",
    icon: <TriangleAlert className="w-6 h-6 text-[#E17100]" />,
    iconBg: "bg-[#FEF3C6]",
    content: (
      <div className="space-y-4 mt-4 text-sm text-gray-700">
        <div>
          <h4 className="text-lg text-[#BB4D00] font-semibold mb-2">Legal Risks</h4>
          <ul className="text-base font-normal text-[#364153] list-disc pl-5 space-y-1">
            <li>Always use a qualified local attorney</li>
            <li>Verify clear title before committing</li>
            <li>Understand zoning and building restrictions</li>
            <li>Be aware of squatter's rights laws</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg text-[#BB4D00] font-semibold mb-2">Market Risks</h4>
          <ul className="text-base font-normal text-[#364153] list-disc pl-5 space-y-1">
            <li>Property values can fluctuate with tourism trends</li>
            <li>Currency exchange rate volatility (JMD/USD)</li>
            <li>Limited liquidity in some market segments</li>
            <li>Rental income may vary seasonally</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg text-[#BB4D00] font-semibold mb-2">Foreign Ownership Considerations</h4>
          <ul className="text-base font-normal text-[#364153] list-disc pl-5 space-y-1">
            <li>Non-residents can own property but some restrictions apply</li>
            <li>Properties over 0.5 acres may require government approval</li>
            <li>Estate planning: understand inheritance laws</li>
            <li>Tax implications in both Jamaica and home country</li>
          </ul>
        </div>
      </div>
    ),
  },
];

interface GuideContentProps {
  onProgressUpdate?: (completedCount: number, isAllCompleted: boolean) => void;
}

const GuideContent: React.FC<GuideContentProps> = ({ onProgressUpdate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("buying-process");
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = { ...completedSections, [id]: true };
    setCompletedSections(newCompleted);

    const completedCount = Object.values(newCompleted).filter(Boolean).length;
    const isAllCompleted = SECTIONS.every((s) => newCompleted[s.id]);

    if (onProgressUpdate) {
      onProgressUpdate(completedCount, isAllCompleted);
    }

    // Auto-expand next section if available
    const currentIndex = SECTIONS.findIndex((s) => s.id === id);
    if (currentIndex >= 0 && currentIndex < SECTIONS.length - 1) {
      setExpandedSection(SECTIONS[currentIndex + 1].id);
    } else {
      setExpandedSection(null);
    }
  };

  return (
    <div className="space-y-4">
      {SECTIONS.map((section) => {
        const isExpanded = expandedSection === section.id;
        const isCompleted = completedSections[section.id];

        return (
          <div
            key={section.id}
            className={`rounded-2xl border overflow-hidden transition-colors py-4 px-4 md:px-6 ${isCompleted ? "border-green-200" : "border-[#919EAB]"
              }`}
          >
            <div
              onClick={() => toggleSection(section.id)}
              className="flex items-start justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className={`p-2 md:p-3 rounded-xl ${section.iconBg || "bg-[#FFF0F7]"}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="md:text-2xl text-lg font-bold text-black">{section.title}</h3>
                  <p className="text-base font-normal text-[#454F5B] mb-2">{section.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                {isCompleted && <FaCheck className="text-green-500" />}
                {isExpanded ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#717182]"
                >
                  <div className="pt-2">
                    {section.content}

                    <div className="mt-6 pt-4">
                      {isCompleted ? (
                        <div className="inline-block px-4 py-2 border border-gray-200 text-gray-500 rounded-md text-sm cursor-not-allowed">
                          Completed
                        </div>
                      ) : (
                        <button
                          onClick={(e) => markAsRead(section.id, e)}
                          className="text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors cursor-pointer border border-gray-200"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default GuideContent;
