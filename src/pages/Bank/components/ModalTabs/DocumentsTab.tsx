import React, { useState } from "react";
import { FileText, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { TInvestorProfileData, TInvestorDocument } from "@/store/api/bankApi";
import DocumentPreviewModal from "../DocumentPreviewModal";

interface DocumentsTabProps {
  profile: TInvestorProfileData;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ profile }) => {
  const [previewDoc, setPreviewDoc] = useState<TInvestorDocument | null>(null);

  const { documents } = profile;
  const uploadedCount = documents.uploadedDocuments.length;
  const totalCount = documents.totalRequired;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toISOString().split("T")[0];
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Document Status</h3>
          <p className="text-[#4B5A7A] text-xs">
            {uploadedCount} of {totalCount} documents uploaded
          </p>
        </div>
        {/* <button
          type="button"
          className="flex items-center gap-1.5 hover:bg-gray-50 px-3 py-1.5 border border-gray-200 rounded-lg font-semibold text-gray-700 text-xs transition-colors cursor-pointer"
        >
          <Download size={14} />
          Download All
        </button> */}
      </div>

      <div className="space-y-3">
        {documents.uploadedDocuments.map((doc) => (
          <div key={doc.id} className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 p-4 border border-gray-100 rounded-xl">
            <div className="flex flex-1 items-center gap-3 min-w-0">
              <FileText size={20} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate" title={doc.name}>
                  {doc.name}
                </p>
                {doc.uploadedAt && (
                  <p className="text-[11px] text-gray-500">Uploaded: {formatDate(doc.uploadedAt)}</p>
                )}
              </div>
            </div>
            <div className="flex items-center self-end sm:self-auto gap-2 shrink-0">
              {doc.status === "accepted" ? (
                <div className="flex items-center gap-1 bg-[#00C950] px-2 py-1 rounded font-bold text-[11px] text-white shrink-0">
                  <CheckCircle2 size={12} />
                  {doc.status}
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-white px-2 py-1 border border-[#EF4444] rounded font-bold text-[#EF4444] text-[11px] shrink-0">
                  <AlertCircle size={12} />
                  {doc.status}
                </div>
              )}

              <button
                type="button"
                onClick={() => setPreviewDoc(doc)}
                className="flex items-center gap-1.5 hover:bg-gray-50 px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-gray-700 text-xs transition-colors cursor-pointer shrink-0"
              >
                <Eye size={14} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* {documents.missingCount > 0 && (
        <div className="flex gap-3 bg-[#FFFBEB] mt-4 p-4 border border-[#FEF3C7] rounded-xl">
          <AlertCircle size={18} className="mt-0.5 text-[#D08700] shrink-0" />
          <div>
            <h4 className="font-bold text-[#92400E] text-sm">Missing Documents</h4>
            <p className="mt-1 text-[#894B00] text-xs leading-relaxed">
              {documents.missingCount} required document(s) are still pending. Consider updating application status to &quot;Need More Info&quot;.
            </p>
          </div>
        </div>
      )} */}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};

export default DocumentsTab;
