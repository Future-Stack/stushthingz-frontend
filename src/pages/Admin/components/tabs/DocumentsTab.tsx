import React, { useState, useEffect } from "react";
import { Plus, SquarePen, Trash2, X } from "lucide-react";
import AddDocumentModal, { AddDocumentFormData } from "../modals/AddDocumentModal";
import WarningModal from "../modals/WarningModal";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  required: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: "1", name: "Valid Passport", category: "Identity Documents", description: "A valid passport with at least 6 months remaining", required: true },
  { id: "2", name: "Bank Statements", category: "Financial Documents", description: "Last 6 months of bank statements", required: true },
  { id: "3", name: "Tax Returns", category: "Financial Documents", description: "Last 2 years of tax returns", required: true },
];

// ─── Inline Edit Modal ────────────────────────────────────────────────────────
interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onSave: (updated: DocumentItem) => void;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ isOpen, onClose, document, onSave }) => {
  const [form, setForm] = useState<DocumentItem>(
    document ?? { id: "", name: "", category: "", description: "", required: true }
  );

  useEffect(() => {
    if (document) setForm(document);
  }, [document]);

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Document</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update document requirement details.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-color-main/30 focus:border-color-main transition-all"
            />
          </div>

          {/* Required toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-gray-700">Required Document</span>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, required: !p.required }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.required ? "bg-color-main" : "bg-gray-200"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.required ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => { onSave(form); onClose(); }}
              className="flex-1 bg-color-main hover:bg-[#b5156a] text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-95"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Documents Tab ─────────────────────────────────────────────────────────────
const DocumentsTab: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);

  // Add modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Warning / delete modal
  const [warnOpen, setWarnOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddDocument = (data: AddDocumentFormData) => {
    const newDoc: DocumentItem = {
      id: String(Date.now()),
      name: data.documentName,
      category: data.category,
      description: data.description,
      required: data.required,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setAddModalOpen(false);
  };

  const handleSaveEdit = (updated: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const openEdit = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setEditModalOpen(true);
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setWarnOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      setDocuments((prev) => prev.filter((d) => d.id !== pendingDeleteId));
      setPendingDeleteId(null);
    }
    setWarnOpen(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-color-jet-black">Document Checklist Configuration</h2>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-color-main hover:bg-[#b5156a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus size={20} strokeWidth={2} />
            Add Document
          </button>
        </div>

        {/* Document List */}
        <div className="space-y-4 overflow-x-auto scrollbar-thin pb-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-4 border border-[#0000001A] rounded-[14px] p-4 min-w-125">
              {/* Info */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-base font-semibold text-color-jet-black whitespace-nowrap">{doc.name}</span>
                  <span className="text-xs text-color-jet-black font-medium border border-[#0000001A] rounded-lg px-2 py-0.5 whitespace-nowrap">{doc.category}</span>
                  {doc.required && (
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#FB2C36] text-white whitespace-nowrap">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#4A5565] font-normal line-clamp-2 md:line-clamp-none">{doc.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(doc)}
                  className="px-2.5 py-1.75 rounded-lg text-color-jet-black hover:text-gray-600 hover:bg-gray-100 transition-colors border border-[#0000001A] cursor-pointer"
                  title="Edit document"
                >
                  <SquarePen size={16} />
                </button>
                <button
                  onClick={() => requestDelete(doc.id)}
                  className="p-2.5 py1.75 rounded-lg text-[#E7000B] hover:text-red-600 hover:bg-red-50 transition-colors border border-[#0000001A] cursor-pointer"
                  title="Delete document">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">
              No document templates yet. Click "Add Document" to create one.
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AddDocumentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddDocument}
      />
      <EditDocumentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        document={selectedDoc}
        onSave={handleSaveEdit}
      />
      <WarningModal
        isOpen={warnOpen}
        onClose={() => { setWarnOpen(false); setPendingDeleteId(null); }}
        onConfirm={confirmDelete}
        title="Delete Document Template?"
        message="This will permanently remove the document template from the checklist. This action cannot be undone."
        confirmLabel="Delete Document"
      />
    </>
  );
};

export default DocumentsTab;
