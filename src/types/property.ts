export interface Property {
  id: string;
  title: string;
  location: string;
  statusTag: string;
  categoryTag: string;
  image: string;
  gallery?: string[];
  description: string;
  fullDescription?: string;
  listedPrice: string;
  area: string;
  type: string;
  mutualSource: {
    name: string;
    description: string;
    role?: string;
  };
  keyDetails?: { label: string; value: string }[];
  highlights: string[];
  considerations: string[];
  features?: string[];
  financials?: {
    investmentBreakdown: { label: string; value: string; details?: string }[];
    ongoingCosts: { label: string; value: string; details?: string }[];
    investmentStructure: string;
    projectedReturns: string;
    taxIncentives: string;
  };
  timeline?: { label: string; value: string; details?: string }[];
  legalConsiderations?: string[];
  localContext?: {
    marketTrends: string;
    communityInfo: string;
    infrastructure: string;
  };
  investmentRange?: {
    min: string;
    max: string;
  };
  vettedBy?: string;
}
