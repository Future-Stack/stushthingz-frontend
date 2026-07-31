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
  removeExistingImage: (index: number) => void;
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
  removeExistingImage,
  fileInputRef,
}) => {
  return (
    <div className="slide-in-from-right-4 space-y-8 animate-in duration-300">
      <div>
        <h3 className="mb-6 font-bold text-color-main text-lg">Basic Information</h3>
        <div className="gap-6 grid grid-cols-1">
          <div>
            <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Blue Mountain Eco-Village"
              className="bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Portland Parish, Jamaica"
                className="bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full placeholder:text-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Property Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full text-gray-700 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select type</option>
                  <option value="land">Land</option>
                  <option value="developmentLand">Development Land</option>
                  <option value="residencial">Residential</option>
                  <option value="mixedUse">Mixed Use</option>
                  <option value="agriculture">Agriculture</option>
                </select>
                <div className="top-1/2 right-4 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Size/Area</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g., 0.25 - 0.5 acres per lot"
              className="bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full placeholder:text-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter detailed property description"
              className="bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 w-full placeholder:text-gray-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Key Highlights</label>
            {formData.highlights.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3 last:mb-0">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("highlights", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "highlights")}
                  placeholder="e.g., Solar panel infrastructure pre-installed"
                  className="flex-1 bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 transition-all"
                />
                <button
                  onClick={() => removeField("highlights", i)}
                  className="bg-white shadow-sm p-3.5 border border-gray-200 hover:border-red-500 rounded-xl text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Minus size={20} />
                </button>
                {i === formData.highlights.length - 1 && (
                  <button
                    onClick={() => addField("highlights")}
                    className="bg-white shadow-sm p-3.5 border border-gray-200 hover:border-color-main rounded-xl text-gray-400 hover:text-color-main transition-all cursor-pointer"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-2 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Diaspora Investor Considerations</label>
            {formData.considerations.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3 last:mb-0">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("considerations", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "considerations")}
                  placeholder="e.g., Specialized financing for overseas investors"
                  className="flex-1 bg-gray-50/30 px-4 py-3.5 border border-gray-200 focus:border-color-main rounded-xl focus:outline-none focus:ring-2 focus:ring-color-main/20 transition-all"
                />
                <button
                  onClick={() => removeField("considerations", i)}
                  className="bg-white shadow-sm p-3.5 border border-gray-200 hover:border-red-500 rounded-xl text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Minus size={20} />
                </button>
                {i === formData.considerations.length - 1 && (
                  <button
                    onClick={() => addField("considerations")}
                    className="bg-white shadow-sm p-3.5 border border-gray-200 hover:border-color-main rounded-xl text-gray-400 hover:text-color-main transition-all cursor-pointer"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-3 font-bold text-[13px] text-gray-700 uppercase tracking-wide">Property Images</label>

            {/* Existing Uploaded Images (During Edit) */}
            {formData.existingImages && formData.existingImages.length > 0 && (
              <div className="mb-4">
                <p className="block mb-2 font-semibold text-gray-600 text-xs uppercase">Existing Images</p>
                <div className="gap-4 grid grid-cols-4">
                  {formData.existingImages.map((img: { id?: string; url: string }, index: number) => (
                    <div key={img.id || index} className="group relative aspect-square">
                      <img
                        src={img.url}
                        alt={`Existing ${index}`}
                        className="border border-gray-200 rounded-2xl w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(index);
                        }}
                        title="Delete image"
                        className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 opacity-0 group-hover:opacity-100 shadow-lg rounded-full w-7 h-7 text-white transition-opacity cursor-pointer"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload Previews */}
            {formData.images && formData.images.length > 0 && (
              <div className="mb-4">
                <p className="block mb-2 font-semibold text-gray-600 text-xs uppercase">New Images to Upload</p>
                <div className="gap-4 grid grid-cols-4">
                  {formData.images.map((file: File, index: number) => (
                    <div key={index} className="group relative aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="border border-gray-200 rounded-2xl w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 opacity-0 group-hover:opacity-100 shadow-lg rounded-full w-7 h-7 text-white transition-opacity cursor-pointer"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
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
              className="group relative flex flex-col justify-center items-center hover:bg-pink-50/20 p-10 border-2 border-gray-200 hover:border-color-main/40 border-dashed rounded-3xl overflow-hidden text-center transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-gray-50/50 pointer-events-none" />
              <div className="z-10 relative flex justify-center items-center bg-white shadow-md mb-5 rounded-2xl w-14 h-14 group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-color-main" />
              </div>
              <p className="z-10 relative font-semibold text-[15px] text-gray-900">
                Drop your images here, or <span className="text-blue-600 hover:underline">browse</span>
              </p>
              <p className="z-10 relative mt-2 text-[13px] text-gray-400">Supports: JPG, JPEG2000, PNG</p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
