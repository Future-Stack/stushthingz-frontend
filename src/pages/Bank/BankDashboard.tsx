import React, { useState, useMemo, useRef } from "react";
import { User, CheckSquare, MinusSquare, CheckCircle2, Filter, Eye, Check } from "lucide-react";
import InvestorProfileModal from "./components/InvestorProfileModal";
import { investorsData, mockProfileData, InvestorProfileDetails, ApplicationStatus } from "./components/data/mockData";
import SearchInput from "../../components/common/SearchInput";
import { useDebounce } from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const BankDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<InvestorProfileDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(statusFilterRef, () => setStatusFilterOpen(false));

  const handleViewProfile = (id: string) => {
    const profile = mockProfileData[id];
    if (profile) {
      setSelectedProfile(profile);
      setIsModalOpen(true);
    } else {
      setSelectedProfile(mockProfileData["1"]);
      setIsModalOpen(true);
    }
  };

  const getReadinessStyle = (readiness: string) => {
    switch (readiness) {
      case "Ready":
        return "bg-[#00C950] text-white";
      case "Almost Ready":
        return "bg-[#F0B100] text-white";
      case "Not Ready":
        return "bg-[#FB2C36] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-[#2B7FFF] text-white";
      case "Need More Info":
        return "bg-[#F0B100] text-white";
      case "Approved":
        return "bg-[#00C950] text-white";
      case "Rejected":
        return "bg-[#FB2C36] text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const filteredInvestors = useMemo(() => {
    return investorsData.filter((investor) => {
      const matchesSearch =
        investor.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        investor.country.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCardFilter =
        !activeFilter ||
        activeFilter === "Total" ||
        (activeFilter === "Ready" && investor.readiness === "Ready") ||
        (activeFilter === "Under Review" && investor.status === "Under Review") ||
        (activeFilter === "Approved" && investor.status === "Approved");

      const matchesStatusFilter = !statusFilter || investor.status === statusFilter;

      return matchesSearch && matchesCardFilter && matchesStatusFilter;
    });
  }, [debouncedSearchTerm, activeFilter, statusFilter]);

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
            <p className="text-2xl font-bold text-[#D91E75]">4</p>
          </div>
          <div className="bg-[#3B82F6] text-white p-2 rounded-lg">
            <User size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Ready")} className={cardStyle("Ready")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Ready</p>
            <p className="text-2xl font-bold text-[#EF4444]">2</p>
          </div>
          <div className="bg-[#F59E0B] text-white p-2 rounded-lg">
            <CheckSquare size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Under Review")} className={cardStyle("Under Review")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Under Review</p>
            <p className="text-2xl font-bold text-[#10B981]">1</p>
          </div>
          <div className="bg-[#84A98C] text-white p-2 rounded-lg">
            <MinusSquare size={20} />
          </div>
        </div>
        <div onClick={() => handleFilterClick("Approved")} className={cardStyle("Approved")}>
          <div>
            <p className="text-sm font-semibold text-[#4B5A7A] mb-6">Approved</p>
            <p className="text-2xl font-bold text-[#8B5CF6]">1</p>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative" ref={statusFilterRef}>
          <button
            onClick={() => setStatusFilterOpen(!statusFilterOpen)}
            className={`flex items-center gap-2 bg-[#F3F3F5] border rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${statusFilter
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
                  onClick={() => { setStatusFilter(null); setStatusFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center transition-colors ${!statusFilter ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                >
                  All Status
                  {!statusFilter && <Check size={14} className="text-[#D91E75]" />}
                </button>
                {(["Under Review", "Approved", "Rejected", "Need More Info"] as ApplicationStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex justify-between items-center transition-colors ${statusFilter === s ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-600 hover:bg-gray-50 font-medium"
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
              {filteredInvestors.length > 0 ? (
                filteredInvestors.map((investor) => (
                  <tr key={investor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-bold text-gray-900 whitespace-nowrap">{investor.name}</td>
                    <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{investor.country}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getReadinessStyle(investor.readiness)}`}>
                        {investor.readiness === "Almost Ready" && <span className="mr-1">⏱</span>}
                        {investor.readiness}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{investor.budget}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getStatusStyle(investor.status)}`}>
                        {investor.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#4B5A7A] whitespace-nowrap">{investor.lastUpdated}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleViewProfile(investor.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Eye size={14} className="text-gray-400" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
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
      </div>

      <InvestorProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
      />
    </div>
  );
};

export default BankDashboard;
