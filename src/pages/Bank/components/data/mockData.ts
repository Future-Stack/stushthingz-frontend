export type Readiness = "Ready" | "Almost Ready" | "Not Ready";
export type ApplicationStatus = "Under Review" | "Need More Info" | "Approved" | "Rejected";

export interface InvestorApplication {
  id: string;
  name: string;
  country: string;
  readiness: Readiness;
  budget: string;
  status: ApplicationStatus;
  lastUpdated: string;
}

export const investorsData: InvestorApplication[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    country: "United States",
    readiness: "Ready",
    budget: "$200,000 - $350,000",
    status: "Under Review",
    lastUpdated: "2026-04-14",
  },
  {
    id: "2",
    name: "Michael Chen",
    country: "Canada",
    readiness: "Almost Ready",
    budget: "$150,000 - $250,000",
    status: "Need More Info",
    lastUpdated: "2026-04-13",
  },
  {
    id: "3",
    name: "Emma Thompson",
    country: "United Kingdom",
    readiness: "Ready",
    budget: "$300,000 - $500,000",
    status: "Approved",
    lastUpdated: "2026-04-12",
  },
  {
    id: "4",
    name: "James Wilson",
    country: "United States",
    readiness: "Not Ready",
    budget: "$100,000 - $200,000",
    status: "Rejected",
    lastUpdated: "2026-04-10",
  },
];

export interface InvestorProfileDetails {
  id: string;
  overview: {
    fullName: string;
    country: string;
    investmentGoal: string;
    budgetRange: string;
    timeline: string;
    readinessStatus: string;
    applicationStatus: ApplicationStatus;
  };
  financial: {
    monthlyIncome: string;
    savingsAvailable: string;
    debtObligations: string;
    investmentBudget: string;
  };
  documents: {
    id: string;
    name: string;
    status: "Uploaded" | "Missing";
    uploadedDate?: string;
  }[];
  activityLog: {
    id: string;
    author: string;
    date: string;
    content: string;
  }[];
}

export const mockProfileData: Record<string, InvestorProfileDetails> = {
  "1": {
    id: "1",
    overview: {
      fullName: "Sarah Johnson",
      country: "United States",
      investmentGoal: "Vacation Home & Rental",
      budgetRange: "$200,000 - $350,000",
      timeline: "6-12 months",
      readinessStatus: "80% Ready",
      applicationStatus: "Under Review",
    },
    financial: {
      monthlyIncome: "$85,000/year",
      savingsAvailable: "$75,000",
      debtObligations: "$15,000",
      investmentBudget: "$200,000 - $350,000",
    },
    documents: [
      { id: "d1", name: "Valid Passport", status: "Uploaded", uploadedDate: "2026-04-10" },
      { id: "d2", name: "Proof of Address", status: "Missing" },
      { id: "d3", name: "Bank Statements (6 months)", status: "Uploaded", uploadedDate: "2026-04-12" },
      { id: "d4", name: "Tax Returns (2 years)", status: "Missing" },
      { id: "d5", name: "Employment Letter", status: "Uploaded", uploadedDate: "2026-04-11" },
      { id: "d6", name: "Credit Report", status: "Uploaded", uploadedDate: "2026-04-13" },
    ],
    activityLog: [
      {
        id: "a1",
        author: "John Smith (Bank Officer)",
        date: "2026-04-14 10:30 AM",
        content: "Changed status to Under Review",
      },
      {
        id: "a2",
        author: "System",
        date: "2026-04-13 2:15 PM",
        content: "New documents uploaded by investor",
      },
      {
        id: "a3",
        author: "Jane Doe (Bank Manager)",
        date: "2026-04-12 9:00 AM",
        content: "Note: Investor has strong financial profile. Recommend priority review.",
      },
    ],
  },
};
