import React from "react";
import { TrendingUp } from "lucide-react";

// ─── Properties Tab ───────────────────────────────────────────────────────────
// Properties content will be provided later. This component is a placeholder.
// Replace the inner JSX with your actual property management UI.
// ─────────────────────────────────────────────────────────────────────────────

const PropertiesTab: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Property Management</h2>
      </div>

      {/* Placeholder — replace this section with real property management UI */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp size={30} className="text-color-main" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-1">
          Properties Coming Soon
        </h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Property management UI will be added here. Please provide the property
          requirements to build this section.
        </p>
      </div>
    </div>
  );
};

export default PropertiesTab;
