import React from "react";
import { Info } from "lucide-react";
import { InvestorProfileDetails } from "../data/mockData";

interface FinancialTabProps {
  profile: InvestorProfileDetails;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-5">Financial Summary</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Monthly Income</p>
            <p className="text-sm text-gray-900">{profile.financial.monthlyIncome}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Savings Available</p>
            <p className="text-sm text-gray-900">{profile.financial.savingsAvailable}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Debt Obligations</p>
            <p className="text-sm text-gray-900">{profile.financial.debtObligations}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4B5A7A] mb-1">Investment Budget</p>
            <p className="text-sm text-gray-900">{profile.financial.investmentBudget}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F0F7FF] border border-[#DCEAFC] rounded-xl p-4 flex gap-3">
        <Info size={18} className="text-[#193CB8] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-[#1E3A8A]">Readiness Classification</h4>
          <p className="text-xs text-[#193CB8] mt-1 leading-relaxed">
            Based on financial assessment, this investor is classified as 80% Ready. Debt-to-income ratio and available savings meet bank requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialTab;
