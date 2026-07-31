export interface ChatRequest {
  question: string;
  lender_code?: string;
  user_id?: string;
  property_intent?: "buy_existing" | "build_develop";
}

export interface ChatResponse {
  answer: string;
}

export interface FinancialAssessmentRequest {
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
  return import.meta.env.VITE_AI_API_URL;
};

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`${getBaseUrl()}/api/v1/chatbot/chat`, {
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

