import React from "react";
import { X, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface Document {
  id: string;
  name: string;
  status: "Uploaded" | "Missing";
  uploadedDate?: string;
}

interface DocumentPreviewModalProps {
  document: Document | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Document Preview</h3>
            <p className="text-xs text-gray-500 mt-0.5">Viewing document details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <FileText size={40} className="text-gray-300" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-gray-900">{document.name}</p>
            {document.uploadedDate && (
              <p className="text-xs text-gray-500">Uploaded: {document.uploadedDate}</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {document.status === "Uploaded" ? (
              <div className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] px-3 py-1.5 rounded-lg text-xs font-bold">
                <CheckCircle2 size={14} />
                Document Uploaded Successfully
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] px-3 py-1.5 rounded-lg text-xs font-bold">
                <AlertCircle size={14} />
                Document Missing
              </div>
            )}
          </div>

          {/* Mock Preview Box */}
          <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Document Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-gray-400">File Name</p>
                <p className="text-xs font-semibold text-gray-700 truncate">{document.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Status</p>
                <p className={`text-xs font-semibold ${document.status === "Uploaded" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {document.status}
                </p>
              </div>
              {document.uploadedDate && (
                <div>
                  <p className="text-[11px] text-gray-400">Upload Date</p>
                  <p className="text-xs font-semibold text-gray-700">{document.uploadedDate}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-gray-400">File Type</p>
                <p className="text-xs font-semibold text-gray-700">PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-[#D91E75] text-white rounded-lg text-sm font-bold hover:bg-[#c21a69] transition-colors">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
