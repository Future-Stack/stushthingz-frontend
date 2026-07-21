import React, { useState, useEffect } from "react";
import { X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { TInvestorDocument, TDocumentStatus, useUpdateDocumentStatusMutation } from "@/store/api/bankApi";

interface DocumentPreviewModalProps {
  document: TInvestorDocument | null;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  const [status, setStatus] = useState<TDocumentStatus>("accepted");
  const [note, setNote] = useState("");

  const [updateDocumentStatus, { isLoading }] = useUpdateDocumentStatusMutation();

  useEffect(() => {
    if (document) {
      setStatus(document.status || "accepted");
      setNote(document.note || "");
    }
  }, [document]);

  if (!document) return null;

  const handleUpdateStatus = async () => {
    try {
      await updateDocumentStatus({
        id: document.id,
        body: {
          status,
          note: note.trim() || undefined,
        },
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update document status:", err);
    }
  };

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

  const isUploaded = document.status === "accepted";

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
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
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
            {document.uploadedAt && (
              <p className="text-xs text-gray-500">Uploaded: {formatDate(document.uploadedAt)}</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isUploaded ? (
              <div className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] px-3 py-1.5 rounded-lg text-xs font-bold">
                <CheckCircle2 size={14} />
                Document Uploaded Successfully
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] px-3 py-1.5 rounded-lg text-xs font-bold">
                <AlertCircle size={14} />
                Document {document.statusLabel || document.status}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Document Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-gray-400">File Name</p>
                <p className="text-xs font-semibold text-gray-700 truncate">{document.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Status</p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TDocumentStatus)}
                  className={`text-xs font-semibold bg-white border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer ${
                    status === "accepted" ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  <option value="accepted" className="cursor-pointer">Accepted</option>
                  <option value="underReview" className="cursor-pointer">Under Review</option>
                  <option value="pending" className="cursor-pointer">Pending</option>
                  <option value="rejected" className="cursor-pointer">Rejected</option>
                </select>
              </div>
              {document.uploadedAt && (
                <div>
                  <p className="text-[11px] text-gray-400">Upload Date</p>
                  <p className="text-xs font-semibold text-gray-700">{formatDate(document.uploadedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-gray-400">File Type</p>
                <p className="text-xs font-semibold text-gray-700">{document.docType || "PDF"}</p>
              </div>
            </div>

            {/* Note Input */}
            <div className="pt-2 border-t border-gray-200/60">
              <p className="text-[11px] text-gray-400 mb-1">Operator Note</p>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add verification note..."
                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D91E75]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={isLoading}
            className="px-4 py-2 bg-[#D91E75] text-white rounded-lg text-sm font-bold hover:bg-[#c21a69] cursor-pointer disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Save Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
