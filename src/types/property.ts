export interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  sizeArea: number;
  description: string;
  priceRangeUpper: string;
  priceRangeLower: string;
  estimatedClosingCost: string;
  priceDetails: string;
  closingCostBreakdown: string;
  investmentStructure: string;
  projectedReturns: string;
  taxIncentives: string;
  currenyAvailability: string;
  typicalClosingPeriod: string;
  developmentStatus: string;
  keyHighlights: { id?: string; propertyId?: string; content: string }[];
  diasporaInvestorConsiderations: { id?: string; propertyId?: string; content: string }[];
  propertyFeatures: { id?: string; propertyId?: string; content: string }[];
  ongoingCost: { id?: string; propertyId?: string; content: string }[];
  legalConsiderations: { id?: string; propertyId?: string; content: string }[];
  localContext: { id?: string; propertyId?: string; title: string; description: string }[];
  propertyImages: { id?: string; propertyId?: string; url: string }[];
  isFavourite?: boolean;
  
  // UI-specific optional fields (might not be from backend yet)
  statusTag?: string;
  categoryTag?: string;
  mutualSource?: {
    name: string;
    description: string;
    role?: string;
  };
  vettedBy?: string;
}

export interface WishlistProperty {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
}
