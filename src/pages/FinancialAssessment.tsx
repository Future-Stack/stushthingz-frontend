import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/nav/logo.png";
import { CircleCheck, Loader2 } from "lucide-react";
import { getFinancialAssessment, FinancialAssessmentResponse } from "@/utils/chatbotService";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

const FinancialAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state?.fromDashboard;
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

  const handleContinue = () => {
    if (fromDashboard) {
      navigate("/investor/dashboard");
    } else {
      navigate("/onboarding/documents");
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      {/* Header */}
      <header className="top-0 z-10 sticky bg-white px-8 py-2 border-[#919EAB] border-b w-full">
        <div className="flex items-center space-x-2 mx-auto max-w-6xl">
          <div>
            <img src={logo} alt="logo" className="w-50" />
          </div>
        </div>
      </header>
      <main className="mx-auto mt-10 max-w-6xl">
        <AnimatePresence mode="wait">
          {!isCalculated ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mt-3 mb-1 font-bold text-color-jet-black text-2xl md:text-4xl">
                Financial Assessment
              </h2>
              <p className="text-gray-500">
                Let's evaluate your readiness for this investment
              </p>

              <form
                onSubmit={handleCalculate}
                className="space-y-4 bg-white mt-7 p-3 sm:px-6 sm:py-5 border border-[#DFE3E8] rounded-xl"
              >
                <div>
                  <label className="block mb-2 text-color-jet-black">
                    Monthly Income (USD)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="bg-[#F3F3F5] px-4 py-3 border-none rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-color-jet-black">
                    Available Savings (USD)
                  </label>
                  <input
                    type="number"
                    name="availableSavings"
                    value={formData.availableSavings}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    className="bg-[#F3F3F5] px-4 py-3 border-none rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-color-jet-black">
                    Monthly Debt Obligations (USD)
                  </label>
                  <p className="mb-2 text-gray-400 text-xs">
                    Include mortgage, car loans, student loans, credit cards, etc.
                  </p>
                  <input
                    type="number"
                    name="monthlyDebt"
                    value={formData.monthlyDebt}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    className="bg-[#F3F3F5] px-4 py-3 border-none rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-color-jet-black">
                    Credit Score (Optional)
                  </label>
                  <input
                    type="number"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleChange}
                    placeholder="e.g. 700"
                    className="bg-[#F3F3F5] px-4 py-3 border-none rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full text-gray-800"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-color-jet-black">
                    Estimated Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="estimatedInvestment"
                    value={formData.estimatedInvestment}
                    onChange={handleChange}
                    placeholder="e.g. 150000"
                    className="bg-[#F3F3F5] px-4 py-3 border-none rounded-lg outline-none focus:ring-2 focus:ring-pink-500 w-full text-gray-800"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center items-center space-x-2 bg-color-main hover:bg-[#d01958] disabled:opacity-50 mt-4 py-4 rounded-lg w-full font-bold text-white text-lg transition-colors cursor-pointer"
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
              <div className="flex flex-col justify-center items-center bg-white px-6 py-12 border border-[#DFE3E8] rounded-xl text-center">
                <CircleCheck className="mb-6 w-12 h-12 text-[#ec4899]" />
                <h2 className="mb-4.5 font-bold text-color-jet-black text-4xl">
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
                <p className="max-w-2xl font-normal text-[#4A5565] text-xl">
                  {resultData?.summary}
                </p>
                {resultData?.dti_ratio !== undefined && (
                  <p className="mt-3 font-semibold text-gray-500 text-sm">
                    Debt-to-Income (DTI) Ratio: {resultData.dti_ratio}%
                  </p>
                )}
                {resultData?.confirm_with_lender && (
                  <div className="bg-pink-50 mt-4 p-3 border border-pink-100 rounded-lg max-w-md font-medium text-[#ec4899] text-xs">
                    💡 Tip: We highly recommend confirming eligibility requirements with your selected lender.
                  </div>
                )}
              </div>

              {resultData?.recommendations && resultData.recommendations.length > 0 && (
                <div className="bg-white p-8 border border-[#DFE3E8] rounded-xl">
                  <h3 className="mb-6 font-bold text-color-jet-black text-2xl">
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
                  className="flex-1 bg-white hover:bg-pink-50 py-3.5 border border-color-main rounded-lg font-medium text-color-jet-black transition-colors cursor-pointer"
                >
                  Reassess
                </button>
                <button
                  onClick={handleContinue}
                  className="flex flex-1 justify-center items-center space-x-2 bg-color-main hover:bg-[#d01958] py-3.5 rounded-lg font-medium text-white transition-colors cursor-pointer"
                >
                  <span>{fromDashboard ? "Back to Dashboard" : "Continue to Required Documents"}</span>
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
