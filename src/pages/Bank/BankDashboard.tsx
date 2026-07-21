import React, { useState, useMemo, useRef } from "react";
import { User, CheckSquare, MinusSquare, CheckCircle2, Filter, Eye, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import InvestorProfileModal from "./components/InvestorProfileModal";
import SearchInput from "../../components/common/SearchInput";
import { useDebounce } from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useGetBankDashboardQuery, TBankApplicationStatus } from "@/store/api/bankApi";
import { ApplicationStatus } from "./components/data/mockData";

const STATUS_MAP: Record<ApplicationStatus, TBankApplicationStatus> = {
  "Under Review": "underReview",
  "Need More Info": "needMoreInfo",
  "Approved": "approved",
  "Rejected": "rejected",
};

const REVERSE_STATUS_MAP: Record<string, ApplicationStatus> = {
  underReview: "Under Review",
  needMoreInfo: "Need More Info",
  approved: "Approved",
  rejected: "Rejected",
};

const BankDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const statusFilterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(statusFilterRef, () => setStatusFilterOpen(false));

  const apiStatusParam: TBankApplicationStatus | undefined = useMemo(() => {
    if (statusFilter) return STATUS_MAP[statusFilter];
    if (activeFilter === "Under Review") return "underReview";
    if (activeFilter === "Approved") return "approved";
    return undefined;
  }, [statusFilter, activeFilter]);

  const { data: dashboardResponse, isLoading, isError, refetch } = useGetBankDashboardQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm || undefined,
    status: apiStatusParam,
  });

  const summary = dashboardResponse?.data?.summary || {
    totalInvestors: 0,
    ready: 0,
    underReview: 0,
    approved: 0,
  };

  const applications = dashboardResponse?.data?.applications || [];
  const meta = dashboardResponse?.meta;

  const handleViewProfile = (id: string) => {
    setSelectedInvestorId(id);
    setIsModalOpen(true);
  };

  const getReadinessStyle = (readiness: string) => {
    switch (readiness) {
      case "Ready":
      case "ready":
        return "bg-[#00C950] text-white";
      case "Almost Ready":
      case "almostReady":
        return "bg-[#F0B100] text-white";
      case "Not Ready":
      case "notReady":
        return "bg-[#FB2C36] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Under Review":
      case "underReview":
        return "bg-[#2B7FFF] text-white";
      case "Need More Info":
      case "needMoreInfo":
        return "bg-[#F0B100] text-white";
      case "Approved":
      case "approved":
        return "bg-[#00C950] text-white";
      case "Rejected":
      case "rejected":
        return "bg-[#FB2C36] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
    setStatusFilter(null);
    setPage(1);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toISOString().split("T")[0];
    } catch {
      return dateStr;
    }
  };

  const cardStyle = (filterName: string) =>
    `bg-white rounded-xl p-6 flex items-start justify-between shadow-sm cursor-pointer transition-all border-[#919EAB] hover:border-gray-300 ${activeFilter === filterName ? 'ring-[#D91A7C]' : ''}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investor Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage investor profiles and mortgage applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div onClick={() => handleFilterClick("Total")} className={cardStyle("Total")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Total Investors</p>
            <p className="text-2xl font-bold text-[#D91E75]">{summary.totalInvestors}</p>
          </div>
          <div className="bg-[#3B82F6] text-white p-2 rounded-lg">
            <User size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Ready")} className={cardStyle("Ready")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Ready</p>
            <p className="text-2xl font-bold text-[#EF4444]">{summary.ready}</p>
          </div>
          <div className="bg-[#F59E0B] text-white p-2 rounded-lg">
            <CheckSquare size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Under Review")} className={cardStyle("Under Review")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Under Review</p>
            <p className="text-2xl font-bold text-[#10B981]">{summary.underReview}</p>
          </div>
          <div className="bg-[#84A98C] text-white p-2 rounded-lg">
            <MinusSquare size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Approved")} className={cardStyle("Approved")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Approved</p>
            <p className="text-2xl font-bold text-[#8B5CF6]">{summary.approved}</p>
          </div>
          <div className="bg-[#A855F7] text-white p-2 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by name or country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="relative" ref={statusFilterRef}>
          <button
            type="button"
            onClick={() => setStatusFilterOpen(!statusFilterOpen)}
            className={`flex items-center gap-2 bg-[#F3F3F5] border rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${statusFilter
                ? "border-[#D91E75] text-[#D91E75]"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Filter size={16} className={statusFilter ? "text-[#D91E75]" : "text-gray-400"} />
            {statusFilter ?? "All Status"}
          </button>
          {statusFilterOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-20">
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Filter by Status
              </div>
              <div className="px-1">
                <button
                  type="button"
                  onClick={() => { setStatusFilter(null); setStatusFilterOpen(false); setPage(1); }}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center cursor-pointer transition-colors ${!statusFilter ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                >
                  All Status
                  {!statusFilter && <Check size={14} className="text-[#D91E75]" />}
                </button>
                {(["Under Review", "Approved", "Rejected", "Need More Info"] as ApplicationStatus[]).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusFilterOpen(false); setPage(1); }}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center cursor-pointer transition-colors ${statusFilter === s ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50 font-medium"
                      }`}
                  >
                    {s}
                    {statusFilter === s && <Check size={14} className="text-[#D91E75]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-500">
            <Loader2 size={28} className="animate-spin text-[#D91E75]" />
            <p className="text-sm">Loading applications...</p>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-red-500">
            Failed to load data.{" "}
            <button type="button" onClick={() => refetch()} className="underline font-bold cursor-pointer">
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Investor Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Country</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Readiness</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Budget</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Last Updated</th>
                  <th className="py-4 px-6 text-xs font-semibold text-[#4B5A7A] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length > 0 ? (
                  applications.map((investor) => {
                    const statusLabel = investor.statusLabel || REVERSE_STATUS_MAP[investor.status] || investor.status;
                    const readinessLabel = investor.readinessLabel || (investor.readiness === "ready" ? "Ready" : investor.readiness === "almostReady" ? "Almost Ready" : "Not Ready");
                    return (
                      <tr key={investor.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-bold text-gray-900 whitespace-nowrap">{investor.investorName}</td>
                        <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{investor.country || "N/A"}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getReadinessStyle(readinessLabel)}`}>
                            {readinessLabel === "Almost Ready" && <span className="mr-1">⏱</span>}
                            {readinessLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{investor.budget || "N/A"}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getStatusStyle(statusLabel)}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{formatDate(investor.lastUpdated)}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleViewProfile(investor.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Eye size={14} className="text-gray-400" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No investors found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {meta && meta.totalPage > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <p>
              Showing page <span className="font-semibold text-gray-900">{meta.page}</span> of{" "}
              <span className="font-semibold text-gray-900">{meta.totalPage}</span> (
              <span className="font-semibold text-gray-900">{meta.total}</span> total applications)
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    type="button"
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      page === pageNum
                        ? "bg-[#D91E75] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={meta.page >= meta.totalPage}
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPage))}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <InvestorProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investorId={selectedInvestorId}
      />
    </div>
  );
};

export default BankDashboard;
