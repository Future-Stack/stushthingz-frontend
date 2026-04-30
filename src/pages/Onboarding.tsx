import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/nav/logo.png";
import chatLogo from "@/assets/nav/chatLogo.png";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const QUESTIONS = [
  "Welcome to Vanessa. I'll guide you through your Jamaica investment journey.\nLet's start by understanding your goals.\n\nWhat is your primary investment goal? For example: rental income, vacation home, retirement property, or capital appreciation.",
  "Great! What is your budget range for this investment?",
  "What is your timeline for making this investment?",
  "What country are you currently residing in?",
  "Is this your first time investing in real estate? (Yes/No)",
  "What type of property are you interested in? (Residential, Rental, Vacation)",
  "How do you plan to finance this investment? (Cash or Mortgage)",
];

const KEYS = [
  "investmentGoal",
  "budgetRange",
  "timeline",
  "country",
  "firstTime",
  "propertyType",
  "financing",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", sender: "ai", text: QUESTIONS[0] },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAnswers((prev) => ({
      ...prev,
      [KEYS[currentQuestionIndex]]: inputValue.trim(),
    }));
    setInputValue("");

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      // Simulate AI typing delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: "ai",
            text: QUESTIONS[nextIndex],
          },
        ]);
        setCurrentQuestionIndex(nextIndex);
      }, 600);
    } else {
      // Finished all questions, show summary
      setTimeout(() => {
        setIsFinished(true);
        // Add summary message
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const generateSummaryText = () => {
    return `Perfect! Let me summarize what we've discussed:\n• Investment Goal: ${answers.investmentGoal}\n• Budget Range: ${answers.budgetRange}\n• Timeline: ${answers.timeline}\n• Country of Residence: ${answers.country}\n• First-time Investor: ${answers.firstTime}\n• Property Type: ${answers.propertyType}\n• Financing: ${answers.financing}\n\nDoes this look correct?`;
  };

  useEffect(() => {
    if (isFinished) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-summary-${Date.now()}`,
          sender: "ai",
          text: generateSummaryText(),
        },
      ]);
    }
  }, [isFinished]);

  const handleConfirm = () => {
    // Save answers if needed, then redirect
    console.log("Onboarding complete. Answers:", answers);
    navigate("/onboarding/assessment");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <div>
            <img src={logo} alt="logo" className="w-50" />
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          {QUESTIONS.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                backgroundColor:
                  index <= currentQuestionIndex || isFinished
                    ? "#ec4899"
                    : "#d1d5db",
                scale: index === currentQuestionIndex && !isFinished ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.sender === "ai" && (
                  <div className="shrink-0 w-10 h-10 rounded-full bg-color-main flex items-center justify-center mr-3 mb-1">
                    <img src={chatLogo} alt="logo" className="" />
                  </div>
                )}

                <div
                  className={`px-5 py-3.5 rounded-2xl max-w-[80%] whitespace-pre-wrap text-[#212B36] font-poppins font-normal text-sm ${msg.sender === "user"
                    ? "bg-color-main text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                    }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gray-300 ml-3 mb-1 overflow-hidden">
                    <img
                      src="https://ui-avatars.com/api/?name=User&background=random"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />

          {/* Confirm Button Area */}
          <AnimatePresence>
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex justify-center mt-8 pb-4"
              >
                <button
                  onClick={handleConfirm}
                  className="bg-color-main hover:bg-[#d01958] text-white px-8 py-3 rounded-md font-medium flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <span>✓</span>
                  <span>Confirm & Continue</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Input Area */}
      <AnimatePresence>
        {!isFinished && (
          <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-t border-gray-200 p-4 shrink-0"
          >
            <div className="max-w-3xl mx-auto flex items-center space-x-4">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response..."
                  className="bg-transparent w-full focus:outline-none text-gray-700"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-[#f48fb1] hover:bg-[#f06292] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
