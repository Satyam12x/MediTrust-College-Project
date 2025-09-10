import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
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
  <tr className="border-b border-gray-300">
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
    <div className="h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
  </div>
);

const SkeletonNotification = () => (
  <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setStats({
        totalDonations: 45,
        totalRequests: 12,
        completedTransactions: 38,
        activeRequests: 7,
      });
      setRequests([
        {
          id: "#12345",
          medicine: "Amoxicillin",
          quantity: "500mg",
          status: "pending",
          date: "2024-07-26",
          priority: "high",
        },
        {
          id: "#67890",
          medicine: "Ibuprofen",
          quantity: "200mg",
          status: "approved",
          date: "2024-07-20",
          priority: "medium",
        },
        {
          id: "#11223",
          medicine: "Paracetamol",
          quantity: "500mg",
          status: "completed",
          date: "2024-07-15",
          priority: "low",
        },
      ]);
      setDonations([
        {
          id: "#98765",
          medicine: "Aspirin",
          quantity: "100mg",
          date: "2024-07-25",
          recipient: "City Hospital",
          impact: 25,
        },
        {
          id: "#54321",
          medicine: "Cetirizine",
          quantity: "10mg",
          date: "2024-07-18",
          recipient: "Community Clinic",
          impact: 15,
        },
        {
          id: "#45678",
          medicine: "Omeprazole",
          quantity: "20mg",
          date: "2024-07-10",
          recipient: "Local NGO",
          impact: 30,
        },
      ]);
      setNotifications([
        {
          type: "success",
          title: "Request Approved",
          message: "Your request for Ibuprofen has been approved.",
          time: "2 min ago",
        },
        {
          type: "info",
          title: "Donation Received",
          message: "Thank you for your donation of Aspirin.",
          time: "1 hour ago",
        },
        {
          type: "warning",
          title: "New Medicine Available",
          message: "A new batch of Paracetamol is now available.",
          time: "3 hours ago",
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-[#e6efeb] font-['Poppins']">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          {/* Header with Search and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1C352D]">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back, Sophia! Here's your impact overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C352D] focus:border-[#1C352D] transition-all duration-300 w-64 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#1C352D] text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-md hover:shadow-[#1C352D]/50 transition-all duration-300 hover:scale-105 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Upload Medicine</span>
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-[#1C352D] hover:border-[#1C352D] py-2.5 px-5 rounded-xl transition-all duration-300 hover:bg-gray-50 shadow-sm">
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
                    value: stats.totalDonations,
                    icon: Heart,
                    color: "from-[#1C352D] to-[#2E5D47]",
                    change: "+12%",
                  },
                  {
                    title: "Active Requests",
                    value: stats.activeRequests,
                    icon: Clock,
                    color: "from-blue-500 to-blue-600",
                    change: "+5%",
                  },
                  {
                    title: "Completed",
                    value: stats.completedTransactions,
                    icon: CheckCircle,
                    color: "from-purple-500 to-purple-600",
                    change: "+18%",
                  },
                  {
                    title: "Impact Score",
                    value: "95%",
                    icon: TrendingUp,
                    color: "from-orange-500 to-orange-600",
                    change: "+8%",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#1C352D] transition-all duration-300 hover:shadow-md group hover:scale-[1.02] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[#1C352D] text-sm font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Request Tracking Section */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Request Tracking
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#1C352D] transition-all duration-300 shadow-sm">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#1C352D] transition-all duration-300 shadow-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1C352D] transition-all duration-300 shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Request ID
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Medicine
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Quantity
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
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
                              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300 group"
                            >
                              <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${getPriorityDot(
                                    request.priority
                                  )}`}
                                ></div>
                                {request.id}
                              </td>
                              <td className="p-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
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
                                {request.date}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Donation History */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Donation History
                </h2>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1C352D] transition-all duration-300 shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Donation ID
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Medicine
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Quantity
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
                          Date
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-500">
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
                              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300 group"
                            >
                              <td className="p-4 font-medium text-gray-800">
                                {donation.id}
                              </td>
                              <td className="p-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                {donation.medicine}
                              </td>
                              <td className="p-4 text-gray-600">
                                {donation.quantity}
                              </td>
                              <td className="p-4 text-gray-600">
                                {donation.date}
                              </td>
                              <td className="p-4 text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#1C352D]" />
                                {donation.recipient}
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    Notifications
                  </h2>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="bg-white rounded-xl p-6 space-y-4 border border-gray-200 shadow-sm">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonNotification key={i} />
                      ))
                    : notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-[#1C352D] group cursor-pointer shadow-sm"
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
                            <h3 className="font-bold text-gray-800 group-hover:text-[#1C352D] transition-colors duration-300">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Your Impact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lives Helped</span>
                      <span className="text-[#1C352D] font-bold">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Medicines Donated</span>
                      <span className="text-[#1C352D] font-bold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trust Score</span>
                      <span className="text-[#1C352D] font-bold">98%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full bg-[#1C352D] text-white py-2 px-4 rounded-lg hover:shadow-md hover:shadow-[#1C352D]/50 transition-all duration-300 hover:scale-105">
                      View Full Report
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;