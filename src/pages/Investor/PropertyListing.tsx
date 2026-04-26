import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import PropertyCard from "./components/PropertyCard";

export type Property = {
  id: string;
  title: string;
  location: string;
  statusTag: string;
  categoryTag: string;
  image: string;
  description: string;
  listedPrice: string;
  area: string;
  type: string;
  mutualSource: {
    name: string;
    description: string;
  };
  highlights: string[];
  considerations: string[];
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Kingston Tech Hub Mixed-Use",
    location: "Kingston • Kingston Parish",
    statusTag: "Available",
    categoryTag: "Commercial Investment",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    description: "Ground-floor commercial with residential units above in emerging tech corridor. Partnership with Kingston Business Association to attract startups and creative businesses.",
    listedPrice: "$580,000 - $720,000",
    area: "5,200 sq ft total",
    type: "Mixed-Use",
    mutualSource: {
      name: "Kingston Business Development Association",
      description: "Business Development Organization • Economic development partner with government backing"
    },
    highlights: [
      "Dual income streams: commercial + residential",
      "Tech hub tax incentives available",
      "Fiber optic infrastructure pre-installed"
    ],
    considerations: [
      "Property management essential (referrals provided)",
      "Commercial leases handled by local business association",
      "Strong rental demand from international remote workers"
    ]
  },
  {
    id: "prop-2",
    title: "Ocean Valley Development Project",
    location: "Portland • Portland Parish",
    statusTag: "New Listing",
    categoryTag: "Development Land",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
    description: "Expansive development land with pre-approved resort amenities. Excellent opportunity for coastal hospitality projects.",
    listedPrice: "$120,000 - $150,000",
    area: "15.5 - 17.5 acres approx",
    type: "Development Land",
    mutualSource: {
      name: "Portland Parish Council & Development Committee",
      description: "Local Government Organization • Infrastructure planning and approval"
    },
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
    id: "prop-3",
    title: "Ocho Rios Heritage Restoration",
    location: "Saint Ann • Saint Ann Parish",
    statusTag: "New Listing",
    categoryTag: "Heritage Property",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    description: "Historic estate available for restoration. Authorized historic tax incentives in the district.",
    listedPrice: "$450,000 (Base)",
    area: "5,000 sq ft (Estate)",
    type: "Residential",
    mutualSource: {
      name: "Jamaica National Heritage Trust",
      description: "Government Agency • Preservation and promotion of national heritage"
    },
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
    id: "prop-4",
    title: "Negril Beach Community Land",
    location: "Westmoreland • Westmoreland Parish",
    statusTag: "Funded",
    categoryTag: "Rental Investment",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop",
    description: "Fully-developed parcels in Negril ready for hotel build. Connected to all local utility lines.",
    listedPrice: "$300,000 - $400,000",
    area: "0.5 - 2.0 Acres",
    type: "Land",
    mutualSource: {
      name: "Westmoreland Community Land Committee",
      description: "Community Organization • Local development and land management"
    },
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
  }
];

const PropertyListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const ITEMS_PER_PAGE = 3;

  const typeOptions = ["All Types", "Land", "Development Land", "Residential", "Mixed-Use", "Agricultural"];
  const categoryOptions = ["All Categories", "Heritage Property", "Commercial Investment", "Rental Investment", "Agricultural Investment"];

  const filteredProperties = MOCK_PROPERTIES.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || prop.type === selectedType;
    const matchesCategory = selectedCategory === "All Categories" || prop.categoryTag === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

      {/* Search & Filters */}
      <div className="flex flex-col space-y-4">
        {/* Filters & Count */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, location, or keywords..."
              className="block w-full pl-10 pr-3 py-3 border border-[#00000000] rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#d81b60] focus:border-[#d81b60] sm:text-sm transition-shadow shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              className="flex-1 md:w-auto bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5 text-gray-700 outline-none focus:border-[#d81b60] shadow-sm cursor-pointer"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              {typeOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select
              className="flex-1 md:w-auto bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5 text-gray-700 outline-none focus:border-[#d81b60] shadow-sm cursor-pointer"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categoryOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div className="text-base font-normal text-[#4A5565] mt-3">
          Showing <span className="text-[#212a31] font-semibold">{filteredProperties.length}</span> curated opportunities
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-8">
        {paginatedProperties.length > 0 ? (
          paginatedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                    ? "bg-[#d81b60] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Footer Block */}
      <div className="bg-white border border-[#919EAB] rounded-2xl p-8 text-center">
        <h3 className="text-3xl font-bold text-color-jet-black mb-4">Ready to Schedule Viewings?</h3>
        <p className="text-[#4A5565] text-base font-normal mb-6 max-w-2xl mx-auto">
          Interested in an opportunity? Express your interest and our team will connect you with the right local contacts.
        </p>
      </div>

    </div>
  );
};

export default PropertyListing;
