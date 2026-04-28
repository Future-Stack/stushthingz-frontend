import { Property } from "../types/property";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "green-valley",
    title: "Green Valley Development Project",
    location: "Portland • Portland Parish",
    statusTag: "Available",
    categoryTag: "Residential Development",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687940-c52af036999b?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "The Green Valley Development Project represents a unique opportunity to participate in Jamaica's first fully sustainable residential community.",
    fullDescription: "The Green Valley Development Project represents a unique opportunity to participate in Jamaica's first fully sustainable residential community. Developed in partnership with Portland Parish Council's Development Committee, this 15-lot project is designed for environmentally conscious investors seeking both a personal retreat and a meaningful contribution to sustainable development in Jamaica. Each lot comes pre-approved for infrastructure connections including solar grid integration, fiber optic internet, and sustainable water management systems. The development is positioned to attract eco-conscious buyers and renters, with strong interest from the growing remote work and wellness tourism markets.",
    listedPrice: "$180,000 - $250,000",
    area: "0.25 - 0.5 acres per lot",
    type: "Development Land",
    mutualSource: {
      name: "Portland Parish Council Development Committee",
      description: "Official municipal development partner since 2024",
      role: "Local Government Partnership"
    },
    keyDetails: [
      { label: "Investment Type", value: "Development Land" },
      { label: "Size", value: "0.25 - 0.5 acres per lot" },
      { label: "Price Range", value: "$180,000 - $250,000" },
      { label: "Availability", value: "4 lots currently available, 2 more releasing in May 2026" }
    ],
    highlights: [
      "Pre-approved infrastructure connections (solar, fiber, water)",
      "Title insurance included in purchase price",
      "Community managed by elected local board",
      "Architectural covenants ensure property values",
      "Adjacent to Portland's Blue Mountains trail system",
      "15-minute drive to Port Antonio beaches"
    ],
    considerations: [
      "Remote closing process available via video notary in partnership with licensed Jamaica attorneys",
      "Quarterly development updates via email with photo documentation",
      "Local property management referrals provided by Parish Council",
      "Annual general meetings can be attended virtually",
      "Building permit assistance program for international investors",
      "Recommended contractor list with verified track records",
      "Currency exchange guidance through parish banking partners",
      "Property tax payments can be handled through automated bank draft",
      "Community WhatsApp group for real-time project updates",
      "On-site caretaker available for lot monitoring during construction"
    ],
    features: [
      "Individual lot sizes from 0.25 to 0.5 acres",
      "Solar panel infrastructure pre-installed on each lot",
      "Rainwater harvesting systems included",
      "Fiber optic internet to each plot",
      "Community composting and recycling center",
      "Shared organic garden spaces",
      "Electric vehicle charging stations (Phase 2)",
      "Natural spring water access rights",
      "Protected green buffer zones",
      "Hiking trail connections to Blue Mountains",
      "Community center with workspace facilities (planned)",
      "Security gate with eco-friendly lighting"
    ],
    financials: {
      investmentBreakdown: [
        { 
          label: "Price Details", 
          value: "$180,000 - $250,000 USD", 
          details: "$180,000 - $250,000 USD depending on lot size and position. Corner lots and those with premium views command higher pricing." 
        },
        { 
          label: "Estimated Closing Costs", 
          value: "12-15% of purchase price", 
          details: "12-15% of purchase price, including: transfer tax (5%), legal fees (2-3%), stamp duty (1%), title insurance (1%), surveying costs (~$1,500)" 
        }
      ],
      ongoingCosts: [
        { label: "Property tax", value: "Approximately $800-1,200 annually depending on lot size" },
        { label: "Community association fees", value: "$600/year (covers road maintenance, security, common areas)" },
        { label: "Lot maintenance if not building immediately", value: "~$100/month for basic upkeep" }
      ],
      investmentStructure: "Purchase requires 10% deposit to reserve lot, 40% at contract signing, remaining 50% at closing (typically 90 days). Financing available through parish development program at competitive rates.",
      projectedReturns: "Developed lots in similar Portland communities have appreciated 8-12% annually over past 5 years. Built homes achieve 6-8% rental yields from wellness tourism market.",
      taxIncentives: "Eligible for residential development tax credits under Portland Parish Economic Development Program (up to 5% of development costs)"
    },
    timeline: [
      { label: "Current Availability", value: "4 lots currently available, 2 more releasing in May 2026" },
      { label: "Typical Closing Period", value: "90 days from contract execution" },
      { label: "Development Status", value: "Infrastructure installation 70% complete. Roads, utilities, and common areas expected completion by July 2026" }
    ],
    legalConsiderations: [
      "All lots come with clear title registered with Jamaica's National Land Agency",
      "Building covenants require eco-friendly construction standards (provided in detail)",
      "Minimum building timeline: must commence construction within 24 months of purchase",
      "Community association membership is mandatory (governs common area maintenance)",
      "No short-term vacation rentals (under 30 days) permitted per community bylaws",
      "Right of first refusal applies if selling within first 3 years (offered to other community members)"
    ],
    localContext: {
      marketTrends: "Portland Parish has seen significant growth in eco-tourism and wellness-focused development. Property values increased 45% from 2020-2025. Remote workers and international retirees are primary market drivers.",
      communityInfo: "Portland is known for its natural beauty, Blue Mountains access, and lower tourism density than Montego Bay or Negril. Strong expatriate community with active social groups. Local parish leadership is pro-development with sustainability focus.",
      infrastructure: "Main highway recently upgraded. High-speed fiber internet available. Portland Parish Hospital 20 minutes away. International schools within 30-minute drive. Farmers markets and local provisions readily accessible."
    },
    investmentRange: {
      min: "$180,000",
      max: "$250,000"
    },
    vettedBy: "Vanessa"
  },
  {
    id: "kingston-tech-hub",
    title: "Kingston Tech Hub Mixed-Use",
    location: "Kingston • Kingston Parish",
    statusTag: "New Listing",
    categoryTag: "Commercial Investment",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Ground-floor commercial with residential units above in emerging tech corridor. Partnership with Kingston Business Association.",
    fullDescription: "The Kingston Tech Hub is a premier mixed-use development situated in the heart of Kingston's rapidly growing innovation district. This property features premium ground-floor retail and coworking spaces, complemented by modern residential lofts above. In partnership with the Kingston Business Development Association, this project is designed to foster a vibrant ecosystem for tech startups, creative professionals, and digital nomads. Residents and commercial tenants alike will benefit from state-of-the-art infrastructure and a strategic location that places them at the center of Jamaica's digital transformation.",
    listedPrice: "$580,000 - $720,000",
    area: "5,200 sq ft total",
    type: "Mixed-Use",
    mutualSource: {
      name: "Kingston Business Development Association",
      description: "Business Development Organization • Economic development partner",
      role: "Commercial Partner"
    },
    keyDetails: [
      { label: "Investment Type", value: "Mixed-Use Commercial" },
      { label: "Total Area", value: "5,200 sq ft" },
      { label: "Price Range", value: "$580,000 - $720,000" },
      { label: "Unit Types", value: "3 Retail, 2 Coworking, 8 Residential Lofts" }
    ],
    highlights: [
      "Dual income streams: commercial + residential",
      "Tech hub tax incentives available",
      "Fiber optic infrastructure pre-installed",
      "High foot traffic from adjacent university campus",
      "Smart building management system included"
    ],
    considerations: [
      "Commercial leases handled by local business association",
      "Property management essential (referrals provided)",
      "Strong rental demand from international remote workers",
      "Parking available on-site (limited slots)"
    ],
    features: [
      "High-speed fiber optic backbone",
      "24/7 security with biometric access",
      "Rooftop lounge and networking area",
      "Shared conference facilities",
      "Energy-efficient glass facade",
      "Underground parking garage"
    ],
    financials: {
      investmentBreakdown: [
        { label: "Base Price", value: "$580,000 USD", details: "Starting price for standard units. Premium units with corner views start at $650,000." },
        { label: "Estimated Cap Rate", value: "7.5 - 9.2%", details: "Projected based on current market rental rates for commercial and residential units in the district." }
      ],
      ongoingCosts: [
        { label: "Property Tax", value: "$2,400 annually" },
        { label: "Maintenance Fund", value: "$300/month (covers shared facilities and security)" }
      ],
      investmentStructure: "Standard commercial terms apply. 15% deposit to secure, 35% on contract, balance on completion. Mortgage options available through partner banks.",
      projectedReturns: "Projected 12-15% total ROI including capital appreciation and rental yield over a 5-year horizon.",
      taxIncentives: "Qualifies for Urban Renewal Tax Relief (up to 33.3% tax credit on capital expenditure)."
    },
    timeline: [
      { label: "Construction Status", value: "95% complete. Interior fit-outs in progress." },
      { label: "Handover", value: "Estimated August 2026" }
    ],
    legalConsiderations: [
      "Zoned for mixed-use development",
      "Strata title registration in progress",
      "Compliance with commercial building codes verified"
    ],
    localContext: {
      marketTrends: "Kingston's tech sector has seen a 30% increase in startup density over the last 3 years.",
      communityInfo: "Located near leading educational institutions and regional corporate headquarters.",
      infrastructure: "Next to the new BRT corridor for easy commute."
    },
    investmentRange: {
      min: "$580,000",
      max: "$720,000"
    },
    vettedBy: "Vanessa"
  },
  {
    id: "negril-beach-land",
    title: "Negril Beach Community Land",
    location: "Westmoreland • Westmoreland Parish",
    statusTag: "Funded",
    categoryTag: "Rental Investment",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519046475824-ac1a341d98c8?q=80&w=2000&auto=format&fit=crop"
    ],
    description: "Fully-developed parcels in Negril ready for hotel build. Connected to all local utility lines.",
    fullDescription: "A rare opportunity to acquire shovel-ready development land on the world-famous Seven Mile Beach in Negril. These parcels are fully serviced with water, electricity, and sewage connections, making them ideal for boutique hotel or luxury villa developments. The project is backed by the Westmoreland Community Land Committee, ensuring community support and streamlined approval processes for tourism-based projects. With Negril's tourism rebounding strongly, this is a high-value asset for long-term rental income and capital growth.",
    listedPrice: "$300,000 - $450,000",
    area: "0.5 - 1.2 Acres",
    type: "Land",
    mutualSource: {
      name: "Westmoreland Community Land Committee",
      description: "Community Organization • Local development and land management",
      role: "Community Partner"
    },
    keyDetails: [
      { label: "Investment Type", value: "Tourism Land" },
      { label: "Parcel Size", value: "0.5 - 1.2 Acres" },
      { label: "Price Range", value: "$300,000 - $450,000" },
      { label: "Zoning", value: "Tourist/Resort Residential" }
    ],
    highlights: [
      "Clear title lines available immediately",
      "Connected to all local utility lines",
      "Health and safety clearances verified for hotel build",
      "Direct beach access or sea view parcels",
      "Environmental impact assessment completed"
    ],
    considerations: [
      "Coastal limits require specific construction standards",
      "Surge insurance required upon final build approval",
      "Visitor access to beach is public domain",
      "Local community labor requirements for construction"
    ],
    features: [
      "Direct Seven Mile Beach access",
      "Paved access roads",
      "Public sewage and water connections",
      "Fiber optic capability",
      "Mature tropical landscaping"
    ],
    financials: {
      investmentBreakdown: [
        { label: "Land Value", value: "$300,000+", details: "Based on current valuation of beachfront-adjacent parcels in Negril." }
      ],
      ongoingCosts: [
        { label: "Property Tax", value: "$1,200 annually" },
        { label: "Site Security", value: "$150/month" }
      ],
      investmentStructure: "Direct land purchase. 10% deposit, 90% on completion. Financing support for diaspora investors available.",
      projectedReturns: "10-12% annual appreciation in land value. 15%+ ROE upon development and operation.",
      taxIncentives: "Eligible for Hotel Incentives Act benefits (10-year tax holiday on operations)."
    },
    timeline: [
      { label: "Availability", value: "2 parcels remaining" },
      { label: "Closing", value: "60 days" }
    ],
    legalConsiderations: [
      "Freehold Title",
      "NEPA Environmental Approval Secured",
      "No pending litigation or boundary disputes"
    ],
    localContext: {
      marketTrends: "Negril remains the top destination for independent travelers and luxury villa rentals in Jamaica.",
      communityInfo: "Strong local business ecosystem with established tourism services.",
      infrastructure: "Negril highway upgrade project scheduled for 2027."
    },
    investmentRange: {
      min: "$300,000",
      max: "$450,000"
    },
    vettedBy: "Vanessa"
  }
];
