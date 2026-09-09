export interface ChatRequest {
  question: string;
  lender_code?: string;
  user_id?: string;
  property_intent?: "buy_existing" | "build_develop";
  session_id?: string;
}

export interface ChatResponse {
  answer: string;
  session_id?: string;
}

export interface OnboardingChatRequest {
  user_id: string;
  investment_goal: string;
  investment_budget: number;
  investment_timeline: string;
  country_of_residence: string;
  is_first_time_investor: boolean;
  property_type: string;
  financing_type: string;
  property_intent: string;
  selected_lender: string;
  employment_type: string;
}

export interface OnboardingChatResponse {
  saved: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  index?: number;
}

export interface ChatSession {
  id: string;
  lender_code: string | null;
  property_intent: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryResponse {
  user_id: string;
  total: number;
  sessions: ChatSession[];
}

export interface FinancialAssessmentRequest {
  user_id?: string;
  monthly_income: number;
  available_savings: number;
  monthly_debt_obligations: number;
  estimated_investment_amount: number;
  credit_score: number;
}

export interface FinancialAssessmentResponse {
  readiness_score: number;
  readiness_label: string;
  summary: string;
  recommendations: string[];
  dti_ratio: number;
  confirm_with_lender: boolean;
}

export interface Lender {
  code: string;
  name: string;
}

export interface LenderDocumentRequirement {
  doc_type: string;
  rule_type: string;
  months_required?: number;
  accepted_any_of?: string[];
  min_age?: number;
  count_required?: number;
}

export interface LenderDocumentsResponse {
  lender_code: string;
  lender_name: string;
  employment_type: string;
  documents: LenderDocumentRequirement[];
}

export interface DocumentValidationResponse {
  valid: boolean;
  lender: string;
  employment_type: string;
  results?: {
    doc_type: string;
    valid: boolean;
    issues?: string[];
    resolution_paths?: string[];
  }[];
  issues?: string[];
  resolution_paths?: string[];
  confirm_with_lender?: boolean;
  engine_note?: string;
}

const getBaseUrl = () => {
  return "https://ai.myvanessa.ai";
};

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const body: Record<string, any> = {
    question: data.question,
    lender_code: data.lender_code || "general",
    user_id: data.user_id || "guest",
    property_intent: data.property_intent || "buy_existing",
  };
  if (data.session_id) {
    body.session_id = data.session_id;
  }
  const response = await fetch(`${getBaseUrl()}/api/v1/chatbot/chat`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json();
};

export const sendOnboardingMessage = async (
  data: OnboardingChatRequest
): Promise<OnboardingChatResponse> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/chatbot/onboarding`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Onboarding Chat API error: ${response.statusText}`);
  }

  return response.json();
};

export const getChatHistory = async (
  userId: string,
  limit = 20
): Promise<ChatHistoryResponse> => {
  const response = await fetch(
    `${getBaseUrl()}/api/v1/chatbot/user/${encodeURIComponent(userId)}/chat-history?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Chat History API error: ${response.statusText}`);
  }

  return response.json();
};

export const truncateChatSession = async (
  sessionId: string,
  fromIndex: number
): Promise<{ message?: string; truncated_count?: number }> => {
  const response = await fetch(
    `${getBaseUrl()}/api/v1/chatbot/session/${encodeURIComponent(sessionId)}/truncate?from_index=${fromIndex}`,
    {
      method: "PATCH",
      headers: {
        "accept": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Truncate Session API error: ${response.statusText}`);
  }

  return response.json();
};

export const getFinancialAssessment = async (
  data: FinancialAssessmentRequest
): Promise<FinancialAssessmentResponse> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/chatbot/financial-assessment`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Financial Assessment API error: ${response.statusText}`);
  }

  return response.json();
};

export const getLendersList = async (): Promise<{ lenders: Lender[] }> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/document/lenders`, {
    method: "GET",
    headers: {
      "accept": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Get Lenders API error: ${response.statusText}`);
  }
  return response.json();
};

export const getLenderDocuments = async (
  lenderCode: string,
  employmentType?: string
): Promise<LenderDocumentsResponse> => {
  const url = new URL(`${getBaseUrl()}/api/v1/document/lenders/${lenderCode}/documents`);
  if (employmentType) {
    url.searchParams.append("employment_type", employmentType);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "accept": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Get Lender Documents API error: ${response.statusText}`);
  }
  return response.json();
};

export interface UserDocument {
  id: string;
  name: string;
  url: string;
  note?: string | null;
  status?: string;
  last_updated?: string;
  created_at?: string;
  lender_code?: string;
  doc_type: string;
  validation_status?: string;
  is_legible?: boolean;
  used_ocr?: boolean;
  validation_result?: {
    valid: boolean;
    issues?: string[];
    doc_type?: string;
    resolution_paths?: string[];
    lender?: string;
    results?: {
      doc_type: string;
      valid: boolean;
      issues?: string[];
      resolution_paths?: string[];
    }[];
  };
}

export interface UserDocumentsResponse {
  user_id: string;
  total: number;
  documents: UserDocument[];
}

export const validateDocuments = async (formData: FormData): Promise<DocumentValidationResponse> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/document/validate`, {
    method: "POST",
    headers: {
      "accept": "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Validate Documents API error: ${response.statusText}`);
  }

  return response.json();
};

export const getUserDocuments = async (userId: string): Promise<UserDocumentsResponse> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/document/user/${userId}/documents`, {
    method: "GET",
    headers: {
      "accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Get User Documents API error: ${response.statusText}`);
  }

  return response.json();
};

export const deleteDocument = async (documentId: string, userId?: string): Promise<{ success: boolean; message?: string }> => {
  const url = userId
    ? `${getBaseUrl()}/api/v1/document/${documentId}?user_id=${encodeURIComponent(userId)}`
    : `${getBaseUrl()}/api/v1/document/${documentId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Delete Document API error: ${response.statusText}`);
  }

  return response.json();
};

