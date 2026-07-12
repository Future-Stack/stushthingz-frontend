import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import chatLogo from "@/assets/nav/chatLogo.png";
import { sendChatMessage } from "@/utils/chatbotService";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

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
    // Check for headings (e.g. ### or ## or #)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = parseInlineMarkdown(headingMatch[2]);
      if (level === 1) return <h1 key={idx} className="text-xl font-bold my-2 text-gray-950">{content}</h1>;
      if (level === 2) return <h2 key={idx} className="text-lg font-bold my-2 text-gray-950">{content}</h2>;
      return <h3 key={idx} className="text-base font-bold my-1 text-gray-950">{content}</h3>;
    }

    // Check for bullet lists (e.g. * item or - item)
    const listMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (listMatch) {
      return (
        <div key={idx} className="flex gap-2 pl-4 my-1 text-gray-800">
          <span className="text-gray-900 shrink-0 select-none">•</span>
          <span className="flex-1">{parseInlineMarkdown(listMatch[1])}</span>
        </div>
      );
    }

    // Check for numbered lists (e.g. 1. item)
    const numListMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numListMatch) {
      return (
        <div key={idx} className="flex gap-1.5 pl-2 my-1 text-gray-800">
          <span className="font-semibold text-gray-900 shrink-0 select-none">{numListMatch[1]}.</span>
          <span className="flex-1">{parseInlineMarkdown(numListMatch[2])}</span>
        </div>
      );
    }

    // Regular paragraph
    if (line.trim() === "") return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="my-1 text-gray-800">
        {parseInlineMarkdown(line)}
      </p>
    );
  });
};

const InvestorChat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history from localStorage or trigger initial analysis
  useEffect(() => {
    const savedHistory = localStorage.getItem("investor_chat_history");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // Trigger initial analysis using onboarding answers
      const triggerInitialAnalysis = async () => {
        setIsTyping(true);
        try {
          const onboardingAnswersRaw = localStorage.getItem("onboarding_answers");
          const localAnswers = onboardingAnswersRaw ? JSON.parse(onboardingAnswersRaw) : null;

          const user_id = user?.id || "guest";
          const property_intent = localAnswers?.propertyIntent || "buy_existing";
          const lender_code = localAnswers?.selectedLender && localAnswers.selectedLender !== "null" 
            ? localAnswers.selectedLender 
            : "general";

          // If we have onboarding answers, send them stringified
          const initialQuestion = localAnswers 
            ? JSON.stringify(localAnswers) 
            : "Hello! Let's get started with my investment journey.";

          const response = await sendChatMessage({
            question: initialQuestion,
            user_id,
            property_intent,
            lender_code,
          });

          const initialMessage: Message = {
            id: `ai-init-${Date.now()}`,
            sender: "ai",
            text: response.answer,
          };
          setMessages([initialMessage]);
          localStorage.setItem("investor_chat_history", JSON.stringify([initialMessage]));
        } catch (error) {
          console.error("Failed to fetch initial AI response:", error);
          const errorMessage: Message = {
            id: `ai-error-${Date.now()}`,
            sender: "ai",
            text: "Hello! I had trouble reading your onboarding information, but I'm ready to assist you. What can I help you with regarding your Jamaica real estate goals?",
          };
          setMessages([errorMessage]);
        } finally {
          setIsTyping(false);
        }
      };

      triggerInitialAnalysis();
    }
  }, [user]); // Removed "answers" dependency to fix infinite loop

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userQuery = inputValue.trim();
    setInputValue("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userQuery,
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    localStorage.setItem("investor_chat_history", JSON.stringify(updatedHistory));

    setIsTyping(true);

    try {
      const onboardingAnswersRaw = localStorage.getItem("onboarding_answers");
      const localAnswers = onboardingAnswersRaw ? JSON.parse(onboardingAnswersRaw) : null;

      const user_id = user?.id || "guest";
      const property_intent = localAnswers?.propertyIntent || "buy_existing";
      const lender_code = localAnswers?.selectedLender && localAnswers.selectedLender !== "null" 
        ? localAnswers.selectedLender 
        : "general";

      const response = await sendChatMessage({
        question: userQuery,
        user_id,
        property_intent,
        lender_code,
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.answer,
      };

      const finalHistory = [...updatedHistory, aiMessage];
      setMessages(finalHistory);
      localStorage.setItem("investor_chat_history", JSON.stringify(finalHistory));
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        text: "I'm sorry, I encountered an error. Please try sending your question again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    localStorage.removeItem("investor_chat_history");
    setMessages([]);
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-color-main flex items-center justify-center">
            <img src={chatLogo} alt="Vanessa" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Vanessa</h3>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online AI Assistant
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="text-xs font-medium text-gray-500 hover:text-color-main transition-colors cursor-pointer border border-gray-200 hover:border-pink-200 px-3 py-1.5 rounded-lg"
        >
          Reset Conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-color-main flex items-center justify-center mr-3 mb-1">
                  <img src={chatLogo} alt="Vanessa" className="w-6 h-6 object-contain" />
                </div>
              )}

              <div
                className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-[#212B36] font-poppins font-normal text-sm shadow-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-color-main text-white rounded-br-sm whitespace-pre-wrap"
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-color-main flex items-center justify-center mr-3">
                <img src={chatLogo} alt="Vanessa" className="w-6 h-6 object-contain" />
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

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white shrink-0">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message to Vanessa..."
              rows={1}
              className="bg-transparent w-full focus:outline-none text-gray-700 text-sm resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-11 h-11 bg-color-main hover:bg-[#d01958] text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-sm"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorChat;
