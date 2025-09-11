// Updated Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Upload,
  Truck,
  History,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
  Award,
  TrendingUp,
  Package,
  User,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userData, setUserData] = useState({
    name: "User",
    userType: "Donor",
    kycVerified: false,
    profilePicture: "https://via.placeholder.com/48",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const navItems = [
    { id: "dashboard", icon: TrendingUp, label: "Dashboard", active: true },
    { id: "upload", icon: Upload, label: "Upload Medicine" },
    { id: "medicines", icon: Package, label: "Available Medicines" },
    { id: "tracking", icon: Truck, label: "Request Tracking" },
    { id: "history", icon: History, label: "Donation History" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "kyc", icon: CheckCircle, label: "KYC Verification" },
    { id: "certificates", icon: Award, label: "Certificates" },
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your profile");
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          config
        );
        const profile = response.data;

        if (profile.status !== "completed") {
          setError("Please complete OTP verification to access the dashboard");
          navigate("/verify");
          return;
        }

        setUserData({
          name:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.email || "User",
          userType: formatUserType(profile.userType),
          kycVerified: profile.kycVerified,
          profilePicture:
            profile.profilePicture || "https://via.placeholder.com/48",
          status: profile.status,
        });
        setError("");
      } catch (err) {
        console.error("Sidebar Profile Fetch Error:", err.response?.data);
        setError(
          err.response?.data?.error ||
            (err.response?.status === 401
              ? "Please log in to view your profile"
              : err.response?.status === 403
              ? "Please complete OTP verification"
              : "Failed to load profile data")
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate(err.response?.status === 401 ? "/login" : "/verify");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Format userType for display
  const formatUserType = (userType) => {
    if (!userType) return "Donor";
    const types = userType.split(",").map((type) => {
      switch (type.trim().toLowerCase()) {
        case "donor":
          return "Donor";
        case "patient":
          return "Patient";
        case "hospital":
          return "Hospital";
        default:
          return type.trim();
      }
    });
    return types.join(" & ");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Skeleton loader for user info
  const SkeletonUserInfo = () => (
    <div className="flex items-center gap-3 mb-8">
      <div className="rounded-full size-12 bg-gray-300 animate-pulse"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );

  if (error && userData.status !== "completed") {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 font-['Space_Grotesk','Noto_Sans',sans-serif] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
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
    <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between min-h-screen sticky top-0 font-['Space_Grotesk','Noto_Sans',sans-serif] text-gray-900">
      <div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}
        {isLoading ? (
          <SkeletonUserInfo />
        ) : (
          <div className="flex items-center gap-3 mb-8">
            <img
              alt="User avatar"
              className="rounded-full size-12 object-cover"
              src={userData.profilePicture}
              onError={(e) => (e.target.src = "https://via.placeholder.com/48")}
            />
            <div>
              <h1 className="font-bold text-lg">{userData.name}</h1>
              <p className="text-sm text-gray-600">{userData.userType}</p>
              <p className="text-xs text-gray-500">
                {userData.kycVerified ? "KYC Verified" : "Not KYC Verified"}
              </p>
            </div>
          </div>
        )}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-[#19183B] text-white font-bold"
                  : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-300"
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-300">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
