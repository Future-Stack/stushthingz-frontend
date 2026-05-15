import React from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface PropertyTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="w-full bg-[#ECECF0] p-1 rounded-full flex overflow-x-auto scrollbar-none md:overflow-y-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex-1 py-1 px-2 rounded-full text-sm font-medium text-color-jet-black transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
              ? ""
              : "hover:text-color-jet-black hover:bg-white/50"
            }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PropertyTabs;
