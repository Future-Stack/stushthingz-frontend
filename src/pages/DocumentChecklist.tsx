import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentChecklistContent from "@/components/onboarding/DocumentChecklistContent";
import { ArrowRight, CheckCircle } from "lucide-react";

const DocumentChecklist = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ uploadedDocs: 0, totalDocs: 0 });

  const handleProgressUpdate = (uploadedCount: number, totalCount: number) => {
    setProgress({ uploadedDocs: uploadedCount, totalDocs: totalCount });
  };

  const handleCompleteSetup = () => {
    navigate("/investor/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl text-color-jet-black font-bold mb-1">Document Checklist</h1>
              <p className="text-base font-normal text-[#4A5565] mt-1">
                {progress.uploadedDocs} of {progress.totalDocs} documents uploaded
              </p>
            </div>
            <button
              onClick={handleCompleteSetup}
              className="bg-color-main hover:bg-[#c2185b] text-white px-6 py-2.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle size={18} />
              Complete Setup & Finish
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-color-main transition-all duration-500"
              style={{ width: `${progress.totalDocs > 0 ? (progress.uploadedDocs / progress.totalDocs) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8">
        <DocumentChecklistContent onProgressUpdate={handleProgressUpdate} />

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCompleteSetup}
            className="bg-color-main hover:bg-[#c2185b] text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            Complete Setup & Finish <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};


export default DocumentChecklist;
