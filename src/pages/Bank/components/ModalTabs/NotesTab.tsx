import React from "react";
import { TInvestorProfileData } from "@/store/api/bankApi";

interface NotesTabProps {
  profile: TInvestorProfileData;
}

const NotesTab: React.FC<NotesTabProps> = ({ profile }) => {
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
