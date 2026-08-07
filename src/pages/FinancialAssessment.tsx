import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/nav/logo.png";
import { CircleCheck, Loader2 } from "lucide-react";
import { getFinancialAssessment, FinancialAssessmentResponse } from "@/utils/chatbotService";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

const FinancialAssessment = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<FinancialAssessmentResponse | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    availableSavings: "",
    monthlyDebt: "",
    creditScore: "",
    estimatedInvestment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await getFinancialAssessment({
        user_id: user?.id,
        monthly_income: Number(formData.monthlyIncome),
        available_savings: Number(formData.availableSavings),
        monthly_debt_obligations: Number(formData.monthlyDebt),
        estimated_investment_amount: Number(formData.estimatedInvestment),
        credit_score: Number(formData.creditScore) || 0,
      });
      setResultData(response);
      setIsCalculated(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassess = () => {
    setIsCalculated(false);
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <header className="w-full px-8 bg-white border-b border-[#919EAB] sticky top-0 z-10 py-2">
        <div className="max-w-6xl mx-auto flex items-center space-x-2">
          <div>
            <img src={logo} alt="logo" className="w-50" />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto mt-10">
        <AnimatePresence mode="wait">
          {!isCalculated ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-color-jet-black mt-3 mb-1">
                Financial Assessment
              </h2>
              <p className="text-gray-500">
                Let's evaluate your readiness for this investment
              </p>

              <form
                onSubmit={handleCalculate}
                className="bg-white p-3 sm:px-6 sm:py-5 rounded-xl border border-[#DFE3E8] space-y-4 mt-7"
              >
                <div>
                  <label className="block text-color-jet-black mb-2">
                    Monthly Income (USD)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="w-full bg-[#F3F3F5] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-color-jet-black mb-2">
                    Available Savings (USD)
                  </label>
                  <input
                    type="number"
                    name="availableSavings"
                    value={formData.availableSavings}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#F3F3F5] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-color-jet-black mb-2">
                    Monthly Debt Obligations (USD)
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Include mortgage, car loans, student loans, credit cards, etc.
                  </p>
                  <input
                    type="number"
                    name="monthlyDebt"
                    value={formData.monthlyDebt}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    className="w-full bg-[#F3F3F5] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-color-jet-black mb-2">
                    Credit Score (Optional)
                  </label>
                  <input
                    type="number"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleChange}
                    placeholder="e.g. 700"
                    className="w-full bg-[#F3F3F5] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-color-jet-black mb-2">
                    Estimated Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="estimatedInvestment"
                    value={formData.estimatedInvestment}
                    onChange={handleChange}
                    placeholder="e.g. 150000"
                    className="w-full bg-[#F3F3F5] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-color-main hover:bg-[#d01958] text-white py-4 text-lg rounded-lg font-bold transition-colors cursor-pointer mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Calculate Readiness Score</span>
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-[#DFE3E8] flex flex-col items-center justify-center text-center py-12 px-6">
                <CircleCheck className="w-12 h-12 text-[#ec4899] mb-6" />
                <h2 className="text-4xl font-bold text-color-jet-black mb-4.5">
                  You're {resultData?.readiness_score}% Ready
                </h2>
                <div className="mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white uppercase ${
                    resultData?.readiness_label.toLowerCase() === "strong" || resultData?.readiness_label.toLowerCase() === "high"
                      ? "bg-green-500"
                      : resultData?.readiness_label.toLowerCase() === "moderate"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}>
                    {resultData?.readiness_label} Readiness
                  </span>
                </div>
                <p className="text-xl font-normal text-[#4A5565] max-w-2xl">
                  {resultData?.summary}
                </p>
                {resultData?.dti_ratio !== undefined && (
                  <p className="text-sm text-gray-500 mt-3 font-semibold">
                    Debt-to-Income (DTI) Ratio: {resultData.dti_ratio}%
                  </p>
                )}
                {resultData?.confirm_with_lender && (
                  <div className="mt-4 p-3 bg-pink-50 border border-pink-100 rounded-lg text-xs text-[#ec4899] font-medium max-w-md">
                    💡 Tip: We highly recommend confirming eligibility requirements with your selected lender.
                  </div>
                )}
              </div>

              {resultData?.recommendations && resultData.recommendations.length > 0 && (
                <div className="bg-white p-8 rounded-xl border border-[#DFE3E8]">
                  <h3 className="text-2xl font-bold text-color-jet-black mb-6">
                    Recommendations
                  </h3>
                  <ul className="space-y-4 text-gray-600">
                    {resultData.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-color-main">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleReassess}
                  className="flex-1 bg-white border border-color-main text-color-jet-black hover:bg-pink-50 py-3.5 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Reassess
                </button>
                <button
                  onClick={() => navigate("/onboarding/guide")}
                  className="flex-1 bg-color-main hover:bg-[#d01958] text-white py-3.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Continue to Investment Guide</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FinancialAssessment;
