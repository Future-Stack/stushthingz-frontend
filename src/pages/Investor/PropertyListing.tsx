import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, Phone, ShieldCheck } from "lucide-react";

type Property = {
  id: string;
  title: string;
  location: string;
  typeTag: string;
  isNew: boolean;
  isFunded?: boolean;
  image: string;
  listedPrice: string;
  area: string;
  type: string;
  mutualSource: string;
  highlights: string[];
  considerations: string[];
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Ocean Valley Development Project",
    location: "Portland | Off-market listing",
    typeTag: "Development Land",
    isNew: true,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
    listedPrice: "$120,000 - $150,000",
    area: "15.5 - 17.5 acres approx",
    type: "Development Land",
    mutualSource: "Portland Parish Council & Development Committee",
    highlights: [
      "Pre-approved hill-top resort amenities",
      "Title Searches successfully completed",
      "Tax Clearance secured for transfer"
    ],
    considerations: [
      "Minimum 20% downpayment required by institutions",
      "Access road requires paving & upgrades",
      "Coastal property; requires specific insurance"
    ]
  },
  {
    id: "prop-2",
    title: "Ocho Rios Heritage Restoration",
    location: "Saint Ann | Pre-listing asset",
    typeTag: "Heritage Property",
    isNew: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    listedPrice: "$450,000 (Base)",
    area: "5,000 sq ft (Estate)",
    type: "Residential",
    mutualSource: "Jamaica National Heritage Trust",
    highlights: [
      "Historic tax incentives authorized in district",
      "No structural damage upon inspection",
      "Premium rental rate approved"
    ],
    considerations: [
      "Building limits design modifications",
      "Heritage grants require occupancy within 1yr 3M",
      "Original structures limit standard security systems"
    ]
  },
  {
    id: "prop-3",
    title: "Negril Beach Community Land",
    location: "Negril | Fully-developed parcels",
    typeTag: "Land",
    isNew: false,
    isFunded: true,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop",
    listedPrice: "$300,000 - $400,000",
    area: "0.5 - 2.0 Acres",
    type: "Land",
    mutualSource: "Westmoreland Community Land Committee",
    highlights: [
      "Clear title lines available immediately",
      "Connected to all local utility lines",
      "Health and safety clearances verified for hotel build"
    ],
    considerations: [
      "Coastal limits require specific construction",
      "Surge insurance required upon final build approval",
      "Visitors access to beach is public domain"
    ]
  },
  {
    id: "prop-4",
    title: "Kingston Tech-Hub Mixed-Use",
    location: "Kingston | Progress Zone",
    typeTag: "Mixed-Use",
    isNew: false,
    isFunded: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    listedPrice: "$850,000 - $1,100,000",
    area: "12,000 sq ft Total",
    type: "Mixed-Use",
    mutualSource: "Kingston Business Development Association",
    highlights: [
      "Pre-fit for offices, retail shops, and lofts",
      "Title is unencumbered / clear",
      "Base site infrastructure approved"
    ],
    considerations: [
      "Security arrangements to meet specific tech-hub limits",
      "Commercial tax brackets may be adjusted near future",
      "Parking limits require further municipal modifications"
    ]
  }
];

const PropertyListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const typeOptions = ["All Types", "Land", "Development Land", "Residential", "Mixed-Use", "Agricultural"];
  const categoryOptions = ["All Categories", "Heritage Property", "Commercial Investment", "Rental Investment", "Agricultural Investment"];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-color-main rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 mt-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="currentColor" />
            </svg>
            <h1 className="text-3xl font-bold">Curated Investment Opportunities</h1>
          </div>
          <p className="text-[#FFFFFFE5] max-w-3xl text-sm md:text-lg">
            Exclusive access to vetted opportunities secured through our developers, bank partners, and curated local properties. Includes off-market and pre-listing assets through Vanessa's network.
          </p>
        </div>
      </div>

      {/* Filters & Count */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm font-medium text-gray-500">
          Showing <span className="text-[#212a31]">{MOCK_PROPERTIES.length}</span> curated opportunities for you
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select className="flex-1 md:w-auto bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#d81b60]">
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
          <select className="flex-1 md:w-auto bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#d81b60]">
            {typeOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select className="flex-1 md:w-auto bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-[#d81b60]">
            {categoryOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-6">
        {MOCK_PROPERTIES.map((prop) => (
          <div key={prop.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">

            {/* Image Section */}
            <div className="w-full md:w-[300px] h-[240px] md:h-auto relative flex-shrink-0">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                {prop.isNew && (
                  <span className="bg-[#d81b60] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    New Listing
                  </span>
                )}
                {prop.isFunded && (
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Funded
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-[#212a31]">{prop.title}</h3>
                <button className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {prop.location}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Listed Price</p>
                  <p className="text-sm font-bold text-[#d81b60]">{prop.listedPrice}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Area</p>
                  <p className="text-sm font-semibold text-[#212a31]">{prop.area}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-semibold text-[#212a31]">{prop.type}</p>
                </div>
              </div>

              {/* Mutual Source */}
              <div className="bg-green-50/50 border border-green-100 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm text-green-800">
                <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                <span><span className="font-semibold">Mutual Source:</span> {prop.mutualSource}</span>
              </div>

              {/* Highlights & Considerations Grid */}
              <div className="grid md:grid-cols-2 gap-4 flex-1">
                <div>
                  <h4 className="text-xs font-semibold text-[#212a31] flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={14} className="text-green-500" /> Key Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {prop.highlights.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#212a31] flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} className="text-yellow-500" /> Investment Considerations
                  </h4>
                  <ul className="space-y-1.5">
                    {prop.considerations.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-pink-400 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                  View Full Opportunity Post <ArrowRight size={16} />
                </button>
                <button className="px-6 border border-pink-200 text-[#d81b60] hover:bg-pink-50 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                  <Phone size={16} /> Request Callback
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${currentPage === page
                  ? "bg-[#d81b60] text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-gray-400 flex items-end pb-1">...</span>
          <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100">
            12
          </button>
        </div>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Footer Block */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center mt-8">
        <h3 className="text-xl font-bold text-[#212a31] mb-2">Ready to Schedule Viewings?</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
          Found an opportunity? Contact your dedicated portfolio manager to schedule viewings or get deeper financial analysis.
        </p>
        <button className="bg-[#212a31] text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Contact Portfolio Manager
        </button>
      </div>

    </div>
  );
};

export default PropertyListing;
