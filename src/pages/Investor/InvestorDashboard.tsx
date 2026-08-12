import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, ArrowRight, Home, Upload, House, TrendingUp, LogOut, Loader2, Camera, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import watermark from "@/assets/home/watermark.png";
import GuideContent from "@/components/onboarding/GuideContent";
import DocumentChecklistContent from "@/components/onboarding/DocumentChecklistContent";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logout, selectUser, setUser } from "@/store/features/auth/auth.slice";
import { useLogoutUserMutation, useUpdateProfileMutation, useGetProgressTrackerQuery } from "@/store/features/auth/auth.api";
import { useGetInvestmentGuideQuery } from "@/store/features/investmentGuide/investmentGuide.api";
import { getUserDocuments, getLenderDocuments, getLendersList, LenderDocumentRequirement } from "@/utils/chatbotService";
import { toast } from "react-toastify";

type TabType = "Dashboard" | "Documents" | "Guide" | "Profile";

const InvestorDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    country: "",
    budget: "",
    goal: "",
    timeline: "",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle ?tab=profile query param from nav dropdown
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "profile") {
      setActiveTab("Profile");
    }
  }, [searchParams]);
  const currentUser = useAppSelector(selectUser);

  const [logoutUser] = useLogoutUserMutation();
  const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { data: guideData } = useGetInvestmentGuideQuery();
  const { data: trackerResponse } = useGetProgressTrackerQuery();

  const trackerData = trackerResponse?.data;

  // Profile State
  const [profile, setProfile] = useState({
    fullName: currentUser?.name || "N/A",
    email: currentUser?.email || "N/A",
    country: currentUser?.countryOfResidence || "",
    budget: currentUser?.investmentBudget || "",
    goal: currentUser?.investmentGoal || "",
    timeline: currentUser?.investmentTimeline || "",
  });

  // Dynamic Document Progress State
  const [docProgress, setDocProgress] = useState({
    uploaded: 0,
    total: 0,
    missing: 0,
    percentage: 0,
    pendingDocNames: [] as string[],
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        fullName: currentUser.name || "N/A",
        email: currentUser.email || "N/A",
        country: currentUser.countryOfResidence || "",
        budget: currentUser.investmentBudget ? `$${currentUser.investmentBudget}` : "",
        goal: currentUser.investmentGoal || "",
        timeline: currentUser.investmentTimeline || "",
      });
    }
  }, [currentUser]);

  // Guide progress calculation from backend API
  const totalGuideSections = guideData?.data?.length || 0;
  const completedGuideSections = guideData?.data?.filter((s) => s.isCompleted)?.length || 0;
  const guidePercentage = trackerData?.investmentGuide?.percentage ?? (totalGuideSections > 0 ? Math.round((completedGuideSections / totalGuideSections) * 100) : 100);

  // Dynamic progress tracker values from backend
  const onboardingPercentage = trackerData?.onboarding?.percentage ?? (currentUser?.isVerified ? 100 : 50);
  const onboardingStatus = trackerData?.onboarding?.status ?? (onboardingPercentage === 100 ? "Complete" : "In Progress");

  const financialPercentage = trackerData?.financialReadiness?.percentage ?? 0;
  const financialStatus = trackerData?.financialReadiness?.status ?? `${financialPercentage}%`;

  const readinessPercentage = trackerData?.financialReadiness?.percentage ?? 0;

  // Fetch document status for dashboard
  const loadDocumentProgress = async () => {
    try {
      const [lendersRes, userDocsRes] = await Promise.all([
        getLendersList().catch(() => ({ lenders: [] })),
        currentUser?.id ? getUserDocuments(currentUser.id).catch(() => null) : Promise.resolve(null),
      ]);

      const userDocs = userDocsRes?.documents || [];
      const lenders = lendersRes?.lenders || [];
      const defaultLenderCode = lenders.length > 0 ? lenders[0].code : "";

      if (defaultLenderCode) {
        const reqRes = await getLenderDocuments(defaultLenderCode, "employed").catch(() => ({ documents: [] }));
        const requiredDocs: LenderDocumentRequirement[] = reqRes.documents || [];
        const total = requiredDocs.length;
        
        const uploadedDocs = requiredDocs.filter((reqDoc) =>
          userDocs.some((uDoc) =>
            uDoc.doc_type.toLowerCase() === reqDoc.doc_type.toLowerCase() ||
            reqDoc.doc_type.toLowerCase().includes(uDoc.doc_type.toLowerCase()) ||
            uDoc.doc_type.toLowerCase().includes(reqDoc.doc_type.toLowerCase())
          )
        );
        const uploaded = uploadedDocs.length;
        const missing = Math.max(0, total - uploaded);
        const percentage = total > 0 ? Math.round((uploaded / total) * 100) : 0;

        const pending = requiredDocs
          .filter((reqDoc) => !userDocs.some((uDoc) =>
            uDoc.doc_type.toLowerCase() === reqDoc.doc_type.toLowerCase() ||
            reqDoc.doc_type.toLowerCase().includes(uDoc.doc_type.toLowerCase()) ||
            uDoc.doc_type.toLowerCase().includes(reqDoc.doc_type.toLowerCase())
          ))
          .map((d) => d.doc_type.replace(/_/g, " "));

        setDocProgress({
          uploaded,
          total,
          missing,
          percentage,
          pendingDocNames: pending,
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard document status:", err);
    }
  };

  useEffect(() => {
    loadDocumentProgress();
  }, [currentUser]);

  const handleDocumentProgressUpdate = (uploadedCount: number, totalCount: number) => {
    const missing = Math.max(0, totalCount - uploadedCount);
    const percentage = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0;
    setDocProgress((prev) => ({
      ...prev,
      uploaded: uploadedCount,
      total: totalCount,
      missing,
      percentage,
    }));
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch (e) {
      console.error("Backend logout error", e);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleOpenEditModal = () => {
    setEditForm({
      fullName: profile.fullName || "",
      country: profile.country || "",
      budget: profile.budget || "",
      goal: profile.goal || "",
      timeline: profile.timeline || "",
    });
    setProfileImagePreview(null);
    setImageFile(null);
    setIsEditProfileOpen(true);
  };

  const isTextFieldsChanged =
    editForm.fullName.trim() !== (profile.fullName || "").trim() ||
    editForm.country.trim() !== (profile.country || "").trim() ||
    editForm.budget.trim() !== (profile.budget || "").trim() ||
    editForm.goal.trim() !== (profile.goal || "").trim() ||
    editForm.timeline.trim() !== (profile.timeline || "").trim();

  // Save text profile details only
  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isTextFieldsChanged) return;

    const payload = new FormData();
    if (editForm.fullName) payload.append("name", editForm.fullName);
    if (editForm.country) payload.append("countryOfResidence", editForm.country);
    if (editForm.budget) payload.append("investmentBudget", editForm.budget);
    if (editForm.goal) payload.append("investmentGoal", editForm.goal);
    if (editForm.timeline) payload.append("investmentTimeline", editForm.timeline);

    try {
      const res = await updateProfileMutation(payload).unwrap();
      if (res.data) {
        dispatch(setUser({ user: res.data }));
      }
      setIsEditProfileOpen(false);
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  // Upload image separately
  const handleImageUpload = async () => {
    if (!imageFile) return;

    const payload = new FormData();
    payload.append("image", imageFile);

    setIsUploadingImage(true);
    try {
      const res = await updateProfileMutation(payload).unwrap();
      if (res.data) {
        dispatch(setUser({ user: res.data }));
      }
      setProfileImagePreview(null);
      setImageFile(null);
    } catch (err: any) {
      console.error("Image upload error:", err);
      toast.error(err?.data?.message || "Failed to upload profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const tabs: TabType[] = ["Dashboard", "Documents", "Guide", "Profile"];

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
      className="space-y-6 mx-auto w-full max-w-7xl"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="mb-3 font-bold text-color-jet-black text-4xl">Investment Dashboard</h1>
        <p className="font-normal text-[#4A5565] text-xl">Track your Jamaica real estate investment journey</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#ECECF0] mt-6 p-1.5 rounded-2xl w-fit max-w-md">
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
      </motion.div>

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
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Pink Banner */}
              <motion.div variants={itemVariants} className="relative bg-color-main shadow-md p-6 md:p-12 rounded-2xl overflow-hidden text-white">
                <div className="z-10 relative">
                  <h2 className="mb-4 font-bold text-white text-2xl md:text-4xl">You're {readinessPercentage}% Ready !</h2>
                  <p className="mb-8 font-normal text-[#FFFFFFE5] text-lg md:text-xl">
                    {docProgress.missing === 0
                      ? "You've completed all preparation steps. Browse Investment Opportunities to start viewing properties."
                      : `You have ${docProgress.missing} required document(s) pending. Complete your document setup or browse opportunities.`}
                  </p>
                  <button
                    onClick={() => navigate("/investor/opportunities")}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium text-color-main text-xs md:text-sm transition-colors cursor-pointer"
                  >
                    <Home size={16} className="shrink-0" /> Browse Investment Opportunities
                  </button>
                </div>
                {/* Abstract Shape/Icon */}
                <div className="top-0 right-0 bottom-0 absolute flex justify-end items-center opacity-20 pr-8 w-1/3 pointer-events-none">
                  <motion.img
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    src={watermark}
                    alt="right shape"
                    className="pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Progress Tracker */}
              <motion.div variants={itemVariants}>
                <h3 className="mb-4 font-bold text-color-jet-black text-xl">Progress Tracker</h3>
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                  {/* Onboarding */}
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-color-jet-black text-base">Onboarding</span>
                      {onboardingPercentage === 100 && <ShieldCheck size={18} className="text-green-500" />}
                    </div>
                    <div className="bg-gray-100 mb-3 rounded-full w-full h-1.5 overflow-hidden">
                      <div className="bg-[#d81b60] rounded-full h-full transition-all duration-300" style={{ width: `${onboardingPercentage}%` }}></div>
                    </div>
                    <span className="font-normal text-[#4A5565] text-sm">{onboardingStatus}</span>
                  </motion.div>

                  {/* Financial Readiness */}
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-color-jet-black text-base">Financial Readiness</span>
                      {financialPercentage === 100 && <ShieldCheck size={18} className="text-green-500" />}
                    </div>
                    <div className="bg-gray-100 mb-3 rounded-full w-full h-1.5 overflow-hidden">
                      <div className="bg-[#d81b60] rounded-full h-full transition-all duration-300" style={{ width: `${financialPercentage}%` }}></div>
                    </div>
                    <span className="font-normal text-[#4A5565] text-sm">{financialStatus}</span>
                  </motion.div>

                  {/* Investment Guide */}
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-color-jet-black text-base">Investment Guide</span>
                      {guidePercentage === 100 && <ShieldCheck size={18} className="text-green-500" />}
                    </div>
                    <div className="bg-gray-100 mb-3 rounded-full w-full h-1.5 overflow-hidden">
                      <div className="bg-[#d81b60] rounded-full h-full transition-all duration-300" style={{ width: `${guidePercentage}%` }}></div>
                    </div>
                    <span className="font-normal text-[#4A5565] text-sm">
                      {guidePercentage === 100 ? "Complete" : `${guidePercentage}% (${completedGuideSections}/${totalGuideSections})`}
                    </span>
                  </motion.div>

                  {/* Documents */}
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-semibold text-color-jet-black text-base">Documents</span>
                      {docProgress.missing === 0 && docProgress.total > 0 && <ShieldCheck size={18} className="text-green-500" />}
                    </div>
                    <div className="bg-gray-100 mb-3 rounded-full w-full h-1.5 overflow-hidden">
                      <div className="bg-[#d81b60] rounded-full h-full transition-all duration-300" style={{ width: `${docProgress.percentage}%` }}></div>
                    </div>
                    <span className="font-normal text-[#4A5565] text-sm">
                      {docProgress.missing === 0 && docProgress.total > 0 ? "Complete" : `${docProgress.percentage}% (${docProgress.uploaded}/${docProgress.total})`}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Document Status */}
              <motion.div variants={itemVariants} className="bg-white p-6 border border-gray-100 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-color-jet-black text-xl">Document Status</h3>
                  <button
                    onClick={() => setActiveTab("Documents")}
                    className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 border border-[#0000001A] rounded-lg font-medium text-gray-600 hover:text-[#212a31] text-xs cursor-pointer"
                  >
                    Manage All <ArrowRight size={14} />
                  </button>
                </div>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  <div className="flex flex-col justify-center items-center bg-[#F0FDF4] p-4 rounded-[10px] text-center">
                    <span className="mb-1 font-bold text-[#00A63E] text-3xl">{docProgress.uploaded}</span>
                    <span className="font-normal text-[#4A5565] text-sm">Uploaded</span>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-[#FEFCE8] p-4 rounded-[10px] text-center">
                    <span className="mb-1 font-bold text-[#D08700] text-3xl">{docProgress.missing}</span>
                    <span className="font-normal text-[#4A5565] text-sm">Missing</span>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-[#EFF6FF] p-4 rounded-[10px] text-center">
                    <span className="mb-1 font-bold text-[#155DFC] text-3xl">{docProgress.total}</span>
                    <span className="font-normal text-[#4A5565] text-sm">Total Required</span>
                  </div>
                </div>
              </motion.div>

              {/* Recommended Next Steps */}
              <motion.div variants={itemVariants}>
                <h3 className="mb-4 font-bold text-color-jet-black text-xl">Recommended Next Steps</h3>
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.01 }} className="flex sm:flex-row flex-col items-start sm:items-center gap-4 bg-white shadow-sm p-5 border border-gray-100 rounded-xl">
                    <div className="flex justify-center items-center bg-pink-50 rounded-full w-10 h-10 text-[#d81b60] shrink-0">
                      <Upload size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1.5 font-semibold text-color-jet-black text-base">Upload remaining documents</h4>
                      <p className="font-normal text-[#4A5565] text-sm">
                        {docProgress.missing > 0
                          ? `${docProgress.missing} documents pending${docProgress.pendingDocNames.length > 0 ? `: ${docProgress.pendingDocNames.slice(0, 3).join(", ")}` : ""}`
                          : "All required documents uploaded"}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("Documents")}
                      className="inline-flex items-center gap-1.5 bg-color-main hover:bg-[#c2185b] mt-3 sm:mt-0 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors cursor-pointer"
                    >
                      Upload Now <ArrowRight size={14} />
                    </button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }} className="flex sm:flex-row flex-col items-start sm:items-center gap-4 bg-white shadow-sm p-5 border border-gray-100 rounded-xl">
                    <div className="flex justify-center items-center bg-pink-50 rounded-full w-10 h-10 text-[#d81b60] shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1.5 font-semibold text-color-jet-black text-base">Review financing options</h4>
                      <p className="font-normal text-[#4A5565] text-sm">Based on your profile, you qualify for pre-approval with recommended institutions</p>
                    </div>
                    <Link to="/onboarding/assessment" state={{ fromDashboard: true }} className="inline-flex items-center gap-1.5 bg-color-main hover:bg-[#c2185b] mt-3 sm:mt-0 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors cursor-pointer">
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }} className="flex sm:flex-row flex-col items-start sm:items-center gap-4 bg-white shadow-sm p-5 border border-gray-100 rounded-xl">
                    <div className="flex justify-center items-center bg-pink-50 rounded-full w-10 h-10 text-[#d81b60] shrink-0">
                      <House size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1.5 font-semibold text-color-jet-black text-base">Browse Investment Opportunities</h4>
                      <p className="font-normal text-[#4A5565] text-sm">Start exploring properties matching your budget and preferences</p>
                    </div>
                    <Link to="/investor/opportunities" className="inline-flex items-center gap-1.5 bg-color-main hover:bg-[#c2185b] mt-3 sm:mt-0 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors cursor-pointer">
                      View Properties <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "Documents" && (
            <div>
              <DocumentChecklistContent onProgressUpdate={handleDocumentProgressUpdate} />
            </div>
          )}

          {activeTab === "Guide" && (
            <div>
              <GuideContent />
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="bg-white p-4 md:p-8 border border-[#919EAB] rounded-[14px]">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="font-bold text-color-jet-black text-xl">Investor Profile</h2>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-2 border border-red-200 rounded-lg font-medium text-red-600 text-sm transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Full Name</p>
                  <p className="text-[#212a31] text-sm">{profile.fullName || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Email</p>
                  <p className="text-[#212a31] text-sm">{profile.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Country of Residence</p>
                  <p className="text-[#212a31] text-sm">{profile.country || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Investment Budget</p>
                  <p className="text-[#212a31] text-sm">{profile.budget || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Investment Goal</p>
                  <p className="text-[#212a31] text-sm">{profile.goal || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-500 text-xs">Timeline</p>
                  <p className="text-[#212a31] text-sm">{profile.timeline || "Not provided"}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={handleOpenEditModal}
                    className="hover:bg-gray-50 px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="sm:hidden flex items-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-2.5 border border-red-200 rounded-lg font-medium text-red-600 text-sm transition-colors cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
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
          <div className="z-50 fixed inset-0 flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsEditProfileOpen(false); setProfileImagePreview(null); setImageFile(null); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white shadow-xl rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-gray-100 border-b">
                <h3 className="font-bold text-[#212a31] text-lg">Edit Profile</h3>
                <button
                  onClick={() => { setIsEditProfileOpen(false); setProfileImagePreview(null); setImageFile(null); }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleProfileSave} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
                {/* Profile Image Upload Section */}
                <div className="flex flex-col items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="relative group">
                    <div className="flex justify-center items-center bg-gradient-to-br from-[#D91A7C] to-[#9c1654] rounded-full w-24 h-24 overflow-hidden ring-4 ring-pink-100">
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : currentUser?.profileImage || currentUser?.image ? (
                        <img src={currentUser.profileImage || currentUser.image || ""} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={36} className="text-white opacity-80" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  {/* Buttons for Image Selection & Upload */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    >
                      <Camera size={15} className="text-color-main" />
                      <span>{profileImagePreview ? "Change Photo" : "Select Photo"}</span>
                    </button>

                    {/* Dedicated Separate Upload Image Button - Shows ONLY when an image is selected */}
                    {imageFile && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        className="flex items-center gap-1.5 bg-color-main hover:bg-pink-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{isUploadingImage ? "Uploading..." : "Upload Image"}</span>
                      </button>
                    )}
                  </div>
                  {profileImagePreview && (
                    <p className="text-xs text-green-600 font-medium">✓ Photo selected. Click "Upload Image" to save photo separately.</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Full Name</label>
                  <input
                    name="fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                    required
                    className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-[#d81b60] focus:ring-2 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    disabled
                    className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg outline-none w-full text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Country of Residence</label>
                  <input
                    name="country"
                    value={editForm.country}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="Not provided"
                    className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-[#d81b60] focus:ring-2 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Investment Budget</label>
                  <input
                    name="budget"
                    value={editForm.budget}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="Not provided"
                    className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-[#d81b60] focus:ring-2 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Investment Goal</label>
                  <select
                    name="goal"
                    value={editForm.goal}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, goal: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-[#d81b60] focus:ring-2 w-full text-sm bg-white"
                  >
                    <option value="">Select Investment Goal</option>
                    <option value="rental_income">Rental Income</option>
                    <option value="vacation_home">Vacation Home</option>
                    <option value="retirement_property">Retirement Property</option>
                    <option value="capital_appreciation">Capital Appreciation</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Timeline</label>
                  <input
                    name="timeline"
                    value={editForm.timeline}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, timeline: e.target.value }))}
                    placeholder="Not provided"
                    className="px-4 py-2 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-[#d81b60] focus:ring-2 w-full text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsEditProfileOpen(false); setProfileImagePreview(null); setImageFile(null); }}
                    disabled={isUpdatingProfile}
                    className="hover:bg-gray-50 px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile || !isTextFieldsChanged}
                    className="flex items-center gap-2 bg-[#d81b60] hover:bg-[#c2185b] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#d81b60] px-5 py-2.5 rounded-lg font-medium text-white text-sm transition-all cursor-pointer"
                  >
                    {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InvestorDashboard;
