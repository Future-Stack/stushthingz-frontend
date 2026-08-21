import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import { useGetProgressTrackerQuery } from "@/store/features/auth/auth.api";
import {
  getLendersList,
  getLenderDocuments,
  validateDocuments,
  getUserDocuments,
  deleteDocument,
  Lender,
  LenderDocumentRequirement,
  UserDocument,
} from "@/utils/chatbotService";
import { Eye, Trash2, Download, FileCheck, CheckCircle2 } from "lucide-react";
import { generateLendingPackagePDF, LendingPackageData } from "@/utils/lendingPackageGenerator";

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
  const user = useAppSelector(selectUser);
  const { data: progressTrackerData } = useGetProgressTrackerQuery();

  const [lenders, setLenders] = useState<Lender[]>([]);
  const [selectedLender, setSelectedLender] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<string>("employed");
  const [documents, setDocuments] = useState<LenderDocumentRequirement[]>([]);

  // Storing files per doc_type
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, DocFile[]>>({});

  // Storing inline errors per doc_type
  const [docErrors, setDocErrors] = useState<Record<string, string[]>>({});

  const [loadingDocs, setLoadingDocs] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState<LenderDocumentRequirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Storing server-saved user documents per doc_type
  const [serverUserDocs, setServerUserDocs] = useState<UserDocument[]>([]);

  // Fetch user uploaded documents helper
  const fetchUserDocuments = async () => {
    const userId = user?.id;
    if (!userId) return;
    try {
      const res = await getUserDocuments(userId);
      if (res && res.documents) {
        setServerUserDocs(res.documents);
      }
    } catch (err) {
      console.error("Failed to load user documents:", err);
    }
  };

  // Initial single-pass loading for lenders, user docs, and default lender requirements
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      setLoadingDocs(true);
      try {
        const [lendersRes, userDocsRes] = await Promise.all([
          getLendersList().catch(() => ({ lenders: [] })),
          user?.id ? getUserDocuments(user.id).catch(() => null) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        let currentLenders = lendersRes.lenders || [];
        setLenders(currentLenders);

        let userDocs = userDocsRes?.documents || [];
        setServerUserDocs(userDocs);

        const defaultLenderCode = currentLenders.length > 0 ? currentLenders[0].code : "";
        if (defaultLenderCode) {
          setSelectedLender(defaultLenderCode);
          const docsRes = await getLenderDocuments(defaultLenderCode, employmentType).catch(() => ({ documents: [] }));
          if (isMounted) {
            setDocuments(docsRes.documents || []);
            const uploadedCount = (docsRes.documents || []).filter((d) =>
              userDocs.some((sd) => areDocTypesMatching(d.doc_type, sd.doc_type))
            ).length;
            if (onProgressUpdate) {
              onProgressUpdate(uploadedCount, (docsRes.documents || []).length);
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize document component data:", err);
      } finally {
        if (isMounted) {
          setLoadingDocs(false);
          setInitialLoaded(true);
        }
      }
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Fetch Documents when lender or employmentType changes after initial load
  useEffect(() => {
    if (!initialLoaded) return;
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

        const uploadedCount = response.documents.filter((d) => {
          const hasServerDoc = serverUserDocs.some((sd) => areDocTypesMatching(d.doc_type, sd.doc_type));
          const hasLocalDoc = (uploadedFiles[d.doc_type] || []).length > 0;
          return hasServerDoc || hasLocalDoc;
        }).length;

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

  const handleDeleteUserDoc = async (docId: string) => {
    try {
      await deleteDocument(docId, user?.id);
      toast.success("Document deleted successfully");
      fetchUserDocuments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document");
    }
  };

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
      const user_id = user?.id || "guest";
      const formDataPayload = new FormData();
      formDataPayload.append("user_id", user_id);
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

      fetchUserDocuments();
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

  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);

  // Helper to determine accurate document validation status
  const getDocValidationStatus = (
    docType: string
  ): "validated" | "flagged" | "missing" | "pending" => {
    const matchingServerDocs = serverUserDocs.filter((sd) =>
      areDocTypesMatching(docType, sd.doc_type)
    );
    const localUploaded = (uploadedFiles[docType] || []).length > 0;
    const errors = docErrors[docType] || [];

    // Flagged if there are local validation errors or server-reported issues
    const hasErrors =
      errors.length > 0 ||
      matchingServerDocs.some(
        (sd) =>
          (sd.validation_result?.issues && sd.validation_result.issues.length > 0) ||
          ["failed", "rejected", "invalid", "flagged"].includes(
            (sd.validation_status || "").toLowerCase()
          )
      );

    if (hasErrors) return "flagged";

    // Validated if server document has verified/valid status in validation_status
    const hasValidatedServerDoc = matchingServerDocs.some((sd) =>
      ["valid", "approved", "passed", "verified", "validated"].includes(
        (sd.validation_status || "").toLowerCase()
      )
    );

    if (hasValidatedServerDoc || (localUploaded && errors.length === 0)) {
      return "validated";
    }

    // Pending if uploaded and undergoing review in validation_status
    const hasPendingServerDoc = matchingServerDocs.some((sd) =>
      ["pending", "review", "processing"].includes(
        (sd.validation_status || "").toLowerCase()
      )
    );

    if (hasPendingServerDoc) return "pending";

    // Missing if not uploaded at all
    if (!hasValidatedServerDoc && !localUploaded && matchingServerDocs.length === 0) {
      return "missing";
    }

    return "pending";
  };

  const totalDocsCount = documents.length;
  const validatedDocsCount = documents.filter(
    (d) => getDocValidationStatus(d.doc_type) === "validated"
  ).length;
  const isFullyValidated = totalDocsCount > 0 && validatedDocsCount >= totalDocsCount;

  // Extract financial readiness score from /auth/progress-tracker API
  const financialReadinessScore =
    progressTrackerData?.data?.financialReadiness?.percentage ??
    progressTrackerData?.data?.overallReadiness ??
    0;

  const handleGeneratePackage = async () => {
    if (!selectedLender && lenders.length > 0) {
      toast.warning("Please select a lender first to generate your lending package.");
      return;
    }

    setIsGeneratingPackage(true);
    try {
      const activeLender = lenders.find((l) => l.code === selectedLender);
      const packageData: LendingPackageData = {
        user: {
          name: user?.name || "Investor Applicant",
          email: user?.email || "",
          countryOfResidence: user?.countryOfResidence || "Jamaica / Diaspora",
          investmentBudget: user?.investmentBudget ? `$${user.investmentBudget}` : "Standard Investment",
          investmentGoal: user?.investmentGoal || "Real Estate Purchase",
          investmentTimeline: user?.investmentTimeline || "3-6 Months",
        },
        lender: activeLender ? { name: activeLender.name, id: activeLender.code } : null,
        readinessScore: financialReadinessScore,
        documents: documents.map((d) => {
          const status = getDocValidationStatus(d.doc_type);
          return {
            docType: d.doc_type,
            title: DOC_TYPE_META[d.doc_type]?.title || formatDocTitle(d.doc_type),
            status,
          };
        }),
      };

      await generateLendingPackagePDF(packageData);
      toast.success("Lending Package generated & downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate package:", err);
      toast.error("Failed to generate lending package PDF.");
    } finally {
      setIsGeneratingPackage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lending Package Banner */}
      <div
        className={`p-6 rounded-[14px] border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isFullyValidated
            ? "bg-gradient-to-r from-emerald-900 to-[#0D7A5F] text-white border-emerald-700"
            : "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700"
          }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${isFullyValidated
                ? "bg-white/10 text-white"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
          >
            <FileCheck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg">
                Lending Package Summary
              </h3>
              {isFullyValidated ? (
                <span className="flex items-center gap-1 bg-emerald-400/20 px-2.5 py-0.5 border border-emerald-400/30 rounded-full font-semibold text-emerald-200 text-xs">
                  <CheckCircle2 size={12} /> Full Package (100% Validated)
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-amber-400/20 px-2.5 py-0.5 border border-amber-400/30 rounded-full font-semibold text-amber-300 text-xs">
                  Partial Package ({validatedDocsCount}/{totalDocsCount} Validated)
                </span>
              )}
            </div>
            <p className="mt-1 max-w-xl text-slate-200 text-sm">
              {isFullyValidated
                ? "All required documents are validated! You can now generate your official full lending package PDF for loan underwriting."
                : "You can generate your interim Lending Package at any time with validated items to date, complete with an itemized cover summary for loan officer pre-approval discussions."}
            </p>
          </div>
        </div>

        <button
          onClick={handleGeneratePackage}
          disabled={isGeneratingPackage}
          className="flex items-center gap-2.5 bg-white hover:bg-emerald-50 disabled:opacity-75 shadow-md px-6 py-3 rounded-xl font-semibold text-[#0D7A5F] whitespace-nowrap active:scale-[0.98] transition-all cursor-pointer"
        >
          {isGeneratingPackage ? (
            <>
              <Loader2 size={18} className="text-[#0D7A5F] animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              {isFullyValidated ? "Download Full Package" : "Generate Lending Package"}
            </>
          )}
        </button>
      </div>

      {/* Selection Row */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 bg-white shadow-sm p-6 border border-[#C4CDD5] rounded-[14px]">
        <div>
          <label className="block mb-2 font-semibold text-color-jet-black text-sm">
            Select Lender
          </label>
          <select
            value={selectedLender}
            onChange={(e) => setSelectedLender(e.target.value)}
            className="bg-[#F3F3F5] px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full font-medium text-gray-800"
          >
            <option value="">-- Choose Lender --</option>
            {lenders.map((lender) => (
              <option key={lender.code} value={lender.code}>
                {lender.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-color-jet-black text-sm">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="bg-[#F3F3F5] px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full font-medium text-gray-800"
          >
            <option value="employed">Employed</option>
            <option value="self_employed">Self Employed</option>
          </select>
        </div>
      </div>

      {/* Checklist Card */}
      {loadingDocs ? (
        <div className="flex flex-col justify-center items-center bg-white p-12 border border-[#C4CDD5] rounded-[14px] text-center">
          <Loader2 className="mb-4 w-10 h-10 text-color-main animate-spin" />
          <p className="text-gray-500">Retrieving required documents list...</p>
        </div>
      ) : !selectedLender ? (
        <div className="bg-white p-12 border border-[#C4CDD5] rounded-[14px] text-gray-500 text-center">
          Please select a lender to view your required document checklist.
        </div>
      ) : (
        <div className="bg-white shadow-sm p-4 md:p-6 border border-[#C4CDD5] rounded-[14px]">
          <h2 className="mb-4 font-bold text-color-jet-black text-2xl">
            {lenders.find((l) => l.code === selectedLender)?.name || "Lender"} Documents
          </h2>

          {documents.length === 0 ? (
            <p className="py-6 text-gray-500 text-center">No documents required for this configuration.</p>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {documents.map((item, idx) => {
                const localDocFiles = uploadedFiles[item.doc_type] || [];
                const matchingServerDocs = serverUserDocs.filter((sd) =>
                  areDocTypesMatching(item.doc_type, sd.doc_type)
                );
                const isUploaded = localDocFiles.length > 0 || matchingServerDocs.length > 0;
                const errors = docErrors[item.doc_type] || [];

                return (
                  <div
                    key={item.doc_type}
                    className={`p-4 sm:p-6 flex flex-col justify-between gap-4 ${idx !== documents.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                  >
                    <div className="flex sm:flex-row flex-col justify-between sm:items-start gap-4 w-full">
                      <div className="flex flex-1 items-start space-x-4">
                        <div className="mt-1">
                          {isUploaded ? (
                            errors.length > 0 ? (
                              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            ) : (
                              <FaCheckCircle className="text-color-main text-xl" />
                            )
                          ) : (
                            <FaRegCircle className="text-gray-300 text-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-color-jet-black text-lg">
                              {formatDocTitle(item.doc_type)}
                            </h3>
                          </div>
                          <p className="mt-0.5 font-normal text-[#4A5565] text-sm">
                            {formatDocDesc(item)}
                          </p>

                          {/* Server-saved Documents display with actions & notes */}
                          {matchingServerDocs.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {matchingServerDocs.map((sDoc) => {
                                const rawStatus = (sDoc.status || "pending").toLowerCase();
                                let badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                                if (["valid", "approved", "passed", "verified", "validated"].includes(rawStatus)) {
                                  badgeColor = "bg-green-100 text-green-700 border-green-200";
                                } else if (["failed", "rejected", "invalid", "flagged"].includes(rawStatus)) {
                                  badgeColor = "bg-red-100 text-red-700 border-red-200";
                                } else if (["pending", "review", "processing"].includes(rawStatus)) {
                                  badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
                                }

                                const statusLabel = rawStatus.replace(/_/g, " ");

                                return (
                                  <div
                                    key={sDoc.id}
                                    className="flex flex-col gap-2 bg-gray-50 p-3 border border-gray-200 rounded-lg text-xs"
                                  >
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <FaCloudUploadAlt className="text-color-main shrink-0" />
                                        <span className="max-w-[200px] font-medium text-gray-800 truncate" title={sDoc.name}>
                                          {sDoc.name}
                                        </span>
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${badgeColor}`}
                                        >
                                          {statusLabel}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {sDoc.url && (
                                          <a
                                            href={sDoc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded font-medium text-blue-600 transition-colors"
                                          >
                                            <Eye size={13} /> View
                                          </a>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteUserDoc(sDoc.id)}
                                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded font-medium text-red-600 transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={13} /> Delete
                                        </button>
                                      </div>
                                    </div>

                                    {/* Display Validation Issues if present */}
                                    {(sDoc.validation_result?.issues ?? []).length > 0 && (
                                      <div className="bg-red-50 mt-1.5 p-2.5 border border-red-200 rounded-md">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <AlertCircle size={13} className="text-red-500 shrink-0" />
                                          <span className="font-bold text-[11px] text-red-700 uppercase tracking-wide">Validation Issue(s):</span>
                                        </div>
                                        <ul className="space-y-1 pl-4 list-disc">
                                          {(sDoc.validation_result?.issues ?? []).map((issue, issueIdx) => (
                                            <li key={issueIdx} className="text-[11px] text-red-700 leading-relaxed">
                                              {issue}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Display Note if present */}
                                    {sDoc.note && (
                                      <div className="flex items-start gap-1.5 bg-amber-50/80 mt-1 p-2.5 border border-amber-200/80 rounded-md text-amber-900 text-xs">
                                        <AlertCircle size={14} className="mt-0.5 text-amber-600 shrink-0" />
                                        <div>
                                          <span className="font-semibold text-amber-950">Note: </span>
                                          <span>{sDoc.note}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Local Session Uploaded Files list */}
                          {localDocFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {localDocFiles.map((file, fileIdx) => (
                                <div
                                  key={fileIdx}
                                  className="flex items-center space-x-2 bg-pink-50 px-2.5 py-1 border border-pink-100 rounded-lg font-medium text-color-main text-xs"
                                >
                                  <FaCloudUploadAlt />
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSingleFile(item.doc_type, fileIdx)}
                                    className="ml-1 text-gray-400 hover:text-red-500 cursor-pointer"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center self-start sm:self-center space-x-2">
                        <button
                          onClick={() => openModal(item)}
                          className="flex items-center space-x-2 bg-color-main hover:bg-[#d01958] px-4 py-2 rounded-md font-medium text-white text-sm transition-colors cursor-pointer"
                        >
                          <FaCloudUploadAlt />
                          <span>Upload Files</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Document Validation Errors */}
                    {errors.length > 0 && (
                      <div className="space-y-1.5 bg-red-50 ml-9 p-3 border border-red-200 rounded-xl animate-fadeIn">
                        <div className="flex items-center space-x-1.5 font-bold text-red-800 text-xs">
                          <AlertCircle className="w-4 h-4" />
                          <span>Validation Issue(s):</span>
                        </div>
                        <ul className="space-y-0.5 pl-5 text-red-700 text-xs list-disc">
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
      {/* {selectedLender && documents.length > 0 && (
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 bg-white shadow-sm mt-8 p-6 border border-[#C4CDD5] rounded-[14px]">
          <div>
            <h3 className="font-bold text-color-jet-black text-lg">Complete Your Onboarding</h3>
            <p className="mt-1 text-gray-500 text-sm">
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
            className="flex justify-center items-center space-x-2 bg-color-main hover:bg-[#d01958] disabled:opacity-50 shadow-md px-8 py-3.5 rounded-lg font-bold text-white transition-all cursor-pointer"
          >
            <span>Complete Setup & Finish</span>
          </button>
        </div>
      )} */}

      {/* Requirements Banner */}
      <div className="bg-[#EFF6FF] p-6 border border-[#BEDBFF] rounded-2xl">
        <h3 className="mb-2 font-semibold text-[#1C398E] text-lg">Document Requirements</h3>
        <ul className="space-y-1 pl-5 font-normal text-[#193CB8] text-sm list-disc">
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
          <p className="text-gray-500 text-sm">
            {selectedDoc ? formatDocDesc(selectedDoc) : ""}
          </p>
          <div className="flex flex-col justify-center items-center p-8 border-2 border-gray-300 border-dashed rounded-xl text-center">
            <FaCloudUploadAlt className="mb-4 text-gray-400 text-4xl" />
            <p className="mb-2 text-gray-600">Drag and drop your files here, or click to browse</p>
            <p className="mb-4 text-gray-400 text-xs">You can select multiple files at once, or add them one by one</p>
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
              className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium text-gray-700 transition-colors cursor-pointer"
            >
              Browse Files
            </label>
            {uploadFiles.length > 0 && (
              <div className="space-y-1 mt-4 w-full text-left">
                <p className="font-semibold text-gray-500 text-xs">Selected files ({uploadFiles.length}):</p>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                  {uploadFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-2 border border-gray-100 rounded-lg font-medium text-green-600 text-xs">
                      <span className="flex-1 truncate">• {f.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
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
              className="hover:bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={uploadFiles.length === 0 || uploading}
              className="flex items-center space-x-2 bg-[#e81c62] hover:bg-[#d01958] disabled:opacity-50 px-6 py-2 rounded-lg font-medium text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
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
