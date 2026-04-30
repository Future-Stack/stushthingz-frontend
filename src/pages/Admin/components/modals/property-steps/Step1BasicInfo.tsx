import React from "react";
import { Plus, Minus, Upload, ChevronRight, X } from "lucide-react";

interface Step1Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDynamicChange: (field: string, index: number, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent, field: string) => void;
  addField: (field: string) => void;
  removeField: (field: string, index: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  handleChange,
  handleDynamicChange,
  handleKeyDown,
  addField,
  removeField,
  handleImageUpload,
  removeImage,
  fileInputRef,
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-bold text-color-main mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Blue Mountain Eco-Village"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Portland Parish, Jamaica"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Property Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">Select type</option>
                  <option value="Land/Lots">Land/Lots</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Size/Area</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g., 0.25 - 0.5 acres per lot"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter detailed property description"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Key Highlights</label>
            {formData.highlights.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3 last:mb-0">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("highlights", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "highlights")}
                  placeholder="e.g., Solar panel infrastructure pre-installed"
                  className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
                />
                <button
                  onClick={() => removeField("highlights", i)}
                  className="p-3.5 bg-white text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                {i === formData.highlights.length - 1 && (
                  <button
                    onClick={() => addField("highlights")}
                    className="p-3.5 bg-white text-gray-400 hover:text-color-main hover:border-color-main rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Diaspora Investor Considerations</label>
            {formData.considerations.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3 last:mb-0">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("considerations", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "considerations")}
                  placeholder="e.g., Specialized financing for overseas investors"
                  className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
                />
                <button
                  onClick={() => removeField("considerations", i)}
                  className="p-3.5 bg-white text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                {i === formData.considerations.length - 1 && (
                  <button
                    onClick={() => addField("considerations")}
                    className="p-3.5 bg-white text-gray-400 hover:text-color-main hover:border-color-main rounded-xl transition-all cursor-pointer border border-gray-200 shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Property Image</label>
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
                {formData.images.map((file: File, index: number) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl border border-gray-100"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-color-main/40 hover:bg-pink-50/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-gray-50/50 pointer-events-none" />
              <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform relative z-10">
                <Upload size={28} className="text-color-main" />
              </div>
              <p className="text-[15px] font-semibold text-gray-900 relative z-10">
                Drop your images here, or <span className="text-blue-600 hover:underline">browse</span>
              </p>
              <p className="text-[13px] text-gray-400 mt-2 relative z-10">Supports: JPG, JPEG2000, PNG</p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
