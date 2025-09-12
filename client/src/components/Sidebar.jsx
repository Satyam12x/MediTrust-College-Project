import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userType: "Donor",
    kycVerified: false,
    profilePicture: "",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const navItems = [
    {
      id: "dashboard",
      icon: TrendingUp,
      label: "Dashboard",
      path: "/dashboard",
    },
    { id: "upload", icon: Upload, label: "Upload Medicine", path: "/upload" },
    {
      id: "medicines",
      icon: Package,
      label: "Available Medicines",
      path: "/medicines",
    },
    {
      id: "tracking",
      icon: Truck,
      label: "Request Tracking",
      path: "/tracking",
    },
    {
      id: "history",
      icon: History,
      label: "Donation History",
      path: "/history",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
    { id: "kyc", icon: CheckCircle, label: "KYC Verification", path: "/kyc" },
    {
      id: "certificates",
      icon: Award,
      label: "Certificates",
      path: "/certificates",
    },
  ];

  // Skeleton loader for user info
  const SkeletonUserInfo = () => (
    <div className="flex items-center gap-3 mb-8">
      <div className="rounded-full w-12 h-12 bg-gray-300 animate-pulse"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-16 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
      </div>
    </div>
  );

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
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          userType: formatUserType(profile.userType),
          kycVerified: profile.kycVerified,
          profilePicture: profile.profilePicture || "",
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
    <aside className="w-64 bg-[#19183B] text-white p-6 flex flex-col justify-between min-h-screen sticky top-0 font-['Space_Grotesk','Noto_Sans',sans-serif]">
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
            {userData.profilePicture ? (
              <img
                alt="User avatar"
                className="rounded-full w-12 h-12 object-cover"
                src={userData.profilePicture}
                onError={(e) => (e.target.src = "/images/placeholder.png")}
              />
            ) : (
              <div className="rounded-full w-12 h-12 bg-gray-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-sm text-gray-400">{userData.userType}</p>
              <p className="text-xs text-gray-500">
                {userData.kycVerified ? "KYC Verified" : "Not KYC Verified"}
              </p>
            </div>
          </div>
        )}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setActiveTab(item.id)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive || activeTab === item.id
                    ? "bg-white text-[#19183B] font-bold"
                    : "text-gray-300 hover:bg-[#2A2A5A] hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <NavLink
          to="/profile"
          onClick={() => setActiveTab("profile")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
              isActive || activeTab === "profile"
                ? "bg-white text-[#19183B] font-bold"
                : "text-gray-300 hover:bg-[#2A2A5A] hover:text-white"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          onClick={() => setActiveTab("settings")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
              isActive || activeTab === "settings"
                ? "bg-white text-[#19183B] font-bold"
                : "text-gray-300 hover:bg-[#2A2A5A] hover:text-white"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-full text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
