import React, { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { TInvestorProfileData, useUpdateDocumentStatusMutation } from "@/store/api/bankApi";

interface NotesTabProps {
  profile: TInvestorProfileData;
}

const NotesTab: React.FC<NotesTabProps> = ({ profile }) => {
  const [noteText, setNoteText] = useState("");
  const uploadedDocs = profile.documents.uploadedDocuments || [];
  const [selectedDocId, setSelectedDocId] = useState<string>("");

  useEffect(() => {
    if (uploadedDocs.length > 0 && !selectedDocId) {
      setSelectedDocId(uploadedDocs[0].id);
    }
  }, [uploadedDocs, selectedDocId]);

  const [updateDocumentStatus, { isLoading }] = useUpdateDocumentStatusMutation();

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    const targetDoc = uploadedDocs.find((d) => d.id === selectedDocId) || uploadedDocs[0];
    if (!targetDoc) return;

    try {
      await updateDocumentStatus({
        id: targetDoc.id,
        body: {
          status: targetDoc.status,
          note: noteText.trim(),
        },
      }).unwrap();
      setNoteText("");
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const logs = profile.notes.activityLog || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Add New Note</h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your notes here..."
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D91E75] resize-none h-24"
        />

        {uploadedDocs.length > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#4B5A7A]">Document:</span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none text-gray-700 cursor-pointer"
            >
              {uploadedDocs.map((doc) => (
                <option key={doc.id} value={doc.id} className="cursor-pointer">
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-1 text-xs text-amber-600">
            Note: No uploaded documents found for this investor yet. Notes can be attached once a document is uploaded.
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleAddNote}
            disabled={isLoading || !noteText.trim() || uploadedDocs.length === 0}
            className="flex items-center gap-2 bg-[#D91A7C] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c21a69] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
            Add Note
          </button>
          <button
            type="button"
            onClick={() => setNoteText("")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Activity Log</h3>
        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-bold text-gray-900">{log.actorName || "System / Operator"}</p>
                  <p className="text-[11px] text-gray-400">{formatDate(log.createdAt)}</p>
                </div>
                <p className="text-sm text-[#4B5A7A]">{log.description || log.title}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No activity logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesTab;
