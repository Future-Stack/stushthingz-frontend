import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/nav/logo.png";
import chatLogo from "@/assets/nav/chatLogo.png";
import { sendChatMessage, sendOnboardingMessage } from "@/utils/chatbotService";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

interface QuestionConfig {
  key: string;
  text: string;
  options?: { label: string; value: string }[];
}

const QUESTIONS: QuestionConfig[] = [
  {
    key: "investmentGoal",
    text: "Welcome to Vanessa. I'll guide you through your Jamaica investment journey.\nLet's start by understanding your goals.\n\nWhat is your primary investment goal?",
    options: [
      { label: "Rental Income", value: "rental_income" },
      { label: "Vacation Home", value: "vacation_home" },
      { label: "Retirement Property", value: "retirement_property" },
      { label: "Capital Appreciation", value: "capital_appreciation" },
    ],
  },
  {
    key: "budgetRange",
    text: "Great! What is your budget range for this investment?",
  },
  {
    key: "timeline",
    text: "What is your timeline for making this investment?",
  },
  {
    key: "country",
    text: "What country are you currently residing in?",
  },
  {
    key: "firstTime",
    text: "Is this your first time investing in real estate?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    key: "propertyType",
    text: "What type of property are you interested in?",
    options: [
      { label: "Residential", value: "residential" },
      { label: "Rental", value: "rental" },
      { label: "Vacation", value: "vacation" },
      { label: "Commercial", value: "commercial" },
      { label: "Mixed Use", value: "mixed_use" },
    ],
  },
  {
    key: "financing",
    text: "How do you plan to finance this investment?",
    options: [
      { label: "Cash", value: "cash" },
      { label: "Loan", value: "loan" },
      { label: "Financing", value: "financing" },
    ],
  },
  {
    key: "propertyIntent",
    text: "Are you looking to buy an existing property or build/develop?",
    options: [
      { label: "Buy Existing", value: "buy_existing" },
      { label: "Build / Develop", value: "build_develop" },
    ],
  },
  {
    key: "selectedLender",
    text: "Which lender are you interested in?",
    options: [
      { label: "NCB", value: "NCB" },
      { label: "VMBS", value: "VMBS" },
      { label: "JN", value: "JN" },
      { label: "JMMB", value: "JMMB" },
      { label: "Scotiabank", value: "SCOTIABANK" },
      { label: "Sagicor", value: "SAGICOR" },
      { label: "None / Other", value: "null" },
    ],
  },
  {
    key: "employmentType",
    text: "What is your employment type?",
    options: [
      { label: "Employed", value: "employed" },
      { label: "Self Employed", value: "self_employed" },
      { label: "Employed (Commission)", value: "employed_commission" },
      { label: "Self Employed Contractor", value: "self_employed_contractor" },
      { label: "Self Employed (Business Separate)", value: "self_employed_business_separate" },
      { label: "Self Employed (Business Mixed)", value: "self_employed_business_mixed" },
      { label: "Employed (Overseas)", value: "employed_overseas" },
      { label: "Self Employed (Overseas)", value: "self_employed_overseas" },
    ],
  },
];

const parseInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const renderMarkdown = (text: string) => {
  return text.split("\n").map((line, idx) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = parseInlineMarkdown(headingMatch[2]);
      if (level === 1) return <h1 key={idx} className="text-xl font-bold my-2 text-gray-950">{content}</h1>;
      if (level === 2) return <h2 key={idx} className="text-lg font-bold my-2 text-gray-950">{content}</h2>;
      return <h3 key={idx} className="text-base font-bold my-1 text-gray-950">{content}</h3>;
    }

    const listMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (listMatch) {
      return (
        <div key={idx} className="flex gap-2 pl-4 my-1 text-gray-800">
          <span className="text-gray-900 shrink-0 select-none">•</span>
          <span className="flex-1">{parseInlineMarkdown(listMatch[1])}</span>
        </div>
      );
    }

    const numListMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numListMatch) {
      return (
        <div key={idx} className="flex gap-1.5 pl-2 my-1 text-gray-800">
          <span className="font-semibold text-gray-900 shrink-0 select-none">{numListMatch[1]}.</span>
          <span className="flex-1">{parseInlineMarkdown(numListMatch[2])}</span>
        </div>
      );
    }

    if (line.trim() === "") return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="my-1 text-gray-800">
        {parseInlineMarkdown(line)}
      </p>
    );
  });
};

