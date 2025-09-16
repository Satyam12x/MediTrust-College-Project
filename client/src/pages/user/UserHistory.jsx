import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Heart,
  TrendingUp,
  Award,
  Shield,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Activity,
  Zap,
} from "lucide-react";

// Skeleton Components
const SkeletonRow = () => (
  <tr className="border-b border-gray-200">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-24 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <div className="h-8 bg-gray-300 rounded animate-pulse w-16"></div>
        <div className="h-8 bg-gray-300 rounded animate-pulse w-16"></div>
      </div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="h-8 bg-gray-300 rounded animate-pulse w-1/3"></div>
      <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded animate-pulse mb-2"></div>
    <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
  </div>
);

const DonationHistory = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [donationData, setDonationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    kycVerified: false,
    livesTouched: 0,
    trustScore: "0%",
    joinDate: "",
    profilePicture: "",
    donationCount: 0,
    requestCount: 0,
    donationChange: "+0%",
    requestChange: "+0%",
    transactionChange: "+0%",
    impactChange: "+0%",
    badges: [],
  });
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your donation history");
          navigate("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [donationsResponse, profileResponse, statsResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/donations/history", config),
            axios.get("http://localhost:5000/api/user/profile", config),
            axios.get("http://localhost:5000/api/user/stats", config),
          ]);

        const profile = profileResponse.data;
        const stats = statsResponse.data;

        if (profile.status !== "completed") {
          setError(
            "Please complete OTP verification to access your donation history"
          );
          navigate("/verify");
          return;
        }

        setDonationData(donationsResponse.data || []);
        setUserData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          kycVerified: profile.kycVerified,
          livesTouched: stats.livesHelped || 0,
          trustScore: stats.trustScore || "0%",
          joinDate: profile.createdAt || new Date().toISOString(),
          profilePicture: profile.profilePicture || "",
          donationCount: stats.totalDonations || 0,
          requestCount: profile.requestCount || 0,
          donationChange: stats.donationChange || "+0%",
          requestChange: stats.requestChange || "+0%",
          transactionChange: stats.transactionChange || "+0%",
          impactChange: stats.impactChange || "+0%",
          badges:
            profile.certificates?.map((cert, index) => ({
              type: index === 0 ? "gold" : index === 1 ? "silver" : "bronze",
              title: cert.certificateId || "Certificate",
              url: cert.url || "#",
            })) || [],
        });
        setError("");
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(
          err.response?.data?.error ||
            (err.response?.status === 401
              ? "Please log in to view your donation history"
              : err.response?.status === 403
              ? "Please complete OTP verification"
              : "Failed to load donation history")
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate(err.response?.status === 401 ? "/login" : "/verify");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-600 border-green-200";
      case "in transit":
      case "processing":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "in transit":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredData = donationData.filter((item) => {
    const matchesSearch =
      item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesDate =
      dateRange === "all" ||
      (() => {
        const itemDate = new Date(item.date);
        const now = new Date();
        switch (dateRange) {
          case "week":
            return itemDate >= new Date(now.setDate(now.getDate() - 7));
          case "month":
            return itemDate >= new Date(now.setMonth(now.getMonth() - 1));
          case "year":
            return itemDate >= new Date(now.setFullYear(now.getFullYear() - 1));
          default:
            return true;
        }
      })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalDonations = donationData.length;
  const totalValue = donationData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const deliveredCount = donationData.filter(
    (item) => item.status.toLowerCase() === "delivered"
  ).length;
  const avgRating = 4.8; // This would come from backend

  const handleTrackDonation = async (trackingId) => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/donations/track/${trackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Tracking status for ${trackingId}: ${response.data.status}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to track donation");
    }
  };

  const profileCompletion = userData.kycVerified
    ? userData.profilePicture
      ? 100
      : 90
    : userData.profilePicture
    ? 80
    : 70;

  if (error && !userData.firstName) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-['Space_Grotesk','Noto_Sans',sans-serif] flex items-center justify-center">
        <div className="text-center p-8 bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <button
            onClick={() => navigate("/verify")}
            className="bg-[#19183B] text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-opacity"
          >
            Go to Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Space_Grotesk','Noto_Sans',sans-serif]">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Donation History
              </h1>
              <p className="text-gray-600 mt-1">
                Track your impact and see how your contributions are making a
                difference
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-[#19183B] py-2.5 px-4 rounded-xl transition-all duration-300 hover:bg-gray-200 shadow-sm">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
              <button className="flex items-center gap-2 bg-[#19183B] text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-md hover:shadow-[#19183B]/50 transition-all duration-300 hover:scale-105">
                <Eye className="w-5 h-5" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-600 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-600 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : [
                  {
                    title: "Total Donations",
                    value: totalDonations,
                    icon: Heart,
                    color: "from-[#19183B] to-[#2C2B5A]",
                    change: userData.donationChange,
                    subtitle: "medicines donated",
                  },
                  {
                    title: "Total Value",
                    value: `$${totalValue.toFixed(0)}`,
                    icon: TrendingUp,
                    color: "from-green-500 to-green-600",
                    change: userData.transactionChange,
                    subtitle: "estimated value",
                  },
                  {
                    title: "Successfully Delivered",
                    value: deliveredCount,
                    icon: CheckCircle,
                    color: "from-blue-500 to-blue-600",
                    change: "+12%",
                    subtitle: "completed donations",
                  },
                  {
                    title: "Average Rating",
                    value: avgRating.toFixed(1),
                    icon: Star,
                    color: "from-orange-500 to-orange-600",
                    change: "+0.2",
                    subtitle: "recipient feedback",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-xl p-6 border border-gray-200 hover:border-[#19183B] transition-all duration-300 hover:shadow-md group hover:scale-[1.02] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[#19183B] text-sm font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Controls */}
              <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search donations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300 shadow-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="delivered">Delivered</option>
                      <option value="in transit">In Transit</option>
                      <option value="processing">Processing</option>
                      <option value="pending">Pending</option>
                    </select>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300 shadow-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="year">Past Year</option>
                    </select>
                    <button className="p-3 bg-white border border-gray-200 rounded-xl hover:border-[#19183B] transition-all duration-300 shadow-sm">
                      <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Donations Table */}
              <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-[#19183B] transition-all duration-300 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Medicine/Item
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Quantity
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Recipient
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Value
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <SkeletonRow key={i} />
                        ))
                      ) : currentData.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <Package className="w-16 h-16 text-gray-400" />
                              <h3 className="text-lg font-semibold text-gray-600">
                                No donations found
                              </h3>
                              <p className="text-gray-500">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentData.map((donation, index) => (
                          <tr
                            key={donation.id || index}
                            className="border-b border-gray-200 hover:bg-gray-200 transition-colors duration-300 group"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {donation.medicine}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {donation.type || "General Medicine"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600">
                              {new Date(donation.date).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-gray-600">
                              {donation.quantity}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-[#19183B]" />
                                {donation.recipient || "Anonymous"}
                              </div>
                            </td>
                            <td className="p-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  donation.status
                                )}`}
                              >
                                {getStatusIcon(donation.status)}
                                {donation.status}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-gray-900">
                              ${(donation.value || 0).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button className="text-gray-600 hover:text-[#19183B] transition-colors text-sm font-medium">
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    handleTrackDonation(
                                      donation.trackingId || donation.id
                                    )
                                  }
                                  className="text-[#19183B] hover:text-blue-800 transition-colors text-sm font-medium"
                                >
                                  Track
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-[#19183B] text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Completion
                  </h3>
                  {isLoading ? (
                    <div className="h-6 w-12 bg-gray-300 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-2xl font-bold text-[#19183B]">
                      {profileCompletion}%
                    </span>
                  )}
                </div>
                {isLoading ? (
                  <div className="h-3 w-full bg-gray-300 rounded-full animate-pulse"></div>
                ) : (
                  <>
                    <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-[#19183B] to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {profileCompletion < 100
                        ? "Complete your profile to unlock all features"
                        : "Your profile is complete!"}
                    </p>
                  </>
                )}
              </div>

              {/* Impact Overview */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Your Impact
                </h3>
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lives Helped</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {userData.livesTouched}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        {userData.impactChange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Trust Score</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {userData.trustScore}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-200 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.donationCount}
                        </p>
                        <p className="text-sm text-gray-600">Donations</p>
                      </div>
                      <div className="text-center p-4 bg-gray-200 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.requestCount}
                        </p>
                        <p className="text-sm text-gray-600">Requests</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Status
                </h3>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">KYC Verification</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userData.kycVerified
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {userData.kycVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Account Status</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Active
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Achievements
                </h3>
                {isLoading ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ) : userData.badges && userData.badges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {userData.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer group"
                        title={`${badge.title} - ${
                          badge.type.charAt(0).toUpperCase() +
                          badge.type.slice(1)
                        } Badge`}
                      >
                        <div
                          className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
                            badge.type === "gold"
                              ? "bg-yellow-100"
                              : badge.type === "silver"
                              ? "bg-gray-300"
                              : "bg-orange-100"
                          }`}
                        >
                          <Award
                            className={`w-5 h-5 ${
                              badge.type === "gold"
                                ? "text-yellow-600"
                                : badge.type === "silver"
                                ? "text-gray-600"
                                : "text-orange-600"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-600 capitalize font-medium">
                          {badge.type}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No achievements yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Keep helping others to earn badges!
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-[#19183B] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Donate Medicine</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" />
                      <span className="font-medium">Request Medicine</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5" />
                      <span className="font-medium">View Analytics</span>
                    </div>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg animate-pulse"
                      >
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-300 rounded mb-1"></div>
                          <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : donationData.length > 0 ? (
                  <div className="space-y-3">
                    {donationData.slice(0, 3).map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                            activity.status
                          ).replace("border-", "border ")}`}
                        >
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.medicine} donated
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full text-[#19183B] font-medium text-sm hover:underline mt-2">
                      View all activity
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DonationHistory;
