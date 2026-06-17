import React, { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, SquarePen } from "lucide-react";
import AddPropertyModal from "../modals/AddPropertyModal";
import WarningModal from "../modals/WarningModal";
import { Property } from "../../../../types/property";
import { useGetPropertiesQuery, useDeletePropertyMutation } from "../../../../store/api/propertyApi";

const PropertiesTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetPropertiesQuery({ page: currentPage, limit: 10 });
  const [deleteProperty] = useDeletePropertyMutation();

  const properties = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;

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

  const confirmDelete = async () => {
    if (selectedProperty) {
      try {
        await deleteProperty(selectedProperty.id).unwrap();
        setIsDeleteModalOpen(false);
        setSelectedProperty(null);
      } catch (err) {
        console.error("Failed to delete property", err);
      }
    }
  };

  return (
    <div className="bg-white p-7 border border-gray-200 rounded-[14px]">
      <div className="flex justify-between items-center mb-12">
        <h2 className="font-bold text-color-jet-black text-xl">Property Management</h2>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-color-main hover:bg-[#b5156a] px-3 py-2 rounded-lg font-bold text-white transition-all cursor-pointer"
        >
          <Plus size={20} />
          <span className="font-medium text-sm">Add Property</span>
        </button>
      </div>

      <div className="pb-4 overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-[#0000001A] border-b">
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Title</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Location</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Type</th>
              <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Price Range</th>
              {/* <th className="pb-5 font-semibold text-gray-800 text-sm whitespace-nowrap">Status</th> */}
              <th className="pb-5 font-semibold text-gray-800 text-sm text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-6 text-gray-500 text-center">Loading properties...</td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-gray-500 text-center">No properties found.</td>
              </tr>
            ) : properties.map((property: Property) => (
              <tr key={property.id} className="hover:bg-gray-50/40 border-b border-b-[#0000001A] transition-colors">
                <td className="py-6 font-semibold text-color-jet-black text-sm whitespace-nowrap">{property.title}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">{property.location}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">{property.type}</td>
                <td className="py-6 font-normal text-color-jet-black text-sm whitespace-nowrap">
                  {property.priceRangeLower} - {property.priceRangeUpper}
                </td>
                {/* <td className="py-6 whitespace-nowrap">
                  <span className={`text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${
                    (property.developmentStatus || property.statusTag) === "Funded" ? "bg-blue-500" : "bg-[#22C55E]"
                  }`}>
                    {property.developmentStatus || property.statusTag}
                  </span>
                </td> */}
                <td className="py-6 whitespace-nowrap">
                  <div className="flex justify-center items-center gap-3">
                    <button 
                      onClick={() => handleOpenEditModal(property)}
                      className="hover:bg-gray-100 p-2 border border-gray-100 rounded-lg text-color-jet-black hover:text-gray-900 transition-all cursor-pointer"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRequest(property)}
                      className="hover:bg-red-50 p-2 border border-[#EF4444]/10 rounded-lg text-[#E7000B] transition-all cursor-pointer"
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="group flex items-center gap-1 disabled:opacity-50 font-medium text-gray-500 hover:text-gray-900 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded-xl transition-all cursor-pointer ${
                    currentPage === page 
                      ? "font-bold bg-[#E6F0FF] text-[#0066FF]" 
                      : "font-medium text-gray-500 hover:bg-gray-50"
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
            className="group flex items-center gap-1 disabled:opacity-50 font-medium text-gray-500 hover:text-gray-900 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedProperty}
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


