import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/nav/logo.png";
import { CircleCheck } from "lucide-react";

const FinancialAssessment = () => {
  const navigate = useNavigate();
  const [isCalculated, setIsCalculated] = useState(false);

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

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would do calculation here. We just transition to the result view.
    setIsCalculated(true);
  };

  const handleReassess = () => {
    setIsCalculated(false);
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
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-color-main hover:bg-[#d01958] text-white py-4 text-lg rounded-lg font-bold transition-colors cursor-pointer mt-4"
                >
                  Calculate Readiness Score
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
              <div className="bg-white rounded-xl border border-[#DFE3E8] flex flex-col items-center justify-center text-center py-12">
                <CircleCheck className="w-12 h-12 text-black mb-12" />
                <h2 className="text-4xl font-bold text-color-jet-black mb-4.5">
                  You're 73% Ready
                </h2>
                <p className="text-xl font-normal text-[#4A5565]">
                  Your financial profile shows strong readiness for this investment
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-[#DFE3E8]">
                <h3 className="text-2xl font-bold text-color-jet-black mb-6">
                  Recommendations
                </h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Continue to the Investment Guide to learn about the Jamaica market
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Maintain your current savings rate throughout the process
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Keep debt levels stable during your property search
                  </li>
                </ul>
              </div>

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
    </div >
  );
};

export default FinancialAssessment;
