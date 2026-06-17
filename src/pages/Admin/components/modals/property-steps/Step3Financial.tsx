import React from "react";
import { Plus, Minus } from "lucide-react";

interface Step3Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDynamicChange: (field: string, index: number, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent, field: string) => void;
  addField: (field: string) => void;
  removeField: (field: string, index: number) => void;
}

const Step3Financial: React.FC<Step3Props> = ({
  formData,
  handleChange,
  handleDynamicChange,
  handleKeyDown,
  addField,
  removeField,
}) => {
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300 pb-10">
      <div>
        <h3 className="text-lg font-bold text-color-main mb-8">Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Price Range</label>
            <div className="flex gap-4">
              <input
                type="text"
                name="priceRangeLower"
                value={formData.priceRangeLower}
                onChange={handleChange}
                placeholder="Lower limit (e.g., $180,000)"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
              />
              <span className="flex items-center text-gray-400 font-bold">-</span>
              <input
                type="text"
                name="priceRangeUpper"
                value={formData.priceRangeUpper}
                onChange={handleChange}
                placeholder="Upper limit (e.g., $250,000 USD)"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Estimated Closing Costs</label>
            <input
              type="text"
              name="closingCosts"
              value={formData.closingCosts}
              onChange={handleChange}
              placeholder="e.g., 12-15% of purchase price"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Price Details</label>
            <textarea
              name="priceDetails"
              value={formData.priceDetails}
              onChange={handleChange}
              rows={3}
              placeholder="Explain pricing structure and what affects pricing"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Closing Costs Breakdown</label>
            <textarea
              name="closingCostsBreakdown"
              value={formData.closingCostsBreakdown}
              onChange={handleChange}
              rows={3}
              placeholder="Include transfer tax, legal fees, stamp duty, etc."
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Ongoing Costs</label>
            {formData.ongoingCosts.map((val: string, i: number) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleDynamicChange("ongoingCosts", i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "ongoingCosts")}
                  placeholder="e.g., Property tax: Approximately $800-1,200 annually"
                  className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
                />
                <button
                  onClick={() => removeField("ongoingCosts", i)}
                  className="p-3.5 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-200 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                {i === formData.ongoingCosts.length - 1 && (
                  <button
                    onClick={() => addField("ongoingCosts")}
                    className="p-3.5 bg-white text-gray-400 hover:text-color-main rounded-xl border border-gray-200 shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Investment Structure</label>
              <textarea
                name="investmentStructure"
                value={formData.investmentStructure}
                onChange={handleChange}
                rows={3}
                placeholder="Explain deposit, payment structure, and financing options"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Projected Returns</label>
              <textarea
                name="projectedReturns"
                value={formData.projectedReturns}
                onChange={handleChange}
                rows={3}
                placeholder="Expected appreciation and rental yields"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Tax Incentives</label>
              <textarea
                name="taxIncentives"
                value={formData.taxIncentives}
                onChange={handleChange}
                rows={3}
                placeholder="Available tax credits and incentives"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-lg font-bold text-color-main mb-8">Timeline & Availability</h3>
        <div className="space-y-8">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Current Availability</label>
            <input
              type="text"
              name="currentAvailability"
              value={formData.currentAvailability}
              onChange={handleChange}
              placeholder="e.g., 4 lots currently available, 2 more releasing in May 2026"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Typical Closing Period</label>
            <input
              type="text"
              name="closingPeriod"
              value={formData.closingPeriod}
              onChange={handleChange}
              placeholder="e.g., 90 days from contract execution"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Development Status</label>
            <textarea
              name="developmentStatus"
              value={formData.developmentStatus}
              onChange={handleChange}
              rows={3}
              placeholder="Current development progress and expected completion"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-color-main/20 focus:border-color-main transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Financial;
