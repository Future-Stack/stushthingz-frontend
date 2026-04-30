import React, { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, SquarePen } from "lucide-react";
import AddPropertyModal from "../modals/AddPropertyModal";
import WarningModal from "../modals/WarningModal";
import { MOCK_PROPERTIES } from "../../../../data/mockProperties";
import { Property } from "../../../../types/property";

const PropertiesTab: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleOpenAddModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProperty) {
      setProperties(prev => prev.filter(p => p.id !== selectedProperty.id));
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleSaveProperty = (data: any) => {
    if (selectedProperty) {
      // Edit mode
      setProperties(prev => prev.map(p => p.id === selectedProperty.id ? { ...p, ...data } : p));
    } else {
      // Add mode
      const newProperty: Property = {
        id: String(Date.now()),
        ...data,
        statusTag: "Available",
      };
      setProperties(prev => [newProperty, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[14px] p-7">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-xl font-bold text-color-jet-black">Property Management</h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-color-main hover:bg-[#b5156a] text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">Add Property</span>
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin pb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#0000001A]">
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Title</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Location</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Type</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Price Range</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Status</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50/40 transition-colors border-b border-b-[#0000001A]">
                <td className="py-6 font-semibold text-color-jet-black text-sm whitespace-nowrap">{property.title}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">{property.location}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">{property.type}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">{property.listedPrice}</td>
                <td className="py-6 whitespace-nowrap">
                  <span className={`text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${
                    property.statusTag === "Funded" ? "bg-blue-500" : "bg-[#22C55E]"
                  }`}>
                    {property.statusTag}
                  </span>
                </td>
                <td className="py-6 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleOpenEditModal(property)}
                      className="p-2 text-color-jet-black hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer border border-gray-100"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRequest(property)}
                      className="p-2 text-[#E7000B] hover:bg-red-50 rounded-lg transition-all cursor-pointer border border-[#EF4444]/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-12 gap-6">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group">
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-sm font-bold bg-[#E6F0FF] text-[#0066FF] rounded-xl cursor-pointer">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
            3
          </button>
          <span className="text-gray-300 px-1 font-medium">...</span>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group">
          <span>Next</span>
          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedProperty}
        onSubmit={handleSaveProperty}
      />

      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Property?"
        message={`Are you sure you want to delete "${selectedProperty?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Property"
      />
    </div>
  );
};

export default PropertiesTab;


