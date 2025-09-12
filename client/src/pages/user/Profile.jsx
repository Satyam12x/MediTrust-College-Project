import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  CheckCircle,
  Award,
  Heart,
  TrendingUp,
  Shield,
  AlertCircle,
  Lock,
  Edit,
  Save,
  X,
  Copy,
  Download,
  Star,
  Calendar,
  MapPin,
  Building,
  UserCheck,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";

// Cloudinary widget script (loaded dynamically)
const loadCloudinaryScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => resolve(window.cloudinary);
    document.body.appendChild(script);
  });
};

// Skeleton Loading Components
const SkeletonCard = () => (
  <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-24"></div>
        <div className="h-6 bg-gray-300 rounded animate-pulse w-32"></div>
      </div>
    </div>
  </div>
);

const SkeletonBadge = () => (
  <div className="bg-gray-200 rounded-xl p-4 border border-gray-300">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded animate-pulse mb-1 w-20"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-32"></div>
      </div>
    </div>
    <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
  </div>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
    status: "pending",
    kycVerified: false,
    certificates: [],
    livesTouched: 0,
    trustScore: "0%",
    badges: [],
    joinDate: "",
    location: "",
    profilePicture: "",
    donationCount: 0,
    requestCount: 0,
    donationChange: "+0%",
    requestChange: "+0%",
    transactionChange: "+0%",
    impactChange: "+0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState({
    email: false,
    phone: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    otp: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    otp: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        const [profileResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/user/profile", config),
          axios.get("http://localhost:5000/api/user/stats", config),
        ]);

        const profile = profileResponse.data;
        const stats = statsResponse.data;

        if (profile.status !== "completed") {
          setError("Please complete OTP verification to access your profile");
          navigate("/verify");
          return;
        }

        setUserData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          userType: formatUserType(profile.userType),
          status: profile.status,
          kycVerified: profile.kycVerified,
          certificates: profile.certificates || [],
          livesTouched: stats.livesHelped || 0,
          trustScore: stats.trustScore || "0%",
          joinDate: profile.createdAt || new Date().toISOString(),
          location: profile.location || "Not specified",
          profilePicture: profile.profilePicture || "",
          badges: profile.badges || [],
          donationCount: profile.donationCount || 0,
          requestCount: profile.requestCount || 0,
          donationChange: stats.donationChange || "+0%",
          requestChange: stats.requestChange || "+0%",
          transactionChange: stats.transactionChange || "+0%",
          impactChange: stats.impactChange || "+0%",
        });
        setFormData({
          email: profile.email || "",
          phone: profile.phone || "",
          otp: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setError("");
      } catch (err) {
        console.error("Profile Fetch Error:", err.response?.data);
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

    fetchData();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmail = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        setError("Please provide a valid email address");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/user/update-email",
        { newEmail: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing((prev) => ({ ...prev, email: true }));
      setSuccess(response.data.message || "OTP sent to your new email");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (!formData.otp || !/^\d{6}$/.test(formData.otp)) {
        setError("Please provide a valid 6-digit OTP");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/user/verify-update-email",
        { newEmail: formData.email, otp: formData.otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, email: formData.email }));
      setFormData((prev) => ({ ...prev, otp: "" }));
      setIsEditing((prev) => ({ ...prev, email: false }));
      setSuccess(response.data.message || "Email updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
    }
  };

  const handleUpdatePhone = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (!formData.phone || !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
        setError("Please provide a valid phone number (e.g., +1234567890)");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/user/update-phone",
        { newPhone: formData.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, phone: formData.phone }));
      setIsEditing((prev) => ({ ...prev, phone: false }));
      setSuccess(response.data.message || "Phone number updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update phone number");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setError("");
      setSuccess("");
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmNewPassword
      ) {
        setError("Please fill in all password fields");
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("New passwords do not match");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/user/update-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setIsEditing((prev) => ({ ...prev, password: false }));
      setSuccess(response.data.message || "Password updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleUploadProfilePicture = async () => {
    try {
      setError("");
      setSuccess("");
      const cloudinary = await loadCloudinaryScript();
      const widget = cloudinary.createUploadWidget(
        {
          cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "meditrust_profile",
          sources: ["local", "camera"],
          multiple: false,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpg", "jpeg"],
          maxFileSize: 5000000, // 5MB
          cropping: true,
          folder: "meditrust_profiles",
        },
        async (error, result) => {
          if (error) {
            setError("Failed to upload image");
            console.error("Cloudinary Upload Error:", error);
            return;
          }
          if (result.event === "success") {
            const imageUrl = result.info.secure_url;
            const token = localStorage.getItem("token");
            try {
              const response = await axios.post(
                "http://localhost:5000/api/user/update-profile-picture",
                { profilePicture: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setUserData((prev) => ({ ...prev, profilePicture: imageUrl }));
              setSuccess(
                response.data.message || "Profile picture updated successfully"
              );
            } catch (err) {
              setError(
                err.response?.data?.error || "Failed to update profile picture"
              );
            }
          }
        }
      );
      widget.open();
    } catch (err) {
      setError("Failed to initialize image upload");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "silver":
        return "from-gray-400 to-gray-600";
      case "bronze":
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  if (error && userData.status !== "completed") {
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
              <h1 className="text-4xl font-bold">Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and view your impact
              </p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-gray-100 border border-gray-200 py-2.5 px-5 rounded-xl hover:border-[#19183B] transition-all duration-300 shadow-sm">
                <Settings className="w-5 h-5 text-[#19183B]" />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-2 bg-[#19183B] text-white py-2.5 px-5 rounded-xl hover:shadow-md hover:shadow-[#19183B]/50 transition-all duration-300 hover:scale-105">
                <Download className="w-5 h-5" />
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-xl text-green-600 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information Card */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Profile Completion
                    </span>
                    <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#19183B] rounded-full"
                        style={{
                          width: userData.profilePicture ? "90%" : "85%",
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-[#19183B]">
                      {userData.profilePicture ? "90%" : "85%"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <ImageIcon className="w-4 h-4" />
                      Profile Picture
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between group">
                        {userData.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                        <button
                          onClick={handleUploadProfilePicture}
                          className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300">
                        <p className="font-semibold text-gray-900">
                          {userData.firstName} {userData.lastName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* User Type */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Building className="w-4 h-4" />
                      Account Type
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300">
                        <span className="px-3 py-1 bg-[#19183B] text-white rounded-full text-sm font-medium">
                          {userData.userType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : isEditing.email ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter new email"
                            className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                          />
                          <button
                            onClick={handleUpdateEmail}
                            disabled={!formData.email}
                            className="bg-[#19183B] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Send OTP
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing((prev) => ({
                                ...prev,
                                email: false,
                              }));
                              setFormData((prev) => ({
                                ...prev,
                                email: userData.email,
                                otp: "",
                              }));
                            }}
                            className="bg-gray-300 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {isEditing.email && (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type={showPassword.otp ? "text" : "password"}
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                placeholder="Enter OTP"
                                className="w-full bg-white border border-gray-300 rounded-lg p-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPassword((prev) => ({
                                    ...prev,
                                    otp: !prev.otp,
                                  }))
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword.otp ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={handleVerifyEmailOtp}
                              disabled={!formData.otp}
                              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Verify
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between group">
                        <p className="font-semibold text-gray-900">
                          {userData.email}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => copyToClipboard(userData.email)}
                            className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setIsEditing((prev) => ({ ...prev, email: true }))
                            }
                            className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : isEditing.phone ? (
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter new phone number"
                          className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                        />
                        <button
                          onClick={handleUpdatePhone}
                          disabled={!formData.phone}
                          className="bg-[#19183B] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing((prev) => ({ ...prev, phone: false }));
                            setFormData((prev) => ({
                              ...prev,
                              phone: userData.phone,
                            }));
                          }}
                          className="bg-gray-300 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between group">
                        <p className="font-semibold text-gray-900">
                          {userData.phone || "Not set"}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {userData.phone && (
                            <button
                              onClick={() => copyToClipboard(userData.phone)}
                              className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setIsEditing((prev) => ({ ...prev, phone: true }))
                            }
                            className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Join Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300">
                        <p className="font-semibold text-gray-900">
                          {new Date(userData.joinDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300">
                        <p className="font-semibold text-gray-900">
                          {userData.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Password Update */}
                  <div className="space-y-2 col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : isEditing.password ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Current Password"
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.current ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="New Password"
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.new ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm New Password"
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.confirm ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdatePassword}
                            disabled={
                              !formData.currentPassword ||
                              !formData.newPassword ||
                              !formData.confirmNewPassword
                            }
                            className="bg-[#19183B] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing((prev) => ({
                                ...prev,
                                password: false,
                              }));
                              setFormData((prev) => ({
                                ...prev,
                                currentPassword: "",
                                newPassword: "",
                                confirmNewPassword: "",
                              }));
                            }}
                            className="bg-gray-300 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between group">
                        <p className="font-semibold text-gray-900">••••••••</p>
                        <button
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              password: true,
                            }))
                          }
                          className="p-1 text-gray-500 hover:text-[#19183B] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Verification Status */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">
                  Account Verification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          userData.status === "completed"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        <AlertCircle
                          className={`w-5 h-5 ${
                            userData.status === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">OTP Verification</h3>
                        <p className="text-sm text-gray-600">
                          Email and phone verification
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getVerificationStatusColor(
                        userData.status
                      )}`}
                    >
                      {userData.status === "completed" ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          userData.kycVerified ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 ${
                            userData.kycVerified
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">KYC Verification</h3>
                        <p className="text-sm text-gray-600">
                          Identity verification
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                        userData.kycVerified
                          ? "bg-green-100 text-green-600 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {userData.kycVerified ? "KYC Verified" : "Not Verified"}
                    </span>
                    {!userData.kycVerified && (
                      <button className="text-sm text-[#19183B] font-medium hover:underline">
                        Complete KYC Verification →
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Achievements & Badges */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Achievements & Badges</h2>
                  <span className="text-sm text-gray-600">
                    {userData.badges.length} badge
                    {userData.badges.length !== 1 ? "s" : ""} earned
                  </span>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonBadge key={i} />
                    ))}
                  </div>
                ) : userData.badges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 rounded-xl p-4 border border-gray-300 hover:border-[#19183B] transition-all duration-300 group hover:scale-[1.02] shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-full bg-gradient-to-r ${getBadgeColor(
                              badge.type
                            )} shadow-md group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-[#19183B] transition-colors duration-300">
                              {badge.certificateId}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Earned{" "}
                            {new Date(badge.issuedAt).toLocaleDateString()}
                          </span>
                          <a
                            href={badge.url}
                            className="text-sm text-[#19183B] font-semibold hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Certificate
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No badges yet
                    </h3>
                    <p className="text-gray-500">
                      Keep donating to earn rewards and recognition!
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Impact Stats Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Impact Overview */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Your Impact</h2>
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center shadow-md">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Lives Touched</h3>
                        <p className="text-2xl font-bold text-[#19183B]">
                          {userData.livesTouched}
                        </p>
                        <p className="text-sm text-gray-600">
                          Change: {userData.impactChange}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center shadow-md">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Trust Score</h3>
                        <p className="text-2xl font-bold text-[#19183B]">
                          {userData.trustScore}
                        </p>
                        <p className="text-sm text-gray-600">
                          Change: {userData.transactionChange}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center shadow-md">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Reputation Level</h3>
                        <p className="text-2xl font-bold text-[#19183B]">
                          {userData.donationCount > 10
                            ? "Expert"
                            : userData.donationCount > 5
                            ? "Trusted"
                            : "New Member"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Based on {userData.donationCount} donations
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-[#19183B] text-white py-3 px-4 rounded-lg hover:shadow-md hover:shadow-[#19183B]/50 transition-all duration-300 hover:scale-105 font-medium">
                    View Detailed Report
                  </button>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-300 hover:border-[#19183B] text-gray-900 py-3 px-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#19183B]" />
                    <div>
                      <p className="font-medium">Notification Settings</p>
                      <p className="text-sm text-gray-600">
                        Manage your alerts
                      </p>
                    </div>
                  </button>

                  <button className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-300 hover:border-[#19183B] text-gray-900 py-3 px-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#19183B]" />
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-gray-600">
                        Control data visibility
                      </p>
                    </div>
                  </button>

                  {!userData.kycVerified && (
                    <button className="w-full bg-gray-200 hover:bg-gray-300 border border-gray-300 hover:border-[#19183B] text-gray-900 py-3 px-4 rounded-lg transition-all duration-300 text-left flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-[#19183B]" />
                      <div>
                        <p className="font-medium">Complete KYC</p>
                        <p className="text-sm text-gray-600">
                          Verify your identity
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </section>

              {/* Account Security */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Account Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-600">
                          Last updated 30 days ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setIsEditing((prev) => ({ ...prev, password: true }))
                      }
                      className="text-[#19183B] font-medium hover:underline text-sm"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Two-Factor Auth</p>
                        <p className="text-sm text-gray-600">Not enabled</p>
                      </div>
                    </div>
                    <button className="text-[#19183B] font-medium hover:underline text-sm">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-gray-600">
                          View recent activity
                        </p>
                      </div>
                    </div>
                    <button className="text-[#19183B] font-medium hover:underline text-sm">
                      View
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

export default Profile;
