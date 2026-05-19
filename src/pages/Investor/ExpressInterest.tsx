import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import { MOCK_PROPERTIES } from "../../data/mockProperties";
import { useInterest } from "../../hooks/useInterest";
import PropertyCard from "./components/PropertyCard";

const ExpressInterest: React.FC = () => {
  const { interestedIds } = useInterest();
  
  // Filter MOCK_PROPERTIES to get only those that are in interestedIds
  const interestedProperties = MOCK_PROPERTIES.filter(prop => interestedIds.includes(prop.id));

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
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold text-color-jet-black">Express Interest</h1>
        <div className="flex items-center gap-1.5 text-color-main font-medium">
          <Sparkles size={16} />
          <span>
            {String(interestedProperties.length).padStart(2, "0")} Express Interest available
          </span>
        </div>
      </motion.div>

      {/* Properties List */}
      <motion.div variants={itemVariants} className="space-y-8">
        <AnimatePresence mode="popLayout">
          {interestedProperties.length > 0 ? (
            interestedProperties.map((prop) => (
              <motion.div 
                key={prop.id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard property={prop} isInterestPage={true} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="text-center py-20 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900">No properties in your interest list</h3>
              <p className="text-gray-500 max-w-md">
                Start browsing our investment opportunities and click "Express Interest" to add them to your list.
              </p>
              <Link 
                to="/investor/opportunities" 
                className="bg-color-main hover:bg-[#c2185b] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors inline-flex items-center gap-2 mt-4 cursor-pointer"
              >
                <Home size={16} /> Browse Opportunities
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ExpressInterest;
