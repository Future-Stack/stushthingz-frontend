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
    <div className="z-[60] fixed inset-0 flex justify-center items-center bg-black/60 p-4">
      <div className="flex flex-col bg-white shadow-2xl rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-gray-100 border-b shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Document Preview</h3>
            <p className="mt-0.5 text-gray-500 text-xs">Viewing document details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex flex-col flex-1 items-center gap-4 p-6 overflow-y-auto">
          {document.url ? (
            <div className="flex justify-center items-center bg-gray-50 border border-gray-200 rounded-xl w-full h-64 overflow-hidden">
              {document.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) || document.docType?.toLowerCase().includes("image") ? (
                <img src={document.url} alt={document.name} className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={document.url}
                  title={document.name}
                  className="border-none w-full h-full"
                />
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl w-24 h-24">
              <FileText size={40} className="text-gray-300" />
            </div>
          )}

          <div className="space-y-1 text-center">
            <p className="max-w-sm font-bold text-gray-900 text-sm truncate" title={document.name}>{document.name}</p>
            {document.uploadedAt && (
              <p className="text-gray-500 text-xs">Uploaded: {formatDate(document.uploadedAt)}</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isUploaded ? (
              <div className="flex items-center gap-1.5 bg-[#ECFDF5] px-3 py-1.5 border border-[#A7F3D0] rounded-lg font-bold text-[#10B981] text-xs">
                <CheckCircle2 size={14} />
                {/* Document Uploaded Successfully */}{ document.status}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#FEF2F2] px-3 py-1.5 border border-[#FECACA] rounded-lg font-bold text-[#EF4444] text-xs">
                <AlertCircle size={14} />
                Document {document.statusLabel || document.status}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="space-y-3 bg-gray-50 p-4 border border-gray-100 rounded-xl w-full">
            <p className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Document Info</p>
            <div className="gap-3 grid grid-cols-2">
              <div>
                <p className="text-[11px] text-gray-400">File Name</p>
                <p className="font-semibold text-gray-700 text-xs truncate">{document.name}</p>
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
                  <p className="font-semibold text-gray-700 text-xs">{formatDate(document.uploadedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] text-gray-400">File Type</p>
                <p className="font-semibold text-gray-700 text-xs">{document.docType || "PDF"}</p>
              </div>
            </div>

            {/* Note Input */}
            <div className="pt-2 border-gray-200/60 border-t">
              <p className="mb-1 text-[11px] text-gray-400">Operator Note</p>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add verification note..."
                className="bg-white px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-[#D91E75] focus:ring-1 w-full text-gray-800 text-xs placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-gray-100 border-t shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg font-semibold text-gray-600 text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-[#D91E75] hover:bg-[#c21a69] px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
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
