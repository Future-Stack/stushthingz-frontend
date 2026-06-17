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
  ChevronRight,
  CircleAlert,
  Scale,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropertyTabs from "./components/PropertyTabs";
import { useGetPropertyByIdQuery, useToggleWishlistMutation } from "../../store/api/propertyApi";
import iconImg from "@/assets/home/icon.png"

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, isLoading, error } = useGetPropertyByIdQuery(id || "");
  const property = data?.data;

  const [toggleWishlist] = useToggleWishlistMutation();
  const interested = property?.isFavourite || false;

  const handleToggleInterest = async () => {
    if (!property) return;
    try {
      await toggleWishlist(property.id).unwrap();
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto px-4 py-20 w-full max-w-7xl text-center">
        <h2 className="mb-4 font-bold text-gray-900 text-2xl">Loading Property...</h2>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="mx-auto px-4 py-20 w-full max-w-7xl text-center">
        <h2 className="mb-4 font-bold text-gray-900 text-2xl">Property Not Found</h2>
        <p className="mb-8 text-gray-600">The property you are looking for does not exist or has been removed.</p>
        <Link to="/investor/opportunities" className="bg-color-main px-6 py-3 rounded-xl font-semibold text-white">
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

  const images = property.propertyImages?.map(img => img.url) || [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto md:px-0 md:py-6 w-full max-w-7xl"
    >
      {/* Back Button */}
      <Link to="/investor/opportunities" className="inline-flex items-center gap-2 mb-6 font-medium text-gray-600 hover:text-color-jet-black text-sm transition-colors">
        <ChevronLeft size={16} /> Back to Properties
      </Link>

      {/* Hero Section - Image Gallery */}
      <motion.div variants={itemVariants} className="group relative mb-8 rounded-2xl aspect-21/9 overflow-hidden">
        <img
          src={images[currentImageIndex] || ""}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gallery Overlay UI */}
        <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/40 to-transparent p-6">
          <div className="right-0 bottom-0 left-0 absolute flex justify-between items-center p-6">
            {images.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            {images.length > 0 && (
              <div className="bg-black/60 backdrop-blur-md ml-auto px-3 py-1 rounded-full font-medium text-white text-xs">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Header Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-pink-100 rounded-lg w-8 md:w-10 h-8 md:h-10 text-color-main">
                <FileText size={20} />
              </div>
              <h1 className="font-bold text-color-jet-black text-2xl md:text-4xl">{property.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#4A5565] text-lg">
              <p className="flex items-center gap-1.5 font-medium">
                <MapPin size={18} className="text-gray-400" />
                {property.location}
              </p>
              <span className="hidden md:block bg-gray-300 rounded-full w-1.5 h-1.5"></span>
              <span className="px-3 py-1 border border-[#0000001A] rounded-lg font-medium text-color-jet-black text-base tracking-wider">
                {property.categoryTag || property.type}
              </span>
            </div>

            {/* Vetted Source Box */}
            {property.mutualSource && (
              <div className="relative bg-[#F0FDF4] p-6 border-[#B9F8CF] border-2 rounded-2xl overflow-hidden">
                <div className="z-10 relative space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#0D542B] text-lg">
                    <ShieldCheck size={24} className="hidden md:block text-[#008236]" />
                    <span>Vetted Source: {property.mutualSource.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#016630] text-base">{property.mutualSource.role}—</span>
                    <span className="font-normal text-[#016630] text-base">{property.mutualSource.description}</span>
                  </div>
                  <p className="max-w-3xl font-normal text-[#0D542B] text-base leading-relaxed">
                    {property.description?.split('.')[0] ?? ""}. This partnership ensures full regulatory compliance, expedited permitting, and access to municipal infrastructure planning. The Council has committed to maintaining road access and supporting community development initiatives within the project.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div variants={itemVariants} className="top-18 z-30 sticky bg-white/80 backdrop-blur-md -mx-4 px-4 py-4">
            <PropertyTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {activeTab === "overview" && (
                <>
                  {/* Opportunity Description */}
                  <section className="space-y-4 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                    <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                      <FileText size={20} className="text-color-main" /> Opportunity Description
                    </h3>
                    <p className="font-normal text-[#364153] text-base leading-relaxed">
                      {property.description}
                    </p>
                  </section>

                  {/* At a Glance Grid */}
                  <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                    <h3 className="font-bold text-color-jet-black text-xl">At a Glance</h3>
                    <div className="gap-6 grid grid-cols-2 md:grid-cols-">
                      <div>
                        <p className="mb-1 font-medium text-[#4A5565]">Investment Type</p>
                        <p className="font-semibold text-color-jet-black text-base">{property.type}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-[#4A5565]">Size</p>
                        <p className="font-semibold text-color-jet-black text-base">{property.sizeArea}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-[#4A5565]">Price Range</p>
                        <p className="font-semibold text-color-main text-base">${property.priceRangeLower} - ${property.priceRangeUpper}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-[#4A5565]">Development Status</p>
                        <p className="font-semibold text-color-jet-black text-base">{property.developmentStatus}</p>
                      </div>
                    </div>
                  </section>

                  {/* Highlights */}
                  {property.keyHighlights && property.keyHighlights.length > 0 && (
                    <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-medium text-color-jet-black text-xl">
                        <Sparkles size={20} className="text-color-main" /> Key Highlights
                      </h3>
                      <div className="gap-4 grid md:grid-cols-1">
                        {property.keyHighlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-[#F9FAFB] p-4 rounded-[10px]">
                            <CheckCircle2 size={20} className="mt-0.5 text-color-main shrink-0" />
                            <span className="font-normal text-[#364153] text-base">{item.content}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Considerations */}
                  {property.diasporaInvestorConsiderations && property.diasporaInvestorConsiderations.length > 0 && (
                    <section className="space-y-5 bg-[#FDF2F8] p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                        <Users size={24} className="text-color-main" /> Diaspora Considerations
                      </h3>
                      <p className="font-normal text-[#4A5565] text-sm">Practical guidance for international investors based on common questions and concerns:</p>
                      <div className="space-y-3">
                        {property.diasporaInvestorConsiderations.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-pink-50 p-4 border border-pink-100 rounded-[10px]">
                            <CircleAlert size={20} className="mt-0.5 text-color-main shrink-0" />
                            <p className="font-normal text-[#364153] text-sm leading-relaxed">{item.content}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {activeTab === "features" && (
                <div className="space-y-8">




                  {/* Features */}
                  {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                    <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                        <Info size={24} className="text-color-main" /> Included Features & Amenities
                      </h3>
                      <div className="gap-x-6 gap-y-3 grid grid-cols-1 md:grid-cols-2">
                        {property.propertyFeatures.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 font-normal text-[#364153] text-base">
                            <CheckCircle2 size={16} className="text-color-main shrink-0" />
                            {item.content}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab === "financials" && (
                <div className="space-y-8">
                  {/* Breakdowns */}
                  <div className="gap-8 grid md:grid-cols-1">
                    {/* Investment Breakdown */}
                    <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                        <TrendingUp size={24} className="text-color-main" /> Investment Breakdown
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-gray-100 border-b">
                          <span className="font-normal text-[#4A5565] text-base">Estimated Closing Cost</span>
                          <span className="font-bold text-[#101828] text-base text-right">{property.estimatedClosingCost}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-gray-100 border-b">
                          <span className="font-normal text-[#4A5565] text-base">Price Details</span>
                          <span className="max-w-xs font-bold text-[#101828] text-base text-right">{property.priceDetails}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-gray-100 border-b">
                          <span className="font-normal text-[#4A5565] text-base">Closing Cost Breakdown</span>
                          <span className="max-w-xs font-bold text-[#101828] text-base text-right">{property.closingCostBreakdown}</span>
                        </div>
                      </div>
                    </section>

                    {/* Ongoing Costs */}
                    {property.ongoingCost && property.ongoingCost.length > 0 && (
                      <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                        <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                          <Info size={24} className="text-color-main" /> Ongoing Costs
                        </h3>
                        <div className="space-y-4">
                          {property.ongoingCost.map((cost, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-4 border-gray-100 last:border-0 border-b">
                              <span className="font-normal text-[#4A5565] text-base">{cost.content}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Financial Details */}
                  <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                    <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                      <TrendingUp size={24} className="text-color-main" /> Financial Details
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="font-bold text-[#101828] text-sm">Investment Structure</p>
                        <p className="font-normal text-[#4A5565] text-base leading-relaxed">{property.investmentStructure}</p>
                      </div>
                      <div className="bg-gray-100 w-full h-px"></div>
                      <div className="space-y-2">
                        <p className="font-bold text-[#101828] text-sm">Projected Returns</p>
                        <p className="font-normal text-[#4A5565] text-base leading-relaxed">{property.projectedReturns}</p>
                      </div>
                      <div className="bg-gray-100 w-full h-px"></div>
                      <div className="space-y-2">
                        <p className="font-bold text-[#101828] text-sm">Tax Incentives</p>
                        <p className="font-normal text-[#4A5565] text-base leading-relaxed">{property.taxIncentives}</p>
                      </div>
                    </div>
                  </section>

                  {/* Typical Closing Period */}
                  <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                    <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                      <Clock size={24} className="text-color-main" /> Typical Closing Period
                    </h3>
                    <div className="space-y-6">
                      <p className="font-normal text-[#101828] text-base">{property.typicalClosingPeriod}</p>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "legal" && (
                <div className="space-y-8">
                  {property.legalConsiderations && property.legalConsiderations.length > 0 && (
                    <section className="space-y-6 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                        <Scale size={24} className="text-color-main" /> Legal Considerations
                      </h3>
                      <p className="font-normal text-[#4A5565] text-sm italic">
                        Important legal and regulatory information for this investment:
                      </p>
                      <ul className="space-y-3">
                        {property.legalConsiderations.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-[#F9FAFB] px-3 py-3.5 rounded-[10px]">
                            <Scale size={18} className="mt-0.5 text-gray-400 shrink-0" />
                            <span className="font-medium text-[#364153] text-sm">{item.content}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="font-normal text-[#6A7282] text-xs">
                        Note: Always consult with a licensed Jamaica attorney before finalizing any property transaction.
                      </p>
                    </section>
                  )}

                  {property.localContext && property.localContext.length > 0 && (
                    <section className="space-y-8 bg-white p-3 md:p-6 border border-[#919EAB] rounded-[14px]">
                      <h3 className="flex items-center gap-2 font-bold text-color-jet-black text-xl">
                        <MapPin size={24} className="text-color-main" /> Local Context
                      </h3>

                      <div className="space-y-6">
                        {property.localContext.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <p className="font-bold text-color-jet-black text-sm">{item.title}</p>
                            <p className="font-normal text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            {idx < property.localContext.length - 1 && <div className="bg-gray-100 mt-4 w-full h-px"></div>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Pricing Card */}
          <div className="top-24 md:sticky bg-white shadow-sm p-3 md:p-6 border-[#919EAB] border-2 rounded-[14px]">
            <div className="space-y-1 mb-6">
              <p className="mb-1.5 font-semibold text-[#4A5565] text-sm">Investment Range</p>
              <p className="font-bold text-color-main text-3xl">
                {property.priceRangeLower} - {property.priceRangeUpper}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleToggleInterest}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${interested
                  ? "bg-white border-2 border-color-main text-color-main hover:bg-pink-50"
                  : "bg-color-main hover:bg-white hover:text-color-main hover:border-2 border-2 hover:border-color-main text-white shadow-pink-100"
                  }`}
              >
                <FileText size={18} /> {interested ? "Remove Interest" : "Express Interest"}
              </button>
            </div>

            {property.vettedBy && (
              <div className="mt-6 pt-6 border-gray-100 border-t">
                <div className="flex items-center gap-2 font-semibold text-[#4A5565] text-sm">
                  <ShieldCheck size={18} className="text-[#00A859]" />
                  <span>Vetted by {property.vettedBy}</span>
                </div>
                <p className="mt-2 text-[#4A5565] text-[12px] leading-relaxed">
                  This opportunity has been sourced and verified through Vanessa's trusted partner network.
                </p>
              </div>
            )}
          </div>

          {/* What Happens Next Card */}
          <div className="space-y-6 bg-[#FDF2F8] p-3 md:p-6 border border-color-main rounded-[14px]">
            <h4 className="flex items-center gap-2 font-bold text-color-jet-black text-lg">
              <img src={iconImg} alt="icon" className="w-5 h-5" /> What Happens Next
            </h4>
            <div className="space-y-4">
              {[
                "Express your interest and we'll connect you directly with the vetted source",
                "Receive detailed documentation and schedule a call to discuss specifics",
                "Vanessa guides you through due diligence and closing process"
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex justify-center items-center bg-color-main mt-0.5 rounded-full w-6 h-6 font-bold text-[10px] text-white shrink-0">
                    {idx + 1}
                  </div>
                  <p className="font-normal text-gray-700 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Source Partner Card */}
          {property.mutualSource && (
            <div className="space-y-4 bg-white p-5 border border-[#919EAB] rounded-[14px]">
              <p className="font-medium text-color-jet-black text-base uppercase tracking-widest">Source Partner</p>
              <div className="space-y-2">
                <p className="font-semibold text-color-jet-black text-base leading-tight">{property.mutualSource.name}</p>
                <p className="font-normal text-[#4A5565] text-sm">{property.mutualSource.role}</p>
              </div>
              <p className="pt-2 border-[#0000001A] border-t font-normal text-[#6A7282] text-xs">
                Contact details shared after expressing interest.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
