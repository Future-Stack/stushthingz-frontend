import React, { useState, useRef, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check, Upload } from "lucide-react";
import Step1BasicInfo from "./property-steps/Step1BasicInfo";
import Step2Features from "./property-steps/Step2Features";
import Step3Financial from "./property-steps/Step3Financial";
import Step4LegalContext from "./property-steps/Step4LegalContext";
import { Property } from "../../../../types/property";
import { useCreatePropertyMutation, useUpdatePropertyMutation } from "../../../../store/api/propertyApi";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Property | null;
}

const STEPS = [
  "Basic Information",
  "Features & Amenities",
  "Financial Details",
  "Legal & Context",
];

const INITIAL_FORM_STATE = {
  title: "",
  location: "",
  type: "",
  size: "",
  description: "",
  highlights: [""],
  considerations: [""],
  features: [""],
  priceRangeUpper: "",
  priceRangeLower: "",
  closingCosts: "",
  priceDetails: "",
  closingCostsBreakdown: "",
  ongoingCosts: [""],
  investmentStructure: "",
  projectedReturns: "",
  taxIncentives: "",
  currentAvailability: "",
  closingPeriod: "",
  developmentStatus: "",
  legalConsiderations: [""],
  localContexts: [
    { title: "Market Trends", description: "" },
    { title: "Community Info", description: "" },
    { title: "Infrastructure", description: "" },
  ],
  images: [] as File[],
};

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || "",
          location: initialData.location || "",
          type: initialData.type || "",
          size: initialData.sizeArea?.toString() || "",
          description: initialData.description || "",
          highlights: initialData.keyHighlights?.map(h => h.content) || [""],
          considerations: initialData.diasporaInvestorConsiderations?.map(c => c.content) || [""],
          features: initialData.propertyFeatures?.map(f => f.content) || [""],
          priceRangeUpper: initialData.priceRangeUpper || "",
          priceRangeLower: initialData.priceRangeLower || "",
          closingCosts: initialData.estimatedClosingCost || "",
          priceDetails: initialData.priceDetails || "",
          closingCostsBreakdown: initialData.closingCostBreakdown || "",
          ongoingCosts: initialData.ongoingCost?.map(c => c.content) || [""],
          investmentStructure: initialData.investmentStructure || "",
          projectedReturns: initialData.projectedReturns || "",
          taxIncentives: initialData.taxIncentives || "",
          currentAvailability: initialData.currenyAvailability || "",
          closingPeriod: initialData.typicalClosingPeriod || "",
          developmentStatus: initialData.developmentStatus || "",
          legalConsiderations: initialData.legalConsiderations?.map(l => l.content) || [""],
          localContexts: initialData.localContext?.length ? initialData.localContext.map(lc => ({ title: lc.title, description: lc.description })) : INITIAL_FORM_STATE.localContexts,
          images: [],
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setCurrentStep(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDynamicChange = (field: string, index: number, value: string) => {
    const list = [...(formData[field as keyof typeof formData] as string[])];
    list[index] = value;
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const addField = (field: string) => {
    const list = formData[field as keyof typeof formData] as string[];
    if (list[list.length - 1].trim() === "") return;
    setFormData((prev) => ({ ...prev, [field]: [...list, ""] }));
  };

  const removeField = (field: string, index: number) => {
    const list = formData[field as keyof typeof formData] as string[];
    if (list.length <= 1) {
      setFormData((prev) => ({ ...prev, [field]: [""] }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: list.filter((_, i) => i !== index) }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addField(field);
    }
  };

  const handleLocalContextChange = (index: number, field: "title" | "description", value: string) => {
    const list = [...formData.localContexts];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev) => ({ ...prev, localContexts: list }));
  };

  const addLocalContext = () => {
    setFormData((prev) => ({
      ...prev,
      localContexts: [...prev.localContexts, { title: "", description: "" }],
    }));
  };

  const removeLocalContext = (index: number) => {
    if (formData.localContexts.length <= 1) {
      setFormData((prev) => ({ ...prev, localContexts: [{ title: "", description: "" }] }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      localContexts: prev.localContexts.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("type", formData.type);
    data.append("sizeArea", formData.size);
    data.append("description", formData.description);
    data.append("priceRangeUpper", formData.priceRangeUpper);
    data.append("priceRangeLower", formData.priceRangeLower);
    data.append("estimatedClosingCost", formData.closingCosts);
    data.append("priceDetails", formData.priceDetails);
    data.append("closingCostBreakdown", formData.closingCostsBreakdown);
    data.append("investmentStructure", formData.investmentStructure);
    data.append("projectedReturns", formData.projectedReturns);
    data.append("taxIncentives", formData.taxIncentives);
    data.append("currenyAvailability", formData.currentAvailability);
    data.append("typicalClosingPeriod", formData.closingPeriod);
    data.append("developmentStatus", formData.developmentStatus);

    data.append("keyHighlights", JSON.stringify(formData.highlights.filter(h => h).map(h => ({ content: h }))));
    data.append("diasporaInvestorConsiderations", JSON.stringify(formData.considerations.filter(c => c).map(c => ({ content: c }))));
    data.append("propertyFeatures", JSON.stringify(formData.features.filter(f => f).map(f => ({ content: f }))));
    data.append("ongoingCost", JSON.stringify(formData.ongoingCosts.filter(o => o).map(o => ({ content: o }))));
    data.append("legalConsiderations", JSON.stringify(formData.legalConsiderations.filter(l => l).map(l => ({ content: l }))));
    data.append("localContext", JSON.stringify(formData.localContexts.filter(lc => lc.title || lc.description)));

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    try {
      if (initialData) {
        await updateProperty({ id: initialData.id, data }).unwrap();
      } else {
        await createProperty(data).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Failed to submit property", err);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative bg-white rounded-4xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? "Edit Property" : "Add New Property"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {initialData 
                  ? `Update information for "${initialData.title}"`
                  : "Create a new investment opportunity for the platform. Complete all sections to publish."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-10 px-4 relative">
            <div className="absolute top-1/2 left-10 right-10 h-0.75 bg-gray-100 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-10 h-0.75 bg-[#22C55E] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / 3) * 85}%` }}
            />

            {STEPS.map((_, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum < currentStep;
              const isActive = stepNum === currentStep;

              return (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#22C55E] text-white shadow-lg shadow-green-100"
                        : isActive
                        ? "bg-color-main text-white ring-[6px] ring-pink-50 shadow-lg shadow-pink-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              handleChange={handleChange}
              handleDynamicChange={handleDynamicChange}
              handleKeyDown={handleKeyDown}
              addField={addField}
              removeField={removeField}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              fileInputRef={fileInputRef}
            />
          )}

          {currentStep === 2 && (
            <Step2Features
              formData={formData}
              handleDynamicChange={handleDynamicChange}
              handleKeyDown={handleKeyDown}
              addField={addField}
              removeField={removeField}
            />
          )}

          {currentStep === 3 && (
            <Step3Financial
              formData={formData}
              handleChange={handleChange}
              handleDynamicChange={handleDynamicChange}
              handleKeyDown={handleKeyDown}
              addField={addField}
              removeField={removeField}
            />
          )}

          {currentStep === 4 && (
            <Step4LegalContext
              formData={formData}
              handleDynamicChange={handleDynamicChange}
              handleKeyDown={handleKeyDown}
              addField={addField}
              removeField={removeField}
              handleLocalContextChange={handleLocalContextChange}
              addLocalContext={addLocalContext}
              removeLocalContext={removeLocalContext}
            />
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-4 sticky bottom-0 z-10">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>
          )}

          <button
            onClick={currentStep === 4 ? handleSubmit : nextStep}
            className={`py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              currentStep === 1
                ? "flex-1 bg-color-main hover:bg-[#b5156a] text-white shadow-pink-100"
                : "flex-2 bg-color-main hover:bg-[#b5156a] text-white shadow-pink-100"
            }`}
          >
            {currentStep === 4 ? (
              <>
                <Upload size={20} />
                <span>{initialData ? "Save Changes" : "Publish Property"}</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#0000001A] text-color-jet-black rounded-lg font-bold hover:text-gray-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;

