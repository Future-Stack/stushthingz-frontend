import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PropertyCard from "./components/PropertyCard";
import icon from "@/assets/home/watermark.png"
import { MOCK_PROPERTIES } from "../../data/mockProperties";
import { FaAngleDown } from "react-icons/fa";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  } as const;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-7xl mx-auto md:py-6 md:px-0 space-y-6"
    >

      {/* Header Banner */}
      <motion.div variants={itemVariants} className="bg-color-main rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 mt-5">
            <img src={icon} className="w-8 h-8 hidden md:block" alt="watermark" />
            <h1 className="text-3xl font-bold">Curated Investment Opportunities</h1>
          </div>
          <p className="text-[#FFFFFFE5] max-w-3xl text-sm md:text-lg">
            Exclusive access to vetted opportunities secured through our developers, bank partners, and curated local properties. Includes off-market and pre-listing assets through Vanessa's network.
          </p>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-auto">
              <select
                className="w-full appearance-none bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5 pr-12 text-gray-700 outline-none focus:border-[#d81b60] shadow-sm cursor-pointer"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {typeOptions.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <FaAngleDown className="text-gray-400" />
              </div>
            </div>
            <div className="relative flex-1 md:w-auto">
              <select
                className="w-full appearance-none bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5 pr-12 text-gray-700 outline-none focus:border-[#d81b60] shadow-sm cursor-pointer"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categoryOptions.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <FaAngleDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Properties List */}
      <motion.div variants={itemVariants} className="space-y-8">
        <AnimatePresence mode="wait">
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((prop) => (
              <motion.div key={prop.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PropertyCard property={prop} />
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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

    </motion.div>
  );
};

export default PropertyListing;
