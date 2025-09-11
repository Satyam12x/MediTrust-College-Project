import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Eye,
  Truck,
  History,
  Settings,
  LogOut,
  CheckCircle,
  Heart,
  Clock,
  Plus,
  Bell,
  Search,
  Filter,
  Calendar,
  MapPin,
  Shield,
  Award,
  TrendingUp,
  Package,
} from "lucide-react";

// Skeleton Loading Components
const SkeletonRow = () => (
  <tr className="border-b border-gray-200">
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-gray-300 rounded-full animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
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

const SkeletonNotification = () => (
  <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
    </div>
  </div>
);

const SkeletonNewDonorCard = () => (
  <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4">
    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
    </div>
    <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"></div>
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    impact: { livesTouched: 0, kycVerificationStatus: "Not KYC Verified" },
    badges: [],
    status: "pending",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your dashboard");
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch profile first to check OTP verification
        const profileResponse = await axios.get(
          "http://localhost:5000/api/user/profile",
          config
        );
        const profile = profileResponse.data;

        if (profile.status !== "completed") {
          setError("Please complete OTP verification to access the dashboard");
          navigate("/verify");
          return;
        }

        // Fetch all other data concurrently
        const [
          statsResponse,
          requestsResponse,
          donationsResponse,
          notificationsResponse,
          medicinesResponse,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/user/stats", config),
          axios.get("http://localhost:5000/api/user/requests", config),
          axios.get("http://localhost:5000/api/user/donations", config),
          axios.get("http://localhost:5000/api/user/notifications", config),
          axios.get("http://localhost:5000/api/medicines/available"),
        ]);

        // Process profile data
        setUserData({
          name:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.email || "User",
          email: profile.email || "",
          impact: {
            livesTouched: statsResponse.data.livesHelped || 0,
            kycVerificationStatus: profile.kycVerified
              ? "KYC Verified"
              : "Not KYC Verified",
          },
          badges:
            profile.certificates?.map((cert) => ({
              title: cert.certificateId || "Certificate",
              description: "Awarded for your contributions",
              certificateLink: cert.url || "#",
            })) || [],
          status: profile.status,
        });

        setStats(statsResponse.data);
        setRequests(requestsResponse.data);
        setDonations(donationsResponse.data);
        setNotifications(notificationsResponse.data);
        setAvailableMedicines(medicinesResponse.data);
        setError("");
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err.response?.data);
        setError(
          err.response?.data?.error ||
            (err.response?.status === 401
              ? "Please log in to view your dashboard"
              : err.response?.status === 403
              ? "Please complete OTP verification"
              : "Failed to load dashboard data")
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

  const isNewDonor = donations.length === 0 && requests.length === 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error && userData.status !== "completed") {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-['Space_Grotesk','Noto_Sans',sans-serif] flex items-center justify-center">
        <div className="text-center p-8 bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
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
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-600 text-center">
              {error}
            </div>
          )}
          {isNewDonor ? (
            <div>
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    Welcome back, {userData.name}!
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Your actions today can save a life. Let's make a difference.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 bg-[#19183B] text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-opacity">
                    <Upload className="w-5 h-5" />
                    <span>Donate Medicine</span>
                  </button>
                  <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
                    <Package className="w-5 h-5 text-[#19183B]" />
                    <span>Request Medicine</span>
                  </button>
                </div>
              </div>

              {/* New Donor Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <section className="bg-gray-100 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
                    <div className="mb-4">
                      <Heart className="text-6xl text-[#19183B]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Be a Hero Today</h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Your surplus medicine could be the miracle someone is
                      praying for. Donate now and bring hope to those in need.
                    </p>
                    <button className="flex items-center gap-2 bg-[#19183B] text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-opacity text-lg">
                      <Upload className="w-5 h-5" />
                      <span>Start a Donation</span>
                    </button>
                  </section>
                  <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">
                      Newly Available Medicines
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonNewDonorCard key={i} />
                          ))
                        : availableMedicines.map((medicine, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 border border-gray-200 hover:border-[#19183B]"
                            >
                              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <Package className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">
                                  {medicine.name} {medicine.quantity}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {medicine.storageConditions ||
                                    "General Medicine"}
                                </p>
                              </div>
                              <button className="ml-auto bg-gray-200 hover:bg-[#19183B] hover:text-white text-gray-900 font-bold py-2 px-3 rounded-full text-sm transition-colors">
                                Request
                              </button>
                            </div>
                          ))}
                    </div>
                    <div className="text-center mt-6">
                      <a
                        className="text-[#19183B] font-semibold hover:underline"
                        href="#"
                      >
                        View all available medicines →
                      </a>
                    </div>
                  </section>
                </div>
                <div className="lg:col-span-1 space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
                    {isLoading ? (
                      <div className="bg-gray-100 rounded-xl p-6 space-y-6 border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl p-6 space-y-6 border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 text-green-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                            <Heart className="text-3xl" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Lives Touched</h3>
                            <p className="text-2xl font-bold text-[#19183B]">
                              {userData.impact.livesTouched}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 text-blue-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                            <CheckCircle className="text-3xl" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              KYC Verification
                            </h3>
                            <p className="text-sm font-semibold text-green-600">
                              {userData.impact.kycVerificationStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
                    <div className="bg-gray-100 rounded-xl p-6 space-y-4 border border-gray-200">
                      {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-4 p-4 bg-gray-200 rounded-lg animate-pulse"
                          >
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div>
                              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                            </div>
                          </div>
                        ))
                      ) : userData.badges.length > 0 ? (
                        userData.badges.map((badge, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div
                              className={`rounded-full size-10 flex-shrink-0 flex items-center justify-center ${
                                index === 0
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              <Award className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold">{badge.title}</h3>
                              <p className="text-sm text-gray-600">
                                {badge.description}
                              </p>
                              <a
                                className="text-sm text-[#19183B] font-semibold hover:underline"
                                href={badge.certificateLink}
                              >
                                View Certificate
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-sm">
                          No badges earned yet. Keep donating to earn rewards!
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Header with Search and Actions */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-4xl font-bold">Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back, {userData.name}! Here's your impact overview.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      className="pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300 w-64 shadow-sm"
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-[#19183B] text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-md hover:shadow-[#19183B]/50 transition-all duration-300 hover:scale-105 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Upload Medicine</span>
                  </button>
                  <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-[#19183B] py-2.5 px-5 rounded-xl transition-all duration-300 hover:bg-gray-200 shadow-sm">
                    <Eye className="w-5 h-5" />
                    <span>View All</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : [
                      {
                        title: "Total Donations",
                        value: stats.totalDonations || 0,
                        icon: Heart,
                        color: "from-[#19183B] to-[#2C2B5A]",
                        change: stats.donationChange || "+0%",
                      },
                      {
                        title: "Active Requests",
                        value: stats.activeRequests || 0,
                        icon: Clock,
                        color: "from-blue-500 to-blue-600",
                        change: stats.requestChange || "+0%",
                      },
                      {
                        title: "Completed",
                        value: stats.completedTransactions || 0,
                        icon: CheckCircle,
                        color: "from-purple-500 to-purple-600",
                        change: stats.transactionChange || "+0%",
                      },
                      {
                        title: "Impact Score",
                        value: stats.impactScore || "0%",
                        icon: TrendingUp,
                        color: "from-orange-500 to-orange-600",
                        change: stats.impactChange || "+0%",
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
                      </div>
                    ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Request Tracking Section */}
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Request Tracking
                      </h2>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:border-[#19183B] transition-all duration-300 shadow-sm">
                          <Filter className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:border-[#19183B] transition-all duration-300 shadow-sm">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-[#19183B] transition-all duration-300 shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Request ID
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Medicine
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Quantity
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Status
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonRow key={i} />
                              ))
                            : requests.map((request, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-200 hover:bg-gray-200 transition-colors duration-300 group"
                                >
                                  <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${getPriorityDot(
                                        request.priority
                                      )}`}
                                    ></div>
                                    {request.id}
                                  </td>
                                  <td className="p-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                                    {request.medicine}
                                  </td>
                                  <td className="p-4 text-gray-600">
                                    {request.quantity}
                                  </td>
                                  <td className="p-4">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                        request.status
                                      )}`}
                                    >
                                      {request.status.charAt(0).toUpperCase() +
                                        request.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="p-4 text-gray-600">
                                    {new Date(
                                      request.date
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Donation History */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Donation History
                    </h2>
                    <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:border-[#19183B] transition-all duration-300 shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Donation ID
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Medicine
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Quantity
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Date
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-600">
                              Recipient
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonRow key={i} />
                              ))
                            : donations.map((donation, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-200 hover:bg-gray-200 transition-colors duration-300 group"
                                >
                                  <td className="p-4 font-medium text-gray-900">
                                    {donation.id}
                                  </td>
                                  <td className="p-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                                    {donation.medicine}
                                  </td>
                                  <td className="p-4 text-gray-600">
                                    {donation.quantity}
                                  </td>
                                  <td className="p-4 text-gray-600">
                                    {new Date(
                                      donation.date
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="p-4 text-gray-600 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#19183B]" />
                                    {donation.recipient || "N/A"}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                {/* Notifications and Activity */}
                <div className="lg:col-span-1">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Notifications
                      </h2>
                      <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 space-y-4 border border-gray-200 shadow-sm">
                      {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonNotification key={i} />
                          ))
                        : notifications.map((notification, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300 border border-transparent hover:border-[#19183B] group cursor-pointer shadow-sm"
                            >
                              <div
                                className={`rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                                  notification.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : notification.type === "info"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-yellow-100 text-yellow-600"
                                }`}
                              >
                                {notification.type === "success" ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : notification.type === "info" ? (
                                  <Heart className="w-5 h-5" />
                                ) : (
                                  <Clock className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-[#19183B] transition-colors duration-300">
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Your Impact
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lives Helped</span>
                          <span className="text-[#19183B] font-bold">
                            {stats.livesHelped || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Medicines Donated
                          </span>
                          <span className="text-[#19183B] font-bold">
                            {stats.totalDonations || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Trust Score</span>
                          <span className="text-[#19183B] font-bold">
                            {stats.trustScore || "0%"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="w-full bg-[#19183B] text-white py-2 px-4 rounded-lg hover:shadow-md hover:shadow-[#19183B]/50 transition-all duration-300 hover:scale-105">
                          View Full Report
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
