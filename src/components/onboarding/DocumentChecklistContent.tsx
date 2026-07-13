import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle, FaEye, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { 
  getLendersList, 
  getLenderDocuments, 
  Lender, 
  LenderDocumentRequirement 
} from "@/utils/chatbotService";

export interface DocFile {
  name: string;
  url: string;
}

const DOC_TYPE_META: Record<string, { title: string; desc: string }> = {
  income_letter: {
    title: "Income Letter / Employment Letter",
    desc: "A letter from your employer confirming job title, salary, and status.",
  },
  pay_advice: {
    title: "Pay Slips / Pay Advices",
    desc: "Recent pay slips showing income details and tax deductions.",
  },
  id_proof: {
    title: "Proof of Identity",
    desc: "Valid passport, national ID card, or driver's license.",
  },
  trn: {
    title: "Taxpayer Registration Number (TRN)",
    desc: "Your official Jamaican Taxpayer Registration Number card or official document.",
  },
  government_id: {
    title: "Government-Issued ID",
    desc: "Valid photo identification issued by a government authority.",
  },
  bank_statement: {
    title: "Bank Statements",
    desc: "Recent bank statements showing salary deposits and account activity.",
  },
  credit_report: {
    title: "Credit Report",
    desc: "Official credit report showing your credit history and score.",
  },
  proof_address: {
    title: "Proof of Address",
    desc: "Utility bill or bank statement showing your name and current address.",
  },
};

