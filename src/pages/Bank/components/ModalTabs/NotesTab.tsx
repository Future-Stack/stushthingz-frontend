import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { InvestorProfileDetails } from "../data/mockData";

interface NotesTabProps {
  profile: InvestorProfileDetails;
}

const NotesTab: React.FC<NotesTabProps> = ({ profile }) => {
  const [noteText, setNoteText] = useState("");

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
        <div className="flex gap-2 mt-3">
          <button className="flex items-center gap-2 bg-[#D91A7C] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c21a69] transition-colors">
            <MessageSquare size={16} />
            Add Note
          </button>
          <button
            onClick={() => setNoteText("")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Activity Log</h3>
        <div className="space-y-3">
          {profile.activityLog.map((log) => (
            <div key={log.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-bold text-gray-900">{log.author}</p>
                <p className="text-[11px] text-gray-400">{log.date}</p>
              </div>
              <p className="text-sm text-[#4B5A7A]">{log.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesTab;
