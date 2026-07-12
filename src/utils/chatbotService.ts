export interface ChatRequest {
  question: string;
  lender_code?: string;
  user_id?: string;
  property_intent?: "buy_existing" | "build_develop";
}

export interface ChatResponse {
  answer: string;
}

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch("http://72.60.96.242:8013/api/v1/chatbot/chat", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: data.question,
      lender_code: data.lender_code || "general",
      user_id: data.user_id || "guest",
      property_intent: data.property_intent || "buy_existing",
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json();
};
