import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DonationHistory = () => {
  const [donationData, setDonationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
  const itemsPerPage = 5;
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
          donationCount: profile.donationCount || 0,
          requestCount: profile.requestCount || 0,
          donationChange: stats.donationChange || "+0%",
          requestChange: stats.requestChange || "+0%",
          transactionChange: stats.transactionChange || "+0%",
          impactChange: stats.impactChange || "+0%",
          badges: profile.badges || [],
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
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = donationData.filter(
    (item) =>
      item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    (item) => item.status === "Delivered"
  ).length;

  const profileCompletion = userData.profilePicture
    ? userData.kycVerified
      ? 95
      : 80
    : 65;

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

  if (error && userData.status !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter','Noto_Sans',sans-serif] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-red-800 mb-4">{error}</h1>
          <button
            onClick={() => navigate("/verify")}
            className="bg-gradient-to-r from-navy-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-navy-700 hover:to-blue-700 transition-all duration-200"
          >
            Go to Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter','Noto_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  history
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Donation History
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <span className="material-symbols-outlined text-red-500 flex-shrink-0">
              error
            </span>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <span className="material-symbols-outlined text-green-500 flex-shrink-0">
              check_circle
            </span>
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Donation History
              </h1>
              <p className="text-xl text-slate-600">
                Track your impact and see how your contributions are making a
                difference
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Total Donations
                    </p>
                    {isLoading ? (
                      <div className="h-8 w-12 bg-slate-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold text-slate-900">
                        {totalDonations}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-navy-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">
                      volunteer_activism
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Total Value
                    </p>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold text-slate-900">
                        ${totalValue.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">
                      trending_up
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Delivered
                    </p>
                    {isLoading ? (
                      <div className="h-8 w-12 bg-slate-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold text-slate-900">
                        {deliveredCount}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Data Display */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Medicine/Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {isLoading ? (
                      Array(5)
                        .fill()
                        .map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4">
                              <div className="h-4 w-24 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-20 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-16 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-16 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-12 bg-slate-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 w-24 bg-slate-200 rounded"></div>
                            </td>
                          </tr>
                        ))
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-4 text-center text-slate-500"
                        >
                          No donations found
                        </td>
                      </tr>
                    ) : (
                      currentData.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-slate-900">
                              {donation.medicine}
                            </div>
                            <div className="text-sm text-slate-500">
                              {donation.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(donation.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {donation.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {donation.recipient}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(
                                donation.status
                              )}`}
                            >
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            ${donation.value.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-slate-600 hover:text-slate-800 transition-colors mr-3">
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleTrackDonation(donation.trackingId)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="material-symbols-outlined w-5 h-5">
                  chevron_left
                </span>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-navy-600 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
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
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="material-symbols-outlined w-5 h-5">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Profile Completion
                </h3>
                {isLoading ? (
                  <div className="h-6 w-12 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  <span className="text-2xl font-bold text-blue-600">
                    {profileCompletion}%
                  </span>
                )}
              </div>
              {isLoading ? (
                <div className="h-3 w-full bg-slate-200 rounded-full animate-pulse"></div>
              ) : (
                <>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {profileCompletion < 100
                      ? "Complete your profile to unlock all features"
                      : "Your profile is complete!"}
                  </p>
                </>
              )}
            </div>

            {/* Impact Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Impact Overview
              </h3>
              {isLoading ? (
                <div className="space-y-6">
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">
                          trending_up
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Lives Helped</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {userData.livesTouched}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium">
                      {userData.impactChange}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">
                          star
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Trust Score</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {userData.trustScore}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-2xl font-bold text-slate-900">
                        {userData.donationCount}
                      </p>
                      <p className="text-sm text-slate-600">Donations</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-2xl font-bold text-slate-900">
                        {userData.requestCount}
                      </p>
                      <p className="text-sm text-slate-600">Requests</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Account Status
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-6 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-6 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-green-500">
                        verified
                      </span>
                      <span className="text-slate-700">KYC Verification</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        userData.kycVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {userData.kycVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="material-symbols-outlined text-green-500">
                        check_circle
                      </span>
                      <span className="text-slate-700">Account Status</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {userData.status === "completed" ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Achievements
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : userData.badges && userData.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {userData.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-slate-50 rounded-xl"
                      title={`${
                        badge.type.charAt(0).toUpperCase() + badge.type.slice(1)
                      } Badge`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                          badge.type === "gold"
                            ? "bg-yellow-100"
                            : badge.type === "silver"
                            ? "bg-gray-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined w-6 h-6 ${
                            badge.type === "gold"
                              ? "text-yellow-600"
                              : badge.type === "silver"
                              ? "text-gray-600"
                              : "text-orange-600"
                          }`}
                        >
                          {badge.type === "gold"
                            ? "emoji_events"
                            : badge.type === "silver"
                            ? "volunteer_activism"
                            : "verified_user"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 capitalize">
                        {badge.type}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined w-8 h-8 text-slate-400">
                      emoji_events
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">No achievements yet</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Keep helping others to earn badges!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
