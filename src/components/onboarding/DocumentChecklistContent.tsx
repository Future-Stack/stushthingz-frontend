import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRegCircle, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { 
  getLendersList, 
  getLenderDocuments, 
  validateDocuments,
  Lender, 
  LenderDocumentRequirement 
} from "@/utils/chatbotService";

export interface DocFile {
  name: string;
  url: string;
  rawFile: File;
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

const areDocTypesMatching = (uiType: string, apiType: string): boolean => {
  const ui = uiType.toLowerCase().replace(/_/g, "");
  const api = apiType.toLowerCase().replace(/_/g, "");
  
  if (ui === "payadvice" && api === "paystub") return true;
  if (ui === "paystub" && api === "payadvice") return true;
  if (ui === "proofaddress" && api === "proofofaddress") return true;
  if (ui === "proofofaddress" && api === "proofaddress") return true;
  if (ui === "idproof" && api === "identityproof") return true;
  
  return ui.includes(api) || api.includes(ui);
};

interface DocumentChecklistContentProps {
  onProgressUpdate?: (uploadedCount: number, totalCount: number) => void;
}

const DocumentChecklistContent: React.FC<DocumentChecklistContentProps> = ({ onProgressUpdate }) => {
  const navigate = useNavigate();
  
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [selectedLender, setSelectedLender] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<string>("employed");
  const [documents, setDocuments] = useState<LenderDocumentRequirement[]>([]);
  
  // Storing files per doc_type
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, DocFile[]>>({});
  
  // Storing inline errors per doc_type
  const [docErrors, setDocErrors] = useState<Record<string, string[]>>({});
  
  const [loadingLenders, setLoadingLenders] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState<LenderDocumentRequirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch Lenders
  useEffect(() => {
    const fetchLenders = async () => {
      setLoadingLenders(true);
      try {
        const response = await getLendersList();
        setLenders(response.lenders);
        
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

  // Fetch Documents when configuration changes
  useEffect(() => {
    if (!selectedLender) {
      setDocuments([]);
      if (onProgressUpdate) onProgressUpdate(0, 0);
      return;
    }

    const fetchDocuments = async () => {
      setLoadingDocs(true);
      setDocErrors({});
      try {
        const response = await getLenderDocuments(selectedLender, employmentType);
        setDocuments(response.documents);
        
        // Cleanup uploads
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

        const uploadedCount = Object.keys(filteredUploaded).filter(
          (key) => filteredUploaded[key].length > 0
        ).length;

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
    setUploadFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
    setUploadFiles([]);
    setUploading(false);
  };

  // Perform validation specifically for the current document type being uploaded
  const handleUploadSubmit = async () => {
    if (!selectedDoc || uploadFiles.length === 0) return;

    setUploading(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("lender_code", selectedLender);
      formDataPayload.append("employment_type", employmentType);
      formDataPayload.append("income_steady", "true");

      const docTypesList: string[] = [];
      const documentIdsList: string[] = [];

      // Package selected files for this single doc_type validation
      uploadFiles.forEach((file, index) => {
        formDataPayload.append("files", file);
        docTypesList.push(selectedDoc.doc_type);
        documentIdsList.push(`${selectedDoc.doc_type}_${index}`);
      });

      formDataPayload.append("doc_types", docTypesList.join(","));
      formDataPayload.append("document_ids", documentIdsList.join(","));

      const response = await validateDocuments(formDataPayload);

      // Extract results specifically for this doc_type using fuzzy matcher
      const docResult = response.results?.find((r) => 
        areDocTypesMatching(selectedDoc.doc_type, r.doc_type)
      );
      
      // Update inline errors state
      if (docResult && !docResult.valid) {
        setDocErrors((prev) => ({
          ...prev,
          [selectedDoc.doc_type]: docResult.issues || ["Validation failed."],
        }));
      } else {
        setDocErrors((prev) => {
          const next = { ...prev };
          delete next[selectedDoc.doc_type];
          return next;
        });
      }

      // Always save files so user can see them and modify
      const newDocFiles: DocFile[] = uploadFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        rawFile: file,
      }));

      const newUploadedFiles = {
        ...uploadedFiles,
        [selectedDoc.doc_type]: newDocFiles,
      };

      setUploadedFiles(newUploadedFiles);

      // Update progress
      const totalDocsCount = documents.length;
      const uploadedDocsCount = Object.keys(newUploadedFiles).filter(
        (key) => newUploadedFiles[key].length > 0
      ).length;

      if (onProgressUpdate) {
        onProgressUpdate(uploadedDocsCount, totalDocsCount);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Error occurred during document validation.");
    } finally {
      setUploading(false);
    }
  };

  const removeSingleFile = (docType: string, index: number) => {
    const currentFiles = uploadedFiles[docType] || [];
    const nextFiles = currentFiles.filter((_, idx) => idx !== index);

    const newUploadedFiles = {
      ...uploadedFiles,
      [docType]: nextFiles,
    };

    if (nextFiles.length === 0) {
      delete newUploadedFiles[docType];
      // Also clear errors if we remove all files
      setDocErrors((prev) => {
        const next = { ...prev };
        delete next[docType];
        return next;
      });
    }

    setUploadedFiles(newUploadedFiles);

    const totalDocsCount = documents.length;
    const uploadedDocsCount = Object.keys(newUploadedFiles).filter(
      (key) => newUploadedFiles[key].length > 0
    ).length;

    if (onProgressUpdate) {
      onProgressUpdate(uploadedDocsCount, totalDocsCount);
    }
  };

  const handleCompleteSetup = () => {
    // Check if there are any remaining validation issues across uploaded docs
    const hasErrors = Object.keys(docErrors).some((key) => docErrors[key].length > 0);
    if (hasErrors) {
      toast.error("Please resolve the document validation errors before completing setup.");
      return;
    }
    navigate("/investor/dashboard");
  };

  const allUploaded = documents.length > 0 && 
    documents.every((doc) => uploadedFiles[doc.doc_type] && uploadedFiles[doc.doc_type].length > 0);
  const hasValidationErrors = Object.keys(docErrors).some((key) => docErrors[key].length > 0);

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
                const docFiles = uploadedFiles[item.doc_type] || [];
                const isUploaded = docFiles.length > 0;
                const errors = docErrors[item.doc_type] || [];
                
                return (
                  <div
                    key={item.doc_type}
                    className={`p-4 sm:p-6 flex flex-col justify-between gap-4 ${
                      idx !== documents.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {isUploaded ? (
                            errors.length > 0 ? (
                              <AlertCircle className="text-red-500 w-5 h-5 shrink-0" />
                            ) : (
                              <FaCheckCircle className="text-color-main text-xl" />
                            )
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
                          
                          {/* Multiple Uploaded Files list */}
                          {isUploaded && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {docFiles.map((file, fileIdx) => (
                                <div 
                                  key={fileIdx} 
                                  className="flex items-center space-x-2 bg-pink-50 border border-pink-100 rounded-lg px-2.5 py-1 text-xs text-color-main font-medium"
                                >
                                  <FaCloudUploadAlt />
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSingleFile(item.doc_type, fileIdx)}
                                    className="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        <button
                          onClick={() => openModal(item)}
                          className="bg-color-main text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d01958] transition-colors cursor-pointer flex items-center space-x-2"
                        >
                          <FaCloudUploadAlt />
                          <span>Upload Files</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Document Validation Errors */}
                    {errors.length > 0 && (
                      <div className="ml-9 p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 animate-fadeIn">
                        <div className="flex items-center space-x-1.5 text-red-800 font-bold text-xs">
                          <AlertCircle className="w-4 h-4" />
                          <span>Validation Issue(s):</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-0.5 text-xs text-red-700">
                          {errors.map((errorMsg, errorIdx) => (
                            <li key={errorIdx}>{errorMsg}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Setup Completion Actions */}
      {selectedLender && documents.length > 0 && (
        <div className="bg-white border border-[#C4CDD5] rounded-[14px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
          <div>
            <h3 className="text-lg font-bold text-color-jet-black">Complete Your Onboarding</h3>
            <p className="text-sm text-gray-500 mt-1">
              {!allUploaded 
                ? "💡 To enable: Please upload at least one file for every required document category in the checklist."
                : hasValidationErrors 
                ? "⚠️ To enable: Please resolve the inline validation errors flagged above." 
                : "✅ All documents verified! You can now finish onboarding."}
            </p>
          </div>
          <button
            onClick={handleCompleteSetup}
            disabled={!allUploaded || hasValidationErrors}
            className="bg-color-main hover:bg-[#d01958] text-white px-8 py-3.5 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <span>Complete Setup & Finish</span>
          </button>
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
            <p className="text-gray-600 mb-2">Drag and drop your files here, or click to browse</p>
            <p className="text-xs text-gray-400 mb-4">You can select multiple files at once, or add them one by one</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setUploadFiles((prev) => [...prev, ...newFiles]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Browse Files
            </label>
            {uploadFiles.length > 0 && (
              <div className="mt-4 w-full text-left space-y-1">
                <p className="text-xs font-semibold text-gray-500">Selected files ({uploadFiles.length}):</p>
                <div className="max-h-[120px] overflow-y-auto space-y-1.5">
                  {uploadFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs text-green-600 font-medium">
                      <span className="truncate flex-1">• {f.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-gray-400 hover:text-red-500 cursor-pointer ml-2"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              disabled={uploading}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={uploadFiles.length === 0 || uploading}
              className="px-6 py-2 bg-[#e81c62] text-white font-medium rounded-lg hover:bg-[#d01958] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Upload & Validate</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentChecklistContent;
