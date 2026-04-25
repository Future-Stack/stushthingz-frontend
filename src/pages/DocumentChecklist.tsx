import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRegCircle, FaEye, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";

interface DocItem {
  id: string;
  title: string;
  desc: string;
  file?: { name: string; url: string };
}

interface DocCategory {
  id: string;
  title: string;
  items: DocItem[];
}

const INITIAL_DOCS: DocCategory[] = [
  {
    id: "identity",
    title: "Identity Documents",
    items: [
      { id: "passport", title: "Valid Passport", desc: "Government-issued passport with at least 6 months validity" },
      { id: "address", title: "Proof of Address", desc: "Utility bill or bank statement from the last 3 months" },
      { id: "national_id", title: "National ID", desc: "Driver's license or national identity card" },
    ],
  },
  {
    id: "financial",
    title: "Financial Documents",
    items: [
      { id: "bank_stmt", title: "Bank Statements", desc: "Last 12 months of bank statements showing sufficient funds" },
      { id: "proof_income", title: "Proof of Income", desc: "Recent pay stubs or employment contract" },
      { id: "tax_returns", title: "Tax Returns", desc: "Last 3 years of tax returns from home country" },
      { id: "credit_report", title: "Credit Report", desc: "Recent credit report from home country" },
      { id: "source_funds", title: "Source of Funds Letter", desc: "Bank letter verifying source of investment funds" },
    ],
  },
  {
    id: "property",
    title: "Property-related Documents",
    items: [
      { id: "valuation", title: "Property Valuation", desc: "Professional appraisal of the property" },
      { id: "title_search", title: "Title Search Report", desc: "Attorney's title search and verification" },
      { id: "survey", title: "Survey Plan", desc: "Current survey of the property boundaries" },
      { id: "insurance", title: "Property Insurance Quote", desc: "Insurance quotation for the property" },
    ],
  },
];

const DocumentChecklist = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<DocCategory[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const totalDocs = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const uploadedDocs = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.file).length,
    0
  );

  const openModal = (item: DocItem) => {
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

    // Simulate upload and update state
    const newCategories = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) =>
        item.id === selectedDoc.id
          ? {
            ...item,
            file: {
              name: uploadFile.name,
              url: URL.createObjectURL(uploadFile), // mock url for preview
            },
          }
          : item
      ),
    }));

    setCategories(newCategories);
    closeModal();
  };

  const removeFile = (docId: string) => {
    const newCategories = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) =>
        item.id === docId ? { ...item, file: undefined } : item
      ),
    }));
    setCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto mb- px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl text-color-jet-black font-bold mb-1">Document Checklist</h1>
              <p className="text-base font-normal text-[#4A5565] mt-1">
                {uploadedDocs} of {totalDocs} documents uploaded
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="bg-color-main hover:bg-color-main/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer shadow-md"
            >
              Complete Setup
            </motion.button>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-color-main transition-all duration-500"
              style={{ width: `${(uploadedDocs / totalDocs) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="text-2xl text-color-jet-black font-bold mb-4">{category.title}</h2>
            <div className="bg-white rounded-2xl border border-[#C4CDD5] overflow-hidden">
              {category.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${idx !== category.items.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {item.file ? (
                        <FaCheckCircle className="text-color-main text-xl" />
                      ) : (
                        <FaRegCircle className="text-gray-300 text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg text-color-jet-black font-semibold mb-0.5">{item.title}</h3>
                      <p className="text-sm text-[#4A5565] font-normal">{item.desc}</p>

                      {/* Uploaded File Info */}
                      {item.file && (
                        <div className="flex items-center space-x-2 mt-2 text-sm text-color-main">
                          <FaCloudUploadAlt />
                          <span>{item.file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    {item.file ? (
                      <>
                        <button
                          onClick={() => window.open(item.file?.url, "_blank")}
                          className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                          title="View Document"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => removeFile(item.id)}
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
              ))}
            </div>
          </div>
        ))}

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
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Upload ${selectedDoc?.title}`}
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">{selectedDoc?.desc}</p>

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

export default DocumentChecklist;
