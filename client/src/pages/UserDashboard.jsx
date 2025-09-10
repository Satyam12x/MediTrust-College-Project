import React, { useState, useEffect } from "react";
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
  <tr className="border-b border-gray-800/50">
    <td className="p-4">
      <div className="h-4 bg-gray-800/50 rounded animate-pulse"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-800/50 rounded animate-pulse w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-800/50 rounded animate-pulse w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-gray-800/50 rounded-full animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-800/50 rounded animate-pulse w-2/3"></div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
    <div className="flex items-center justify-between mb-4">
      <div className="h-8 bg-gray-800/50 rounded animate-pulse w-1/3"></div>
      <div className="h-8 w-8 bg-gray-800/50 rounded-full animate-pulse"></div>
    </div>
    <div className="h-12 bg-gray-800/50 rounded animate-pulse mb-2"></div>
    <div className="h-4 bg-gray-800/50 rounded animate-pulse w-2/3"></div>
  </div>
);

const SkeletonNotification = () => (
  <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg">
    <div className="w-10 h-10 bg-gray-800/50 rounded-full animate-pulse flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-800/50 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-800/50 rounded animate-pulse w-3/4"></div>
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

  const navItems = [
    { id: "dashboard", icon: TrendingUp, label: "Dashboard", active: true },
    { id: "upload", icon: Upload, label: "Upload Medicine" },
    { id: "medicines", icon: Package, label: "Available Medicines" },
    { id: "tracking", icon: Truck, label: "Request Tracking" },
    { id: "history", icon: History, label: "Donation History" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20">
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-gray-950/90 backdrop-blur-xl border-r border-green-500/20 p-6 flex flex-col justify-between min-h-screen sticky top-0">
          <div>
            {/* Profile Section with Enhanced Animation */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                  SC
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-950 flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors duration-300">
                  Sophia Clark
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Verified Donor
                </p>
              </div>
            </div>

            {/* Navigation with Enhanced Hover Effects */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                      : "hover:bg-green-500/10 text-gray-300 hover:text-green-400 border border-transparent hover:border-green-500/30"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 transition-all duration-300"></div>
                  <item.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium relative z-10">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800/50 text-gray-300 hover:text-green-400 transition-all duration-300 group border border-transparent hover:border-green-500/30">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/30">
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-8">
          {/* Header with Search and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Welcome back, Sophia! Here's your impact overview.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 w-64"
                />
              </div>

              {/* Action Buttons */}
              <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Upload Medicine</span>
              </button>
              <button className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-green-400 hover:border-green-500/50 py-2.5 px-5 rounded-xl transition-all duration-300 hover:bg-gray-800/70">
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
                    color: "from-green-500 to-green-600",
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
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm font-medium">
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Request Tracking Section */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Request Tracking
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-green-500/50 transition-all duration-300">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-green-500/50 transition-all duration-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50 hover:border-green-500/20 transition-all duration-300">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Request ID
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Medicine
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Quantity
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
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
                              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 group"
                            >
                              <td className="p-4 font-medium text-white flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${getPriorityDot(
                                    request.priority
                                  )}`}
                                ></div>
                                {request.id}
                              </td>
                              <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                                {request.medicine}
                              </td>
                              <td className="p-4 text-gray-300">
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
                              <td className="p-4 text-gray-300">
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
                <h2 className="text-2xl font-bold text-white mb-6">
                  Donation History
                </h2>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50 hover:border-green-500/20 transition-all duration-300">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Donation ID
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Medicine
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Quantity
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
                          Date
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400">
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
                              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 group"
                            >
                              <td className="p-4 font-medium text-white">
                                {donation.id}
                              </td>
                              <td className="p-4 text-gray-300 group-hover:text-white transition-colors duration-300">
                                {donation.medicine}
                              </td>
                              <td className="p-4 text-gray-300">
                                {donation.quantity}
                              </td>
                              <td className="p-4 text-gray-300">
                                {donation.date}
                              </td>
                              <td className="p-4 text-gray-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-500" />
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
                  <h2 className="text-2xl font-bold text-white">
                    Notifications
                  </h2>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-gray-800/50">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonNotification key={i} />
                      ))
                    : notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-green-500/30 group cursor-pointer"
                        >
                          <div
                            className={`rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                              notification.type === "success"
                                ? "bg-green-500/20 text-green-400"
                                : notification.type === "info"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-yellow-500/20 text-yellow-400"
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
                            <h3 className="font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
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
                <div className="mt-8 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Your Impact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Lives Helped</span>
                      <span className="text-green-400 font-bold">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Medicines Donated</span>
                      <span className="text-green-400 font-bold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Trust Score</span>
                      <span className="text-green-400 font-bold">98%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-500/20">
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
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
