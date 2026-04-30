import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuideContent, { SECTIONS } from "@/components/onboarding/GuideContent";

const InvestmentGuide = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ completedCount: 0, isAllCompleted: false });

  const handleProgressUpdate = (completedCount: number, isAllCompleted: boolean) => {
    setProgress({ completedCount, isAllCompleted });
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-12">
      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto mt-4">
          <div className="px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-color-jet-black">Jamaica Investment Guide</h1>
              <p className="text-base text-[#4A5565] font-normal mb-4.5">
                {progress.completedCount} of {SECTIONS.length} sections completed
              </p>
            </div>
            <button
              onClick={() => navigate("/onboarding/documents")}
              disabled={!progress.isAllCompleted}
              className={`text-sm px-2 py-2 rounded-lg font-medium transition-colors ${progress.isAllCompleted
                ? "bg-color-main hover:bg-[#d01958] text-white cursor-pointer"
                : "bg-pink-200 text-white cursor-not-allowed"
                }`}
            >
              Continue to Documents →
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex space-x-1 mx-8 mt-2 mb-4.5">
            {SECTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-full rounded-full ${idx < progress.completedCount ? "bg-color-main" : "bg-gray-200"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8">
        <GuideContent onProgressUpdate={handleProgressUpdate} />
      </main>
    </div>
  );
};


export default InvestmentGuide;
