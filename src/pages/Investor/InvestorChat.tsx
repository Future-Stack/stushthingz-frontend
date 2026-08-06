import { useState, useRef, useEffect, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import chatLogo from "@/assets/nav/chatLogo.png";
import { sendChatMessage, getChatHistory } from "@/utils/chatbotService";

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

const LABEL_MAP: Record<string, string> = {
  investmentGoal: "Investment Goal",
  budgetRange: "Budget",
  timeline: "Timeline",
  country: "Country",
  firstTime: "First Time Investor",
  propertyType: "Property Type",
  financing: "Financing",
  propertyIntent: "Property Intent",
  selectedLender: "Lender",
  employmentType: "Employment Type",
};

const formatValue = (_key: string, value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const tryParseOnboardingJson = (text: string): Record<string, string> | null => {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed as Record<string, string>;
  } catch { /* not JSON */ }
  return null;
};

const renderOnboardingProfile = (data: Record<string, string>) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold uppercase tracking-wide text-pink-100 mb-2">📋 My Investment Profile</p>
    {Object.entries(data)
      .filter(([key]) => LABEL_MAP[key])
      .map(([key, value]) => (
        <div key={key} className="flex justify-between gap-3 text-xs">
          <span className="text-pink-100 shrink-0">{LABEL_MAP[key]}</span>
          <span className="font-semibold text-white text-right">{formatValue(key, String(value))}</span>
        </div>
      ))
    }
  </div>
);

const InvestorChat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Convert API history sessions into flat messages
  const loadHistory = useCallback(async (fetchLimit: number, scrollToEnd = true) => {
    if (!user?.id) return;
    setIsLoadingHistory(true);
    try {
      const data = await getChatHistory(user.id, fetchLimit);
      setTotalSessions(data.total);

      const flat: Message[] = [];
      // Latest session drives session_id for new messages
      if (data.sessions.length > 0) {
        const latestSession = data.sessions[data.sessions.length - 1];
        setSessionId(latestSession.id);
      }

      // Flatten all sessions oldest-first
      [...data.sessions].reverse().forEach((session) => {
        session.messages.forEach((msg, idx) => {
          flat.push({
            id: `${session.id}-${idx}`,
            sender: msg.role === "user" ? "user" : "ai",
            text: msg.content,
          });
        });
      });

      setMessages(flat);
      if (scrollToEnd) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadHistory(limit);
  }, [user?.id]);

  // Infinite scroll — load more when user scrolls to top
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingHistory) return;
    if (container.scrollTop === 0 && messages.length < totalSessions * 1) {
      const newLimit = limit + 20;
      setLimit(newLimit);
      loadHistory(newLimit, false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userQuery = inputValue.trim();
    setInputValue("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userQuery,
    };

    setMessages((prev) => [...prev, userMessage]);
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
        session_id: sessionId || undefined,
      });

      // Track session_id from first response if not already set
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
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
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6"
      >
        {/* Load more indicator at top */}
        {isLoadingHistory && (
          <div className="flex justify-center py-2">
            <span className="text-xs text-gray-400 animate-pulse">Loading more messages…</span>
          </div>
        )}
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
                className={`px-5 py-3.5 rounded-2xl max-w-[80%] min-w-0 text-[#212B36] font-poppins font-normal text-sm shadow-sm leading-relaxed break-words overflow-hidden ${
                  msg.sender === "user"
                    ? "bg-color-main text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                }`}
              >
                {msg.sender === "user"
                  ? (() => {
                      const parsed = tryParseOnboardingJson(msg.text);
                      return parsed ? renderOnboardingProfile(parsed) : msg.text;
                    })()
                  : renderMarkdown(msg.text)
                }
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
