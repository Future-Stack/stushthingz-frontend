import React from "react";
import { Info } from "lucide-react";
import { TInvestorProfileData } from "@/store/api/bankApi";

interface FinancialTabProps {
  profile: TInvestorProfileData;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ profile }) => {
  const { financial, overview } = profile;

  return (
    <div className="space-y-6">
      <div className="p-5 border border-gray-100 rounded-xl">
        <h3 className="mb-5 font-bold text-gray-900 text-sm">Financial Summary</h3>
        <div className="gap-x-4 gap-y-6 grid grid-cols-2">
          <div>
            <p className="mb-1 font-semibold text-[#4B5A7A] text-xs">Monthly Income / Employment</p>
            <p className="text-gray-900 text-sm">{financial.employmentType || "N/A"}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-[#4B5A7A] text-xs">Savings / Income Type</p>
            <p className="text-gray-900 text-sm">
              {financial.incomeIsVariable !== null
                ? financial.incomeIsVariable
                  ? "Variable Income"
                  : "Fixed / Stable Income"
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-[#4B5A7A] text-xs">Property Intent</p>
            <p className="text-gray-900 text-sm">{financial.propertyIntent || "N/A"}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-[#4B5A7A] text-xs">Investment Budget</p>
            <p className="text-gray-900 text-sm">
              {financial.investmentBudgetLabel ||
                (financial.investmentBudget
                  ? `$${financial.investmentBudget.toLocaleString()}`
                  : "N/A")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 bg-[#F0F7FF] p-4 border border-[#DCEAFC] rounded-xl">
        <Info size={18} className="mt-0.5 text-[#193CB8] shrink-0" />
        <div>
          <h4 className="font-bold text-[#1E3A8A] text-sm">Readiness Classification</h4>
          <p className="mt-1 text-[#193CB8] text-xs leading-relaxed">
            Based on financial assessment, this investor is classified as{" "}
            <span className="font-bold">
              {overview.readinessLabel
                ? `${overview.readinessPercentage}% ${overview.readinessLabel}`
                : "80% Ready"}
            </span>
            . Debt-to-income ratio and available savings meet bank requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialTab;
