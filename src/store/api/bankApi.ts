import { baseAPI } from "./baseApi";

export type TBankApplicationStatus = "underReview" | "needMoreInfo" | "approved" | "rejected";
export type TDocumentStatus = "accepted" | "rejected" | "underReview" | "pending";
export type TReadiness = "ready" | "almostReady" | "notReady";

export type TBankDashboardQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
};

export type TBankApplication = {
  id: string;
  investorName: string;
  email: string;
  phone: string | null;
  country: string | null;
  readiness: TReadiness;
  readinessLabel: string;
  budget: string | null;
  investmentBudget: number | null;
  status: TBankApplicationStatus;
  statusLabel: string;
  selectedLender: string | null;
  investmentGoal: string | null;
  investmentTimeline: string | null;
  employmentType: string | null;
  propertyIntent: string | null;
  incomeIsVariable: boolean | null;
  documentsCount: number;
  lastUpdated: string;
};

export type TBankDashboardResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: {
    summary: {
      totalInvestors: number;
      ready: number;
      underReview: number;
      approved: number;
    };
    applications: TBankApplication[];
  };
};

export type TInvestorDocument = {
  id: string;
  name: string;
  url: string;
  note: string | null;
  status: TDocumentStatus;
  statusLabel: string;
  uploadedAt: string;
  lastUpdated: string;
  lenderCode: string | null;
  docType: string | null;
  validationStatus: string | null;
  isLegible: boolean | null;
  usedOcr: boolean | null;
  requiredDocument: string | null;
};

export type TActivityLog = {
  id: string;
  investorId: string;
  documentId: string | null;
  actorId: string | null;
  actorName: string | null;
  actorRole: string | null;
  title: string;
  description: string;
  type: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
};

export type TInvestorProfileData = {
  overview: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    countryOfResidence: string | null;
    investmentGoal: string | null;
    budgetRange: string | null;
    investmentBudget: number | null;
    timeline: string | null;
    readiness: TReadiness;
    readinessLabel: string;
    readinessScore: string;
    readinessPercentage: number;
    profileScore: string;
    applicationStatus: TBankApplicationStatus;
    applicationStatusLabel: string;
    selectedLender: string | null;
    lastUpdated: string;
  };
  financial: {
    investmentBudget: number | null;
    investmentBudgetLabel: string | null;
    investmentGoal: string | null;
    investmentTimeline: string | null;
    employmentType: string | null;
    propertyIntent: string | null;
    selectedLender: string | null;
    incomeIsVariable: boolean | null;
  };
  documents: {
    totalRequired: number;
    uploadedCount: number;
    completedRequiredCount: number;
    missingCount: number;
    statusCounts: {
      pending: number;
      underReview: number;
      accepted: number;
      rejected: number;
    };
    uploadedDocuments: TInvestorDocument[];
    missingDocuments: string[];
  };
  notes: {
    activityLog: TActivityLog[];
  };
};

export type TInvestorProfileResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TInvestorProfileData;
};

export type TUpdateDocumentStatusRequest = {
  id: string;
  body: {
    status: TDocumentStatus;
    note?: string;
  };
};

export type TUpdateDocumentStatusResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TInvestorDocument;
};

export const bankAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // GET /bank-portal/dashboard
    getBankDashboard: build.query<TBankDashboardResponse, TBankDashboardQueryParams>({
      query: (params) => ({
        url: "/bank-portal/dashboard",
        method: "GET",
        params,
      }),
      providesTags: ["BankPortal"],
    }),

    // GET /bank-portal/investors/:id
    getInvestorProfile: build.query<TInvestorProfileResponse, string>({
      query: (id) => ({
        url: `/bank-portal/investors/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "BankPortal", id }],
    }),

    // PATCH /bank-portal/documents/:id/status
    updateDocumentStatus: build.mutation<TUpdateDocumentStatusResponse, TUpdateDocumentStatusRequest>({
      query: ({ id, body }) => ({
        url: `/bank-portal/documents/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BankPortal"],
    }),
  }),
});

export const {
  useGetBankDashboardQuery,
  useLazyGetBankDashboardQuery,
  useGetInvestorProfileQuery,
  useLazyGetInvestorProfileQuery,
  useUpdateDocumentStatusMutation,
} = bankAPI;
