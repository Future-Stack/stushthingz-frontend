import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DollarSign, FileText, House, TriangleAlert } from "lucide-react";
import { useGetInvestmentGuideQuery, useMarkSectionAsReadMutation } from "@/store/features/investmentGuide/investmentGuide.api";
import type { TGuideSection, TGuideSectionType } from "@/store/storeTypes/investmentGuide";

// ─── Section type → icon mapping ─────────────────────────────────────────────
const getSectionIcon = (type: TGuideSectionType, icon: string | null) => {
  if (icon === "triangle-alert" || type === "warning") return <TriangleAlert className="w-6 h-6 text-[#E17100]" />;
  if (icon === "dollar-sign") return <DollarSign className="w-6 h-6 text-color-main" />;
  if (icon === "file-text") return <FileText className="w-6 h-6 text-color-main" />;
  return <House className="w-6 h-6 text-color-main" />;
};

const getSectionIconBg = (type: TGuideSectionType) => {
  if (type === "warning") return "bg-[#FEF3C6]";
  return "bg-[#FFF0F7]";
};

// ─── Accordion sub-section renderer (for type=accordion) ─────────────────────
const AccordionContent: React.FC<{ section: TGuideSection }> = ({ section }) => {
  const [expandedSub, setExpandedSub] = useState<string | null>(section.items[0]?.id ?? null);

  return (
    <div className="space-y-4 mt-4 text-sm text-gray-700">
      {section.items.map((item, idx) => {
        const isExpanded = expandedSub === item.id;
        const bullets = item.content.split("\n").filter(Boolean);
        return (
          <div key={item.id} className={idx > 0 ? "border-t border-[#7171827b] pt-4" : ""}>
            <div
              onClick={() => setExpandedSub(isExpanded ? null : item.id)}
              className="flex justify-between items-center cursor-pointer py-1"
            >
              <span className="text-sm font-medium text-black">{item.title}</span>
              {isExpanded ? (
                <FaChevronUp className="text-gray-400 w-3 h-3" />
              ) : (
                <FaChevronDown className="text-gray-400 w-3 h-3" />
              )}
            </div>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1">
                    <ul className="text-sm font-normal text-[#364153] list-disc pl-5 space-y-1">
                      {bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
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

// ─── Article renderer (for type=article, cost-overview style) ─────────────────
const ArticleContent: React.FC<{ section: TGuideSection }> = ({ section }) => (
  <div className="space-y-4 mt-4 text-sm text-gray-700">
    {section.items.map((item) => {
      const isNote = item.type === "note";
      const bullets = item.content.split("\n").filter(Boolean);
      return (
        <div
          key={item.id}
          className={`border-l-4 pl-5 ${isNote ? "border-[#FE9A00]" : "border-color-main"}`}
        >
          {item.title && (
            <h4 className="text-lg text-color-jet-black mb-1.5 font-semibold">{item.title}</h4>
          )}
          {bullets.length > 1 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : (
            <p className="text-gray-600">{item.content}</p>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Warning renderer (for type=warning, risks style) ────────────────────────
const WarningContent: React.FC<{ section: TGuideSection }> = ({ section }) => (
  <div className="space-y-4 mt-4 text-sm text-gray-700">
    {section.items.map((item) => {
      const bullets = item.content.split("\n").filter(Boolean);
      return (
        <div key={item.id}>
          {item.title && (
            <h4 className="text-lg text-[#BB4D00] font-semibold mb-2">{item.title}</h4>
          )}
          <ul className="text-base font-normal text-[#364153] list-disc pl-5 space-y-1">
            {bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      );
    })}
  </div>
);

// ─── Dynamic content by section type ─────────────────────────────────────────
const SectionContent: React.FC<{ section: TGuideSection }> = ({ section }) => {
  if (section.type === "accordion") return <AccordionContent section={section} />;
  if (section.type === "warning") return <WarningContent section={section} />;
  return <ArticleContent section={section} />;
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const GuideSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-gray-200 py-4 px-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main exported component ──────────────────────────────────────────────────
interface GuideContentProps {
  onProgressUpdate?: (completedCount: number, isAllCompleted: boolean) => void;
}

const GuideContent: React.FC<GuideContentProps> = ({ onProgressUpdate }) => {
  const { data, isLoading, isError } = useGetInvestmentGuideQuery();
  const [markSectionAsRead, { isLoading: isMarking }] = useMarkSectionAsReadMutation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const sections = data?.data ?? [];

  // Notify parent of progress whenever sections change
  React.useEffect(() => {
    if (sections.length === 0) return;
    const completedCount = sections.filter((s) => s.isCompleted).length;
    const isAllCompleted = completedCount === sections.length;
    onProgressUpdate?.(completedCount, isAllCompleted);
    // Auto-open first incomplete section on initial load
    if (expandedSection === null) {
      const firstIncomplete = sections.find((s) => !s.isCompleted);
      setExpandedSection(firstIncomplete?.id ?? sections[0]?.id ?? null);
    }
  }, [sections]);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleMarkAsRead = async (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingId(sectionId);
    try {
      await markSectionAsRead(sectionId).unwrap();
      // Auto-expand next incomplete section
      const currentIndex = sections.findIndex((s) => s.id === sectionId);
      const nextIncomplete = sections.slice(currentIndex + 1).find((s) => !s.isCompleted);
      setExpandedSection(nextIncomplete?.id ?? null);
    } catch {
      // error toast is handled by baseQueryWithToast
    } finally {
      setPendingId(null);
    }
  };

  if (isLoading) return <GuideSkeleton />;
  if (isError) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Failed to load investment guide. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isExpanded = expandedSection === section.id;
        const isCompleted = section.isCompleted;
        const isCurrentlyMarking = pendingId === section.id && isMarking;

        return (
          <div
            key={section.id}
            className={`rounded-2xl border overflow-hidden transition-colors py-4 px-4 md:px-6 ${
              isCompleted ? "border-green-200" : "border-[#919EAB]"
            }`}
          >
            <div
              onClick={() => toggleSection(section.id)}
              className="flex items-start justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className={`p-2 md:p-3 rounded-xl ${getSectionIconBg(section.type)}`}>
                  {getSectionIcon(section.type, section.icon)}
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
                    <SectionContent section={section} />

                    <div className="mt-6 pt-4">
                      {isCompleted ? (
                        <div className="inline-block px-4 py-2 border border-gray-200 text-gray-500 rounded-md text-sm cursor-not-allowed">
                          Completed
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleMarkAsRead(section.id, e)}
                          disabled={isCurrentlyMarking}
                          className="text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors cursor-pointer border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isCurrentlyMarking ? "Saving..." : "Mark as Read"}
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

// Keep SECTIONS export for backward compat with InvestmentGuide.tsx header count
// It will now reflect the count from API data length or default 4
export const SECTIONS = [1, 2, 3, 4]; // placeholder — InvestmentGuide.tsx should use API data length

export default GuideContent;
