import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

interface Step4Props {
  formData: any;
  handleDynamicChange: (field: string, index: number, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent, field: string) => void;
  addField: (field: string) => void;
  removeField: (field: string, index: number) => void;
  handleLocalContextChange: (index: number, field: "title" | "description", value: string) => void;
  addLocalContext: () => void;
  removeLocalContext: (index: number) => void;
}

const Step4LegalContext: React.FC<Step4Props> = ({
  formData,
  handleDynamicChange,
  handleKeyDown,
  addField,
  removeField,
  handleLocalContextChange,
  addLocalContext,
  removeLocalContext,
}) => {
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300 pb-10">
      <div>
        <h3 className="text-lg font-bold text-color-main mb-8">Legal & Context</h3>
        <div className="space-y-10">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Legal Considerations</label>
            {formData.legalConsiderations.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("legalConsiderations", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "legalConsiderations")}
                  placeholder="e.g., Zoning requirements for residential construction"
                  className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
                />
                <button
                  onClick={() => removeField("legalConsiderations", i)}
                  className="p-3.5 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-200 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                {i === formData.legalConsiderations.length - 1 && (
                  <button
                    onClick={() => addField("legalConsiderations")}
                    className="p-3.5 bg-white text-gray-400 hover:text-color-main rounded-xl border border-gray-200 shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-gray-900">Local Context Section</h4>
              <button
                onClick={addLocalContext}
                className="bg-color-main/10 text-color-main px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-color-main hover:text-white transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Context</span>
              </button>
            </div>

            {formData.localContexts.map((context: any, i: number) => (
              <div key={i} className="bg-gray-50/80 p-8 rounded-3xl border border-gray-100 relative group">
                <button
                  onClick={() => removeLocalContext(i)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-6 bg-color-main rounded-full" />
                  <h4 className="text-base font-bold text-gray-900">Context {i + 1}</h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Title</label>
                    <input
                      type="text"
                      value={context.title}
                      onChange={(e) => handleLocalContextChange(i, "title", e.target.value)}
                      placeholder="e.g., Market Trends"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all bg-white font-semibold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                    <textarea
                      rows={6}
                      value={context.description}
                      onChange={(e) => handleLocalContextChange(i, "description", e.target.value)}
                      placeholder="Portland Parish has seen significant growth in eco-tourism..."
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none bg-white leading-relaxed text-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4LegalContext;