const Onboarding = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-0", sender: "ai", text: QUESTIONS[0].text },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const submitAnswer = async (valueText: string, valueToSave: string) => {
    // If onboarding survey is already completed, it's a general chatbot message
    if (surveyCompleted) {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text: valueText,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      try {
        const user_id = user?.id || "guest";
        const property_intent = (answers.propertyIntent as "buy_existing" | "build_develop") || "buy_existing";
        const lender_code = answers.selectedLender && answers.selectedLender !== "null"
          ? answers.selectedLender
          : "general";

        const response = await sendChatMessage({
          question: valueText,
          user_id,
          property_intent,
          lender_code,
          session_id: sessionId || undefined,
        });

        if (response.session_id && !sessionId) {
          setSessionId(response.session_id);
        }

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: response.answer,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: "ai",
            text: "Sorry, I ran into an issue processing your query. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Otherwise, we are still answering the onboarding survey questions
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: valueText,
    };

    const newAnswers = {
      ...answers,
      [QUESTIONS[currentQuestionIndex].key]: valueToSave,
    };

    setMessages((prev) => [...prev, userMessage]);
    setAnswers(newAnswers);
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
            text: QUESTIONS[nextIndex].text,
          },
        ]);
        setCurrentQuestionIndex(nextIndex);
      }, 600);
    } else {
      // Finished all questions — save answers, call onboarding API (background) and chat API (shown to user)
      setIsTyping(true);
      localStorage.setItem("onboarding_answers", JSON.stringify(newAnswers));
      localStorage.setItem("onboarding_completed", "true");

      try {
        const user_id = user?.id || "guest";

        const onboardingPayload = {
          user_id,
          investment_goal: newAnswers.investmentGoal || "",
          investment_budget: parseFloat(String(newAnswers.budgetRange).replace(/[^0-9.]/g, "")) || 0,
          investment_timeline: newAnswers.timeline || "",
          country_of_residence: newAnswers.country || "",
          is_first_time_investor: newAnswers.firstTime === "yes",
          property_type: newAnswers.propertyType || "residential",
          financing_type: newAnswers.financing || "cash",
          property_intent: newAnswers.propertyIntent || "buy_existing",
          selected_lender: newAnswers.selectedLender && newAnswers.selectedLender !== "null"
            ? newAnswers.selectedLender
            : "NCB",
          employment_type: newAnswers.employmentType || "employed",
        };

        // Call onboarding API silently in background (just to save data), and chat API for the user-facing response
        const [onboardingRes, chatRes] = await Promise.allSettled([
          sendOnboardingMessage(onboardingPayload),
          sendChatMessage({
            question: JSON.stringify(newAnswers),
            user_id,
            property_intent: (newAnswers.propertyIntent as "buy_existing" | "build_develop") || "buy_existing",
            lender_code: newAnswers.selectedLender && newAnswers.selectedLender !== "null"
              ? newAnswers.selectedLender
              : "general",
          }),
        ]);

        // Show the chat API response to the user
        const chatAnswer = chatRes.status === "fulfilled"
          ? chatRes.value.answer
          : "Perfect! I've saved your goals and budget details. You can now chat with me about your real estate plans here, or proceed to the next step when you are ready.";

        // Store session_id from the chat API response
        if (chatRes.status === "fulfilled" && chatRes.value.session_id) {
          setSessionId(chatRes.value.session_id);
        }

        const initialAnalysisMessage: Message = {
          id: `ai-analysis-${Date.now()}`,
          sender: "ai",
          text: chatAnswer,
        };

        setMessages((prev) => [...prev, initialAnalysisMessage]);
        setSurveyCompleted(true);
      } catch (error) {
        console.error("Failed to fetch initial AI analysis:", error);
        const fallbackMessage: Message = {
          id: `ai-fallback-${Date.now()}`,
          sender: "ai",
          text: "Perfect! I've saved your goals and budget details. You can now chat with me about your real estate plans here, or proceed to the next step when you are ready.",
        };
        setMessages((prev) => [...prev, fallbackMessage]);
        setSurveyCompleted(true);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    submitAnswer(inputValue.trim(), inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProceed = () => {
    navigate("/onboarding/assessment");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="w-40" />
        </div>
        
        {/* Progress Tracker / Action Button */}
        <div className="flex items-center space-x-4">
          {!surveyCompleted ? (
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[200px] py-1">
              {QUESTIONS.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    backgroundColor:
                      index <= currentQuestionIndex
                        ? "#ec4899"
                        : "#d1d5db",
                    scale: index === currentQuestionIndex ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-2 h-2 rounded-full shrink-0"
                />
              ))}
            </div>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleProceed}
              className="bg-color-main hover:bg-[#d01958] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Financial Assessment</span>
              <span>→</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="shrink-0 w-10 h-10 rounded-full bg-color-main flex items-center justify-center mr-3 mb-1">
                    <img src={chatLogo} alt="Vanessa" className="" />
                  </div>
                )}

                <div
                  className={`px-5 py-3.5 rounded-2xl max-w-[85%] min-w-0 text-[#212B36] font-poppins font-normal text-sm shadow-sm leading-relaxed break-words overflow-hidden ${
                    msg.sender === "user"
                      ? "bg-color-main text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.sender === "user" ? msg.text : renderMarkdown(msg.text)}
                </div>

                {msg.sender === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-100 border border-pink-200 ml-3 mb-1 overflow-hidden flex items-center justify-center">
                    <span className="text-xs font-bold text-color-main">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-start"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-color-main flex items-center justify-center mr-3">
                  <img src={chatLogo} alt="Vanessa" className="" />
                </div>
                <div className="bg-white border border-gray-100 px-5 py-3.5 rounded-2xl rounded-bl-sm flex space-x-1 items-center shadow-sm">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col space-y-4">
          {/* Predefined Options - only show if current question has them and we haven't completed the survey */}
          {!surveyCompleted && QUESTIONS[currentQuestionIndex]?.options && (
            <div className="flex flex-wrap gap-2 justify-center py-2 max-h-[160px] overflow-y-auto">
              {QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => submitAnswer(option.label, option.value)}
                  className="px-4 py-2.5 bg-pink-50 hover:bg-[#ec4899] text-[#ec4899] hover:text-white rounded-full font-medium text-sm transition-colors border border-[#f48fb1]/30 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Text Input - show if no options exist, or if survey is completed so they can chat */}
          {(surveyCompleted || !QUESTIONS[currentQuestionIndex]?.options) && (
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition-all">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    surveyCompleted
                      ? "Ask Vanessa anything about your investment..."
                      : "Type your response..."
                  }
                  rows={1}
                  className="bg-transparent w-full focus:outline-none text-gray-700 text-sm resize-none"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-color-main hover:bg-[#d01958] text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-sm"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
