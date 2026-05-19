import React, { useState } from "react";
import { Download, FileText, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { InvestorProfileDetails } from "../data/mockData";
import DocumentPreviewModal from "../DocumentPreviewModal";

interface DocumentsTabProps {
  profile: InvestorProfileDetails;
}

type Document = InvestorProfileDetails["documents"][number];

const DocumentsTab: React.FC<DocumentsTabProps> = ({ profile }) => {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Document Status</h3>
          <p className="text-xs text-[#4B5A7A]">
            {profile.documents.filter((d) => d.status === "Uploaded").length} of {profile.documents.length} documents uploaded
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <Download size={14} />
          Download All
        </button>
      </div>

      <div className="space-y-3">
        {profile.documents.map((doc) => (
          <div key={doc.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                {doc.uploadedDate && (
                  <p className="text-[11px] text-gray-500">Uploaded: {doc.uploadedDate}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {doc.status === "Uploaded" ? (
                <div className="flex items-center gap-1 bg-[#00C950] text-white px-2 py-1 rounded text-[11px] font-bold">
                  <CheckCircle2 size={12} />
                  Uploaded
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-white border border-[#EF4444] text-[#EF4444] px-2 py-1 rounded text-[11px] font-bold">
                  <AlertCircle size={12} />
                  Missing
                </div>
              )}

              {doc.status === "Uploaded" && (
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye size={14} />
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {profile.documents.some((d) => d.status === "Missing") && (
        <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-4 flex gap-3 mt-4">
          <AlertCircle size={18} className="text-[#D08700] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-[#92400E]">Missing Documents</h4>
            <p className="text-xs text-[#894B00] mt-1 leading-relaxed">
              {profile.documents.filter((d) => d.status === "Missing").length} required document(s) are still pending. Consider updating application status to &quot;Need More Info&quot;.
            </p>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};

export default DocumentsTab;
