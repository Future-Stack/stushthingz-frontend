import React, { useState } from "react";
import {
  ChevronLeft,
  MapPin,
  ShieldCheck,
  FileText,
  Users,
  CheckCircle2,
  Info,
  TrendingUp,
  Clock,
  Gavel,
  ChevronRight,
  CircleAlert,
  Scale
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PropertyTabs from "./components/PropertyTabs";
import { MOCK_PROPERTIES } from "../../data/mockProperties";

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="w-full max-w-7xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link to="/investor/opportunities" className="bg-color-main text-white px-6 py-3 rounded-xl font-semibold">
          Back to Opportunities
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "financials", label: "Financials" },
    { id: "legal", label: "Legal & Context" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-0">
      {/* Back Button */}
      <Link to="/investor/opportunities" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-color-jet-black mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Properties
      </Link>

      {/* Hero Section - Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden aspect-21/9 mb-8 group">
        <img
          src={property.gallery?.[currentImageIndex] || property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gallery Overlay UI */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent flex flex-col justify-between p-6">
          {/* <div className="flex justify-between items-start">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
              <Link to="/investor/opportunities" className="text-sm font-semibold text-[#212a31] flex items-center gap-1.5">
                 <ChevronLeft size={16} /> Back to Properties
              </Link>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                <Heart size={20} className="text-gray-400" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                <Share2 size={20} className="text-gray-400" />
              </button>
            </div>
          </div> */}

          <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 p-6">
            {property.gallery && property.gallery.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : property.gallery!.length - 1))}
                  className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev < property.gallery!.length - 1 ? prev + 1 : 0))}
                  className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            {property.gallery && (
              <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full ml-auto">
                {currentImageIndex + 1} / {property.gallery.length}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-color-main">
                <FileText size={20} />
              </div>
              <h1 className="text-4xl md:text-4xl font-bold text-color-jet-black">{property.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#4A5565] text-lg">
              <p className="flex items-center gap-1.5 font-medium">
                <MapPin size={18} className="text-gray-400" />
                {property.location}
              </p>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden md:block"></span>
              <span className="px-3 py-1 text-color-jet-black text-base font-medium rounded-lg border border-[#0000001A] tracking-wider">
                {property.categoryTag}
              </span>
            </div>

            {/* Vetted Source Box */}
            <div className="bg-[#F0FDF4] border-2 border-[#B9F8CF] rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-[#0D542B] font-bold text-lg">
                  <ShieldCheck size={24} className="text-[#008236]" />
                  <span>Vetted Source: {property.mutualSource.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#016630] text-base font-semibold">{property.mutualSource.role}—</span>
                  <span className="text-[#016630] text-base font-normal">{property.mutualSource.description}</span>
                </div>
                <p className="text-[#0D542B] text-base font-normal leading-relaxed max-w-3xl">
                  {property.fullDescription.split('.')[0]}. This partnership ensures full regulatory compliance, expedited permitting, and access to municipal infrastructure planning. The Council has committed to maintaining road access and supporting community development initiatives within the project.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="sticky top-22 z-30 py-4 -mx-4 px-4">
            <PropertyTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "overview" && (
              <>
                {/* Opportunity Description */}
                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-4">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <FileText size={20} className="text-color-main" /> Opportunity Description
                  </h3>
                  <p className="text-[#364153] leading-relaxed text-base font-normal">
                    {property.fullDescription}
                  </p>
                </section>

                {/* Key Details Grid */}
                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-6">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <Info size={20} className="text-color-main" /> Key Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {property.keyDetails?.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-base font-medium text-[#4A5565]">{detail.label}</span>
                        <span className={`text-base font-semibold ${detail.label === 'Price Range' ? 'text-color-main' : 'text-color-jet-black'}`}>
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Key Highlights */}
                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-6">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <TrendingUp size={20} className="text-color-main" /> Key Highlights
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-color-main shrink-0 mt-0.5" />
                        <span className="text-base text-[#364153] font-normal">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Diaspora Considerations */}
                <section className="bg-[#FDF2F8] border border-[#FCCEE8] rounded-2xl p-3 md:p-6 space-y-6">
                  <h3 className="text-xl font-bold text-[#101828] flex items-center gap-2">
                    <Users size={24} className="text-color-main" /> Diaspora Investor Considerations
                  </h3>
                  <p className="text-sm text-[#4A5565] font-normal mb-4">
                    Practical guidance for international investors based on common questions and concerns:
                  </p>
                  <ul className="space-y-4">
                    {property.considerations.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CircleAlert size={18} className="text-color-main shrink-0 mt-0.5" />
                        <span className="text-sm text-[#4A5565] font-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {activeTab === "features" && (
              <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-8">
                <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-color-main" /> Included Features & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-color-main shrink-0" />
                      <span className="text-base text-[#364153] font-normal">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "financials" && property.financials && (
              <div className="space-y-8">
                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-3">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <TrendingUp size={24} className="text-color-main" /> Investment Breakdown
                  </h3>

                  <div className="space-y-3">
                    {property.financials.investmentBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-base font-semibold text-[#101828]">{item.label}</p>
                        <p className="text-sm text-gray-600 font-normal leading-relaxed">{item.details}</p>
                        <div className="h-px bg-gray-100 w-full mt-4"></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <p className="text-base font-semibold text-color-jet-black">Ongoing Costs</p>
                    <ul className="space-y-3">
                      {property.financials.ongoingCosts.map((cost, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-color-main font-bold w-2 h-2 bg-color-main rounded-full"></span>
                          <p className="text-base text-gray-600 font-normal">
                            <span className="font-semibold text-gray-700">{cost.label}:</span> {cost.value}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="h-px bg-gray-100 w-full mt-4"></div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-base font-semibold text-color-jet-black">Investment Structure</p>
                    <p className="text-sm text-gray-600 font-normal leading-relaxed">{property.financials.investmentStructure}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="bg-[#F0FDF4] border border-[#B9F8CF] rounded-xl p-4 flex gap-3 items-start">
                      <TrendingUp size={20} className="text-[#008236] shrink-0" />
                      <div>
                        <p className="text-base font-semibold text-[#0D542B] mb-1">Projected Returns</p>
                        <p className="text-base text-[#016630] font-normal leading-relaxed">{property.financials.projectedReturns}</p>
                      </div>
                    </div>
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex gap-3 items-start">
                      <FileText size={20} className="text-[#155DFC] shrink-0 mt-1" />
                      <div>
                        <p className="text-lg font-semibold text-[#1E40AF] mb-1">Tax Incentives</p>
                        <p className="text-base text-[#1E40AF] font-normal leading-relaxed">{property.financials.taxIncentives}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-6">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <Clock size={24} className="text-color-main" /> Timeline
                  </h3>
                  <div className="space-y-6">
                    {property.timeline?.map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <p className="text-sm font-semibold text-[#4A5565] uppercase tracking-wider">{item.label}</p>
                        <p className="text-base font-normal text-[#101828]">{item.value}</p>
                        {item.details && <p className="text-sm text-gray-600 font-normal">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "legal" && (
              <div className="space-y-8">
                <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-6">
                  <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                    <Scale size={24} className="text-color-main" /> Legal Considerations
                  </h3>
                  <p className="text-sm text-[#4A5565] font-normal italic">
                    Important legal and regulatory information for this investment:
                  </p>
                  <ul className="space-y-3">
                    {property.legalConsiderations?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-[#F9FAFB] px-3 py-3.5 rounded-[10px]">
                        <Scale size={18} className="text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-[#364153]font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#6A7282] font-normal">
                    Note: Always consult with a licensed Jamaica attorney before finalizing any property transaction.
                  </p>
                </section>

                {property.localContext && (
                  <section className="bg-white border border-[#919EAB] rounded-[14px] p-3 md:p-6 space-y-8">
                    <h3 className="text-xl font-bold text-color-jet-black flex items-center gap-2">
                      <MapPin size={24} className="text-color-main" /> Local Context
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-color-jet-black">Market Trends</p>
                        <p className="text-sm text-gray-600 font-normal leading-relaxed">{property.localContext.marketTrends}</p>
                        <div className="h-px bg-gray-100 w-full mt-4"></div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-bold text-color-jet-black">Community Information</p>
                        <p className="text-sm text-gray-600 font-normal leading-relaxed">{property.localContext.communityInfo}</p>
                        <div className="h-px bg-gray-100 w-full mt-4"></div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-bold text-color-jet-black">Infrastructure & Amenities</p>
                        <p className="text-sm text-gray-600 font-normal leading-relaxed">{property.localContext.infrastructure}</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white border-2 border-[#919EAB] rounded-[14px] p-3 md:p-6 shadow-sm sticky top-24">
            <div className="space-y-1 mb-6">
              <p className="text-sm font-semibold text-[#4A5565] mb-1.5">Investment Range</p>
              <p className="text-3xl font-bold text-color-main">
                {property.investmentRange ? `${property.investmentRange.min} - ${property.investmentRange.max}` : property.listedPrice}
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-color-main hover:bg-[#c2185b] text-white py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-pink-100 cursor-pointer">
                <FileText size={18} /> Express Interest
              </button>
              <button className="w-full bg-white border-2 border-color-main text-color-main hover:bg-pink-50 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer">
                Request More Information
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-[#4A5565] font-semibold">
                <ShieldCheck size={18} className="text-[#00A859]" />
                <span>Vetted by {property.vettedBy}</span>
              </div>
              <p className="text-[12px] text-[#4A5565] mt-2 leading-relaxed">
                This opportunity has been sourced and verified through Vanessa's trusted partner network.
              </p>
            </div>
          </div>

          {/* What Happens Next Card */}
          <div className="bg-[#FDF2F8] border border-color-main rounded-[14px] p-3 md:p-6 space-y-6">
            <h4 className="text-lg font-bold text-color-jet-black flex items-center gap-2">
              <Clock size={20} className="text-color-main" /> What Happens Next
            </h4>
            <div className="space-y-4">
              {[
                "Express your interest and we'll connect you directly with the vetted source",
                "Receive detailed documentation and schedule a call to discuss specifics",
                "Vanessa guides you through due diligence and closing process"
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-color-main text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700 font-normal leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Source Partner Card */}
          <div className="bg-white border border-[#919EAB] rounded-[14px] p-5 space-y-4">
            <p className="text-base font-medium text-color-jet-black uppercase tracking-widest">Source Partner</p>
            <div className="space-y-2">
              <p className="text-base font-semibold text-color-jet-black leading-tight">{property.mutualSource.name}</p>
              <p className="text-sm text-[#4A5565] font-normal">{property.mutualSource.role}</p>
            </div>
            <p className="text-xs text-[#6A7282] font-normal pt-2 border-t border-[#0000001A]">
              Contact details shared after expressing interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
