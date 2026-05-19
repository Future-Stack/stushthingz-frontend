import React from "react";
import { MapPin, FileText, Users, AlertCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Property } from "../../../types/property";
import { useInterest } from "../../../hooks/useInterest";

interface PropertyCardProps {
  property: Property;
  isInterestPage?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isInterestPage = false }) => {
  const navigate = useNavigate();
  const { isInterested, toggleInterest } = useInterest();
  const interested = isInterested(property.id);

  return (
    <div className="bg-white border border-[#919EAB] rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm">
      {/* Image Section */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-[240px] lg:h-auto relative shrink-0">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          {property.statusTag && (
            <span className="bg-[#00A859] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
              {property.statusTag}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 lg:p-6 flex-1 flex flex-col">
        {/* Header (Title and Category Tag) */}
        <div className="flex justify-between items-start mb-1.5 gap-4">
          <h3 className="text-xl lg:text-2xl font-bold text-[#101828]">{property.title}</h3>
          {property.categoryTag && (
            <span className="text-xs font-medium text-color-jet-black bg-gray-50 border border-[#0000001A] px-2 py-0.5 rounded-lg whitespace-nowrap">
              {property.categoryTag}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="text-base font-medium text-[#4A5565] flex items-center gap-1.5 mb-3">
          <MapPin size={16} className="" />
          {property.location}
        </p>

        {/* Description */}
        <p className="text-base font-normal text-[#364153] mb-6 leading-relaxed">
          {property.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 bg-[#F9FAFB] rounded-[10px] p-4">
          <div>
            <p className="text-xs text-[#4A5565] font-normal mb-0.5">Price Range</p>
            <p className="text-sm lg:text-base font-semibold text-color-main">{property.listedPrice}</p>
          </div>
          <div>
            <p className="text-xs text-[#4A5565] font-normal mb-0.5">Size</p>
            <p className="text-sm lg:text-base font-semibold text-color-jet-black">{property.area}</p>
          </div>
          <div>
            <p className="text-xs text-[#4A5565] font-normal mb-0.5">Type</p>
            <p className="text-sm lg:text-base font-semibold text-color-jet-black">{property.type}</p>
          </div>
        </div>

        {/* Vetted Source */}
        <div className="bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px] p-4 mb-4">
          <div className="flex items-center gap-2 text-[#0D542B] font-semibold mb-1">
            <Shield size={20} className="text-[#008236]" />
            <span>Vetted Source: {property.mutualSource.name}</span>
          </div>
          <p className="text-sm text-[#016630] font-normal ml-6">
            {property.mutualSource.description}
          </p>
        </div>

        {/* Highlights & Considerations */}
        <div className="grid gap-6 flex-1 mb-6">
          {/* Highlights */}
          <div>
            <h4 className="text-sm font-semibold text-[#364153] flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-500" /> Key Highlights
            </h4>
            <ul className="space-y-2 ml-1">
              {property.highlights.map((item, idx) => (
                <li key={idx} className="text-sm text-[#364153] font-normal items-end flex gap-2">
                  <span className="text-color-main font-bold text-[8px]">●</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Considerations */}
          <div className="bg-[#FDF2F8] border border-[#FCCEE8] rounded-[10px] p-4">
            <h4 className="text-sm font-semibold text-[#101828] flex items-center gap-2 mb-3">
              <Users size={18} className="text-color-main" /> Diaspora Investor Considerations
            </h4>
            <ul className="space-y-2">
              {property.considerations.map((item, idx) => (
                <li key={idx} className="text-sm text-[#364153] font-normal flex items-center gap-2">
                  <AlertCircle size={14} className="text-color-main shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <button 
            onClick={() => navigate(`/investor/opportunities/${property.id}`)}
            className="flex-1 bg-color-main hover:bg-color-main/80 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileText size={16} /> View Full Opportunity Brief
          </button>
          {isInterestPage ? (
            <button 
              onClick={() => toggleInterest(property.id)}
              className="px-6 border border-color-main text-color-main hover:bg-pink-50 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              Remove from Interest
            </button>
          ) : (
            <button 
              onClick={() => toggleInterest(property.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 cursor-pointer ${
                interested 
                  ? "bg-color-main text-white hover:bg-color-main/80" 
                  : "border border-color-main text-color-main hover:bg-pink-50"
              }`}
            >
              {interested ? "Remove Interest" : "Express Interest"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
