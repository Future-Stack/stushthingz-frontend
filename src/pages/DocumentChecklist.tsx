import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentChecklistContent from "@/components/onboarding/DocumentChecklistContent";
import { CheckCircle } from "lucide-react";

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
    <div className="bg-[#f8f9fa] pb-12 min-h-screen font-sans">
      {/* Header */}
      <div className="top-0 z-10 sticky bg-white border-gray-200 border-b">
        <div className="mx-auto px-4 sm:px-8 py-4 max-w-6xl">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
            <div>
              <h1 className="mb-1 font-bold text-color-jet-black text-3xl">Document Checklist</h1>
              <p className="mt-1 font-normal text-[#4A5565] text-base">
                {progress.uploadedDocs} of {progress.totalDocs} documents uploaded
              </p>
            </div>
            <button
              onClick={handleCompleteSetup}
              className="flex justify-center items-center gap-2 bg-color-main hover:bg-[#c2185b] shadow-md px-6 py-2.5 rounded-xl font-semibold text-white transition-all cursor-pointer"
            >
              <CheckCircle size={18} />
              Complete Setup & Finish
            </button>
          </div>
          {/* Progress Bar */}
          <div className="bg-gray-200 mt-4 rounded-full w-full h-2 overflow-hidden">
            <div
              className="bg-color-main h-full transition-all duration-500"
              style={{ width: `${progress.totalDocs > 0 ? (progress.uploadedDocs / progress.totalDocs) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto mt-8 px-4 sm:px-8 max-w-6xl">
        <DocumentChecklistContent onProgressUpdate={handleProgressUpdate} />

        {/* <div className="flex justify-end mt-8">
          <button
            onClick={handleCompleteSetup}
            className="flex items-center gap-2 bg-color-main hover:bg-[#c2185b] shadow-lg px-8 py-3 rounded-xl font-semibold text-white text-lg transition-all cursor-pointer"
          >
            Complete Setup & Finish <ArrowRight size={20} />
          </button>
        </div> */}
      </main>
    </div>
  );
};


export default DocumentChecklist;