const formatDocTitle = (docType: string) => {
  if (DOC_TYPE_META[docType]) return DOC_TYPE_META[docType].title;
  return docType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDocDesc = (req: LenderDocumentRequirement) => {
  let baseDesc = DOC_TYPE_META[req.doc_type]?.desc || "Required document for verification.";
  
  const rules: string[] = [];
  if (req.months_required) {
    rules.push(`${req.months_required} months required`);
  }
  if (req.count_required) {
    rules.push(`${req.count_required} copies required`);
  }
  if (req.accepted_any_of && req.accepted_any_of.length > 0) {
    const acceptedStr = req.accepted_any_of
      .map((item) => item.replace("_", " ").toUpperCase())
      .join(", ");
    rules.push(`Accepted: ${acceptedStr}`);
  }
  if (req.min_age) {
    rules.push(`Min age: ${req.min_age}`);
  }

  if (rules.length > 0) {
    baseDesc += ` (${rules.join(" | ")})`;
  }
  return baseDesc;
};

interface DocumentChecklistContentProps {
  onProgressUpdate?: (uploadedCount: number, totalCount: number) => void;
}

const DocumentChecklistContent: React.FC<DocumentChecklistContentProps> = ({ onProgressUpdate }) => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [selectedLender, setSelectedLender] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<string>("employed");
  const [documents, setDocuments] = useState<LenderDocumentRequirement[]>([]);
  
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, DocFile>>({});
  
  const [loadingLenders, setLoadingLenders] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LenderDocumentRequirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Fetch Lenders
  useEffect(() => {
    const fetchLenders = async () => {
      setLoadingLenders(true);
      try {
        const response = await getLendersList();
        setLenders(response.lenders);
        
        // Auto-select first lender if available
        if (response.lenders.length > 0) {
          setSelectedLender(response.lenders[0].code);
        }
      } catch (error) {
        console.error("Failed to load lenders:", error);
      } finally {
        setLoadingLenders(false);
      }
    };
    fetchLenders();
  }, []);

  // Fetch Documents when lender or employment type changes
  useEffect(() => {
    if (!selectedLender) {
      setDocuments([]);
      if (onProgressUpdate) onProgressUpdate(0, 0);
      return;
    }

    const fetchDocuments = async () => {
      setLoadingDocs(true);
      try {
        const response = await getLenderDocuments(selectedLender, employmentType);
        setDocuments(response.documents);
        
        // Filter out uploaded files that are no longer required
        const currentDocTypes = response.documents.map((d) => d.doc_type);
        const filteredUploaded = { ...uploadedFiles };
        let hasChanges = false;
        
        Object.keys(filteredUploaded).forEach((key) => {
          if (!currentDocTypes.includes(key)) {
            delete filteredUploaded[key];
            hasChanges = true;
          }
        });

        if (hasChanges) {
          setUploadedFiles(filteredUploaded);
        }

        const uploadedCount = Object.keys(filteredUploaded).length;
        if (onProgressUpdate) {
          onProgressUpdate(uploadedCount, response.documents.length);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocuments();
  }, [selectedLender, employmentType]);

  const openModal = (item: LenderDocumentRequirement) => {
    setSelectedDoc(item);
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
    setUploadFile(null);
  };

  const handleUploadSubmit = () => {
    if (!selectedDoc || !uploadFile) return;

    const newUploadedFiles = {
      ...uploadedFiles,
      [selectedDoc.doc_type]: {
        name: uploadFile.name,
        url: URL.createObjectURL(uploadFile),
      },
    };

    setUploadedFiles(newUploadedFiles);

    if (onProgressUpdate) {
      onProgressUpdate(Object.keys(newUploadedFiles).length, documents.length);
    }

    closeModal();
  };

  const removeFile = (docType: string) => {
    const newUploadedFiles = { ...uploadedFiles };
    delete newUploadedFiles[docType];
    setUploadedFiles(newUploadedFiles);

    if (onProgressUpdate) {
      onProgressUpdate(Object.keys(newUploadedFiles).length, documents.length);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#C4CDD5] rounded-[14px] p-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-color-jet-black mb-2">
            Select Lender
          </label>
          {loadingLenders ? (
            <div className="flex items-center space-x-2 text-gray-500 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading lenders...</span>
            </div>
          ) : (
            <select
              value={selectedLender}
              onChange={(e) => setSelectedLender(e.target.value)}
              className="w-full bg-[#F3F3F5] border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800 font-medium"
            >
              <option value="">-- Choose Lender --</option>
              {lenders.map((lender) => (
                <option key={lender.code} value={lender.code}>
                  {lender.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-color-jet-black mb-2">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full bg-[#F3F3F5] border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800 font-medium"
          >
            <option value="employed">Employed</option>
            <option value="self_employed">Self Employed</option>
          </select>
        </div>
      </div>

      {/* Checklist Card */}
      {loadingDocs ? (
        <div className="bg-white border border-[#C4CDD5] rounded-[14px] p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 animate-spin text-color-main mb-4" />
          <p className="text-gray-500">Retrieving required documents list...</p>
        </div>
      ) : !selectedLender ? (
        <div className="bg-white border border-[#C4CDD5] rounded-[14px] p-12 text-center text-gray-500">
          Please select a lender to view your required document checklist.
        </div>
      ) : (
        <div className="bg-white border border-[#C4CDD5] rounded-[14px] p-4 md:p-6 shadow-sm">
          <h2 className="text-2xl text-color-jet-black font-bold mb-4">
            {lenders.find((l) => l.code === selectedLender)?.name || "Lender"} Documents
          </h2>
          
          {documents.length === 0 ? (
            <p className="text-gray-500 py-6 text-center">No documents required for this configuration.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {documents.map((item, idx) => {
                const isUploaded = !!uploadedFiles[item.doc_type];
                return (
                  <div
                    key={item.doc_type}
                    className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      idx !== documents.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {isUploaded ? (
                          <FaCheckCircle className="text-color-main text-xl" />
                        ) : (
                          <FaRegCircle className="text-gray-300 text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg text-color-jet-black font-semibold mb-0.5">
                          {formatDocTitle(item.doc_type)}
                        </h3>
                        <p className="text-sm text-[#4A5565] font-normal">
                          {formatDocDesc(item)}
                        </p>
                        {isUploaded && (
                          <div className="flex items-center space-x-2 mt-2 text-sm text-color-main font-medium">
                            <FaCloudUploadAlt />
                            <span>{uploadedFiles[item.doc_type].name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      {isUploaded ? (
                        <>
                          <button
                            onClick={() => window.open(uploadedFiles[item.doc_type].url, "_blank")}
                            className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                            title="View Document"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => removeFile(item.doc_type)}
                            className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Document"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openModal(item)}
                          className="bg-color-main text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d01958] transition-colors cursor-pointer flex items-center space-x-2"
                        >
                          <FaCloudUploadAlt />
                          <span>Upload</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Requirements Banner */}
      <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#1C398E] mb-2">Document Requirements</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm font-normal text-[#193CB8]">
          <li>All documents must be clear and legible</li>
          <li>Accepted formats: PDF, JPG, PNG</li>
          <li>Maximum file size: 10MB per document</li>
          <li>Documents in languages other than English must be translated</li>
          <li>Bank statements and financial documents must show account holder name</li>
        </ul>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Upload ${selectedDoc ? formatDocTitle(selectedDoc.doc_type) : ""}`}
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            {selectedDoc ? formatDocDesc(selectedDoc) : ""}
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <FaCloudUploadAlt className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadFile(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Browse Files
            </label>
            {uploadFile && (
              <p className="mt-4 text-sm text-green-600 font-medium break-all">
                Selected: {uploadFile.name}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={!uploadFile}
              className="px-4 py-2 bg-[#e81c62] text-white font-medium rounded-lg hover:bg-[#d01958] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Upload Document
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentChecklistContent;
