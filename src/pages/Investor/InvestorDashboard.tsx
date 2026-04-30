import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Home, Upload, House, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import watermark from "@/assets/home/watermark.png";
import GuideContent from "@/components/onboarding/GuideContent";
import DocumentChecklistContent from "@/components/onboarding/DocumentChecklistContent";

type TabType = "Dashboard" | "Documents" | "Guide" | "Profile";

const InvestorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Mock Profile State
  const [profile, setProfile] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    country: "United States",
    budget: "$200,000 - $350,000 USD",
    goal: "Vacation Home & Rental Income",
    timeline: "6-12 months",
  });

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile({
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      budget: formData.get("budget") as string,
      goal: formData.get("goal") as string,
      timeline: formData.get("timeline") as string,
    });
    setIsEditProfileOpen(false);
  };

  const tabs: TabType[] = ["Dashboard", "Documents", "Guide", "Profile"];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-color-jet-black mb-3">Investment Dashboard</h1>
        <p className="text-xl font-normal text-[#4A5565]">Track your Jamaica real estate investment journey</p>

        {/* Tabs */}
        <div className="max-w-md w-fit rounded-2xl flex flex-wrap gap-2 mt-6 bg-[#ECECF0] p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1 rounded-full text-sm text-color-jet-black font-medium transition-all cursor-pointer ${activeTab === tab
                ? "bg-white shadow-sm"
                : " hover:bg-gray-50 "
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Pink Banner */}
              <div className="bg-color-main rounded-2xl p-12 text-white relative overflow-hidden shadow-md">
                <div className="relative z-10">
                  <h2 className="text-4xl text-white font-bold mb-4">You're 73% Ready !</h2>
                  <p className="max-w-3xl text-xl font-normal text-[#FFFFFFE5] mb-8">
                    You've completed all preparation steps. Browse Investment Opportunities to start viewing properties.
                  </p>
                  <button
                    onClick={() => navigate("/investor/opportunities")}
                    className="bg-white text-color-main text-sm font-medium cursor-pointer hover:bg-gray-100 px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    <Home size={16} /> Browse Investment Opportunities
                  </button>
                </div>
                {/* Abstract Shape/Icon */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-end pr-8">
                  <motion.img
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    src={watermark}
                    alt="right shape"
                    className="pointer-events-none"
                  />
                </div>
              </div>

              {/* Progress Tracker */}
              <div>
                <h3 className="text-xl font-bold text-color-jet-black mb-4">Progress Tracker</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Onboarding */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-base  text-color-jet-black">Onboarding</span>
                      <ShieldCheck size={18} className="text-green-500" />
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-[#d81b60] rounded-full w-full"></div>
                    </div>
                    <span className="text-sm font-normal text-[#4A5565]">Complete</span>
                  </div>

                  {/* Financial Readiness */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-base  text-color-jet-black">Financial Readiness</span>
                      <ShieldCheck size={18} className="text-green-500" />
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-[#d81b60] rounded-full w-[80%]"></div>
                    </div>
                    <span className="text-sm font-normal text-[#4A5565]">80%</span>
                  </div>

                  {/* Investment Guide */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-base  text-color-jet-black">Investment Guide</span>
                      <ShieldCheck size={18} className="text-green-500" />
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-[#d81b60] rounded-full w-full"></div>
                    </div>
                    <span className="text-sm font-normal text-[#4A5565]">Complete</span>
                  </div>

                  {/* Documents */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-base  text-color-jet-black">Documents</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-[#d81b60] rounded-full w-[85%]"></div>
                    </div>
                    <span className="text-sm font-normal text-[#4A5565]">In Progress</span>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-color-jet-black">Document Status</h3>
                  <button
                    onClick={() => setActiveTab("Documents")}
                    className="text-xs font-medium text-gray-600 hover:text-[#212a31] flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    Manage All <ArrowRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#F0FDF4] rounded-[10px] p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-[#00A63E] mb-1">17</span>
                    <span className="text-sm font-normal text-[#4A5565]">Uploaded</span>
                  </div>
                  <div className="bg-[#FEFCE8] rounded-[10px] p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-[#D08700] mb-1">3</span>
                    <span className="text-sm font-normal text-[#4A5565]">Missing</span>
                  </div>
                  <div className="bg-[#EFF6FF] rounded-[10px] p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-[#155DFC] mb-1">20</span>
                    <span className="text-sm font-normal text-[#4A5565]">Total Required</span>
                  </div>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div>
                <h3 className="text-xl font-bold text-color-jet-black mb-4">Recommended Next Steps</h3>
                <div className="space-y-3">
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#d81b60] shrink-0">
                      <Upload size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-color-jet-black mb-1.5">Upload remaining documents</h4>
                      <p className="text-sm font-normal text-[#4A5565]">3 documents pending: Proof of Address, Bank statement (recent), Tax returns</p>
                    </div>
                    <button
                      onClick={() => navigate("/onboarding/documents")}
                      className="mt-3 sm:mt-0 bg-color-main hover:bg-[#c2185b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      Upload Now <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#d81b60] shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-color-jet-black mb-1.5">Review financing options</h4>
                      <p className="text-sm font-normal text-[#4A5565]">Based on your profile, you qualify for pre-approval with recommended institutions</p>
                    </div>
                    <button className="mt-3 sm:mt-0 bg-color-main hover:bg-[#c2185b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                      Learn More <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#d81b60] shrink-0">
                      <House size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-color-jet-black mb-1.5">Browse Investment Opportunities</h4>
                      <p className="text-sm font-normal text-[#4A5565]">Start exploring properties matching your budget and preferences</p>
                    </div>
                    <button
                      onClick={() => navigate("/investor/opportunities")}
                      className="mt-3 sm:mt-0 bg-color-main hover:bg-[#c2185b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      View Properties <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <div>
              {/* <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-color-jet-black">Document Management</h2>
                <button
                  onClick={() => navigate("/onboarding/documents")}
                  className="text-sm font-medium text-color-main hover:underline flex items-center gap-1"
                >
                  Full Checklist <ArrowRight size={16} />
                </button>
              </div> */}
              <DocumentChecklistContent />
            </div>
          )}

          {activeTab === "Guide" && (
            <div>
              {/* <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-color-jet-black">Investment Guide</h2>
                <button
                  onClick={() => navigate("/onboarding/guide")}
                  className="text-sm font-medium text-color-main hover:underline flex items-center gap-1"
                >
                  View Full Guide <ArrowRight size={16} />
                </button>
              </div> */}
              <GuideContent />
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="bg-white border border-[#919EAB] rounded-[14px] p-8">
              <h2 className="text-xl font-bold text-color-jet-black mb-8">Investor Profile</h2>

              <div className="space-y-6 max-w-2xl">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm text-[#212a31]">{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-[#212a31]">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Country of Residence</p>
                  <p className="text-sm text-[#212a31]">{profile.country}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Investment Budget</p>
                  <p className="text-sm text-[#212a31]">{profile.budget}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Investment Goal</p>
                  <p className="text-sm text-[#212a31]">{profile.goal}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Timeline</p>
                  <p className="text-sm text-[#212a31]">{profile.timeline}</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#212a31]">Edit Profile</h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleProfileSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input name="fullName" defaultValue={profile.fullName} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" defaultValue={profile.email} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                  <input name="country" defaultValue={profile.country} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Budget</label>
                  <input name="budget" defaultValue={profile.budget} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Goal</label>
                  <input name="goal" defaultValue={profile.goal} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input name="timeline" defaultValue={profile.timeline} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#d81b60] focus:border-transparent outline-none" />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#d81b60] text-white hover:bg-[#c2185b] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestorDashboard;
