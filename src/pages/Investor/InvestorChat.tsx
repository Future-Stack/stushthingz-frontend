import { useState, useRef, useEffect, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import chatLogo from "@/assets/nav/chatLogo.png";
import {
  sendChatMessage,
  sendOnboardingMessage,
  getChatHistory,
  truncateChatSession,
} from "@/utils/chatbotService";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  index?: number;
  sessionId?: string;
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

const tryParseOnboardingJson = (text: string): Record<string, string> | null => {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed))
      return parsed as Record<string, string>;
  } catch {
    /* not JSON */
  }
  return null;
};

// Map saved value back to label for nice UI display
const getLabelForValue = (qKey: string, val: string) => {
  const q = QUESTIONS.find((item) => item.key === qKey);
  if (q && q.options) {
    const opt = q.options.find((o) => o.value === val);
    if (opt) return opt.label;
  }
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const InvestorChat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Edit Normal Prompt State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Edit Onboarding Flow Mode State
  const [isEditingOnboarding, setIsEditingOnboarding] = useState(false);
  const [editingOnboardingIndex, setEditingOnboardingIndex] = useState<number>(0);
  const [tempAnswers, setTempAnswers] = useState<Record<string, string>>({});
  const [initialJsonMsg, setInitialJsonMsg] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isEditingOnboarding, editingOnboardingIndex]);

  // Expand JSON initial prompt into conversational Question-Answer pairs
  const expandOnboardingMessages = (initialMsg: Message, answersData: Record<string, string>): Message[] => {
    const result: Message[] = [];
    QUESTIONS.forEach((q, qIdx) => {
      const savedVal = answersData[q.key];
      if (savedVal !== undefined) {
        // AI Question message
        result.push({
          id: `onboarding-q-${qIdx}`,
          sender: "ai",
          text: q.text,
          index: initialMsg.index,
          sessionId: initialMsg.sessionId,
        });
        // User Answer message
        result.push({
          id: `onboarding-a-${qIdx}`,
          sender: "user",
          text: getLabelForValue(q.key, savedVal),
          index: initialMsg.index,
          sessionId: initialMsg.sessionId,
        });
      }
    });
    return result;
  };

  // Load chat history and unpack JSON initial message into Q&A conversation items
  const loadHistory = useCallback(
    async (fetchLimit: number, scrollToEnd = true) => {
      if (!user?.id) return;
      setIsLoadingHistory(true);
      try {
        const data = await getChatHistory(user.id, fetchLimit);
        setTotalSessions(data.total);

        const flat: Message[] = [];
        if (data.sessions.length > 0) {
          const latestSession = data.sessions[data.sessions.length - 1];
          setSessionId(latestSession.id);
        }

        // Flatten all sessions oldest-first
        [...data.sessions].reverse().forEach((session) => {
          session.messages.forEach((msg, idx) => {
            const rawIndex = msg.index !== undefined ? msg.index : idx;
            const parsedJson = msg.role === "user" ? tryParseOnboardingJson(msg.content) : null;

            if (parsedJson) {
              const profileMsgObj: Message = {
                id: `${session.id}-${rawIndex}`,
                sender: "user",
                text: msg.content,
                index: rawIndex,
                sessionId: session.id,
              };
              setInitialJsonMsg(profileMsgObj);
              // Expand into individual AI question + User answer pairs
              const expanded = expandOnboardingMessages(profileMsgObj, parsedJson);
              flat.push(...expanded);
            } else {
              flat.push({
                id: `${session.id}-${rawIndex}`,
                sender: msg.role === "user" ? "user" : "ai",
                text: msg.content,
                index: rawIndex,
                sessionId: session.id,
              });
            }
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
    },
    [user?.id]
  );

  useEffect(() => {
    loadHistory(limit);
  }, [user?.id]);

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

    // If currently editing an onboarding text step
    if (isEditingOnboarding) {
      const val = inputValue.trim();
      setInputValue("");
      submitOnboardingStep(val, val);
      return;
    }

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
      const lender_code =
        localAnswers?.selectedLender && localAnswers.selectedLender !== "null"
          ? localAnswers.selectedLender
          : "general";

      const response = await sendChatMessage({
        question: userQuery,
        user_id,
        property_intent,
        lender_code,
        session_id: sessionId || undefined,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
      }

      if (user?.id) {
        await loadHistory(limit, true);
      } else {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: response.answer,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
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

  // Handle Edit click on any Onboarding Answer message
  const handleStartOnboardingAnswerEdit = (questionIndex: number) => {
    let currentAnswers: Record<string, string> = {};
    
    // 1. Try reading from localStorage
    const onboardingAnswersRaw = localStorage.getItem("onboarding_answers");
    if (onboardingAnswersRaw) {
      try {
        currentAnswers = JSON.parse(onboardingAnswersRaw);
      } catch { /* ignore */ }
    }

    // 2. Fallback: Parse from loaded server initial JSON message if local storage is missing/empty
    if (Object.keys(currentAnswers).length === 0 && initialJsonMsg?.text) {
      const parsed = tryParseOnboardingJson(initialJsonMsg.text);
      if (parsed) {
        currentAnswers = parsed;
      }
    }
    
    setTempAnswers(currentAnswers);
    setIsEditingOnboarding(true);
    setEditingOnboardingIndex(questionIndex);

    // Keep messages only up to the question being edited, rendering previous questions and answers
    const keepMessages: Message[] = [];
    for (let i = 0; i <= questionIndex; i++) {
      const q = QUESTIONS[i];
      const val = currentAnswers[q.key];
      keepMessages.push({
        id: `onboarding-q-${i}`,
        sender: "ai",
        text: q.text,
      });
      if (i < questionIndex && val !== undefined) {
        keepMessages.push({
          id: `onboarding-a-${i}`,
          sender: "user",
          text: getLabelForValue(q.key, val),
        });
      }
    }
    setMessages(keepMessages);
  };

  // Submit single step during Onboarding Edit flow
  const submitOnboardingStep = async (displayLabel: string, valueToSave: string) => {
    const currentQ = QUESTIONS[editingOnboardingIndex];
    const newAnswers = {
      ...tempAnswers,
      [currentQ.key]: valueToSave,
    };
    setTempAnswers(newAnswers);

    // Append user answer message
    const userAnsMsg: Message = {
      id: `onboarding-a-${editingOnboardingIndex}`,
      sender: "user",
      text: displayLabel,
    };

    const nextIndex = editingOnboardingIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      // Move to next onboarding question
      const nextQ = QUESTIONS[nextIndex];
      const nextAiMsg: Message = {
        id: `onboarding-q-${nextIndex}`,
        sender: "ai",
        text: nextQ.text,
      };
      setMessages((prev) => [...prev, userAnsMsg, nextAiMsg]);
      setEditingOnboardingIndex(nextIndex);
    } else {
      // Completed last onboarding question! Execute Truncate -> Onboarding DB -> Chat API -> Load History
      setMessages((prev) => [...prev, userAnsMsg]);
      setIsEditingOnboarding(false);
      setIsTyping(true);

      try {
        localStorage.setItem("onboarding_answers", JSON.stringify(newAnswers));

        const activeSessionId = initialJsonMsg?.sessionId || sessionId;
        const fromIndex = initialJsonMsg?.index !== undefined ? initialJsonMsg.index : 0;

        // 1. Truncate backend session from initial JSON prompt index (0)
        if (activeSessionId) {
          await truncateChatSession(activeSessionId, fromIndex);
        }

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
          selected_lender:
            newAnswers.selectedLender && newAnswers.selectedLender !== "null"
              ? newAnswers.selectedLender
              : "NCB",
          employment_type: newAnswers.employmentType || "employed",
        };

        // 2. Call DB save and Chat API in parallel
        await Promise.all([
          sendOnboardingMessage(onboardingPayload),
          sendChatMessage({
            question: JSON.stringify(newAnswers),
            user_id,
            property_intent: (newAnswers.propertyIntent as "buy_existing" | "build_develop") || "buy_existing",
            lender_code:
              newAnswers.selectedLender && newAnswers.selectedLender !== "null"
                ? newAnswers.selectedLender
                : "general",
            session_id: activeSessionId || undefined,
          }),
        ]);

        // 3. Load refreshed chat history
        if (user?.id) {
          await loadHistory(limit, true);
        }
      } catch (err) {
        console.error("Failed to update onboarding flow:", err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Normal Prompt Editing Handlers
  const handleStartEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleSaveEdit = async (msg: Message) => {
    if (!editText.trim() || isSubmittingEdit) return;

    const activeSessionId = msg.sessionId || sessionId;
    const fromIndex = msg.index !== undefined ? msg.index : 0;

    setIsSubmittingEdit(true);
    setIsTyping(true);
    setEditingMessageId(null);

    try {
      if (activeSessionId && fromIndex !== undefined) {
        await truncateChatSession(activeSessionId, fromIndex);
      }

      const onboardingAnswersRaw = localStorage.getItem("onboarding_answers");
      const localAnswers = onboardingAnswersRaw ? JSON.parse(onboardingAnswersRaw) : null;

      const user_id = user?.id || "guest";
      const property_intent = localAnswers?.propertyIntent || "buy_existing";
      const lender_code =
        localAnswers?.selectedLender && localAnswers.selectedLender !== "null"
          ? localAnswers.selectedLender
          : "general";

      await sendChatMessage({
        question: editText.trim(),
        user_id,
        property_intent,
        lender_code,
        session_id: activeSessionId || undefined,
      });

      if (user?.id) {
        await loadHistory(limit, true);
      }
    } catch (err) {
      console.error("Failed to edit prompt & truncate session:", err);
    } finally {
      setIsSubmittingEdit(false);
      setIsTyping(false);
      setEditText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine current active question for option rendering during edit
  const activeQuestionConfig = isEditingOnboarding ? QUESTIONS[editingOnboardingIndex] : null;

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

      {/* Messages List */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] space-y-6"
      >
        {isLoadingHistory && (
          <div className="flex justify-center py-2">
            <span className="text-xs text-gray-400 animate-pulse">Loading more messages…</span>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isEditing = editingMessageId === msg.id;
            const onboardingMatch = msg.id.match(/^onboarding-a-(\d+)$/);
            const questionIdx = onboardingMatch ? parseInt(onboardingMatch[1], 10) : -1;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`group flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-color-main flex items-center justify-center mr-3 mb-1">
                    <img src={chatLogo} alt="Vanessa" className="w-6 h-6 object-contain" />
                  </div>
                )}

                {/* Edit Pencil Icon for User Onboarding Answers */}
                {msg.sender === "user" && questionIdx !== -1 && !isEditingOnboarding && (
                  <button
                    onClick={() => handleStartOnboardingAnswerEdit(questionIdx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-color-main rounded-lg hover:bg-gray-100 mr-2 cursor-pointer shrink-0"
                    title="Edit answer & update flow"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}

                {/* Edit Pencil Icon for Normal User Messages */}
                {msg.sender === "user" && questionIdx === -1 && !isEditing && (
                  <button
                    onClick={() => handleStartEdit(msg)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-color-main rounded-lg hover:bg-gray-100 mr-2 cursor-pointer shrink-0"
                    title="Edit prompt"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}

                {/* Message Bubble or Inline Editor */}
                <div
                  className={`px-5 py-3.5 rounded-2xl max-w-[80%] min-w-0 text-[#212B36] font-poppins font-normal text-sm shadow-sm leading-relaxed break-words overflow-hidden ${
                    msg.sender === "user"
                      ? "bg-color-main text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-white/10 text-white placeholder-pink-200 border border-pink-300/40 rounded-lg p-2 text-sm focus:outline-none resize-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-2.5 py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <FiX size={12} /> Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(msg)}
                          disabled={!editText.trim() || isSubmittingEdit}
                          className="px-2.5 py-1 text-xs bg-white text-color-main font-semibold hover:bg-pink-50 rounded-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <FiCheck size={12} /> Save & Resubmit
                        </button>
                      </div>
                    </div>
                  ) : msg.sender === "user" ? (
                    msg.text
                  ) : (
                    renderMarkdown(msg.text)
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-100 border border-pink-200 ml-3 mb-1 overflow-hidden flex items-center justify-center">
                    <span className="text-xs font-bold text-color-main">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}

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

      {/* Input / Option Selection Footer */}
      <div className="p-4 border-t border-gray-100 bg-white shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* If currently editing an Onboarding question that has defined options */}
          {isEditingOnboarding && activeQuestionConfig?.options ? (
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {activeQuestionConfig.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => submitOnboardingStep(opt.label, opt.value)}
                  className="bg-pink-50 hover:bg-color-main hover:text-white border border-pink-200 text-color-main px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition-all">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isEditingOnboarding
                      ? `Type answer for: ${activeQuestionConfig?.text.slice(0, 40)}...`
                      : "Type your message to Vanessa..."
                  }
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorChat;
