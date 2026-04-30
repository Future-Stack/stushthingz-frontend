import React from "react";
import { Plus, Minus } from "lucide-react";

interface Step2Props {
  formData: any;
  handleDynamicChange: (field: string, index: number, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent, field: string) => void;
  addField: (field: string) => void;
  removeField: (field: string, index: number) => void;
}

const Step2Features: React.FC<Step2Props> = ({
  formData,
  handleDynamicChange,
  handleKeyDown,
  addField,
  removeField,
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-color-main mb-4">Features & Amenities</h3>
      <div>
        <label className="block text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Add Features</label>
        {formData.features.map((val: string, i: number) => (
          <div key={i} className="flex gap-2 mb-3 last:mb-0">
            <input
              type="text"
              value={val}
              onChange={(e) => handleDynamicChange("features", i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "features")}
              placeholder="e.g., Gated community with 24/7 security"
              className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
            />
            <button
              onClick={() => removeField("features", i)}
              className="p-3.5 bg-white text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
            >
              <Minus size={20} />
            </button>
            {i === formData.features.length - 1 && (
              <button
                onClick={() => addField("features")}
                className="p-3.5 bg-white text-gray-400 hover:text-color-main hover:border-color-main rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        ))}
        <p className="text-[13px] text-gray-400 mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          Press Enter or click + to add each feature
        </p>
      </div>
    </div>
  );
};

export default Step2Features;
