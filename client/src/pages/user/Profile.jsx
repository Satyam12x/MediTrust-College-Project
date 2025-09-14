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
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";

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
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
        console.error(
          "Profile Fetch Error:",
          err.response?.data || err.message
        );
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type) &&
      selectedFile.size <= 5 * 1024 * 1024 // 5MB limit
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setError(
        selectedFile
          ? "Please select a valid image file (JPEG, JPG, or PNG) under 5MB"
          : "No file selected"
      );
      setFile(null);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.post(
        "http://localhost:5000/api/user/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Remove explicit Content-Type; axios sets it automatically for FormData
          },
        }
      );

      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      setSuccess("Profile picture updated successfully");
      setFile(null);
    } catch (err) {
      console.error("Profile Picture Upload Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.status === 401
          ? "Authentication failed. Please log in again."
          : err.response?.status === 403
          ? "Please complete OTP verification"
          : err.response?.status === 400
          ? err.response?.data?.error || "Invalid file or request"
          : err.response?.data?.error || "Failed to upload profile picture";
      setError(errorMessage);
      setSuccess("");
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate(err.response?.status === 401 ? "/login" : "/verify");
      }
    } finally {
      setIsUploading(false);
    }
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
              <button
                className="flex items-center gap-2 bg-gray-100 border border-gray-200 py-2.5 px-5 rounded-xl hover:border-[#19183B] transition-all duration-300 shadow-sm"
                onClick={() => navigate("/settings")}
              >
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
                      <div className="space-y-2">
                        <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between">
                          {userData.profilePicture ? (
                            <img
                              src={userData.profilePicture}
                              alt="Profile"
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) =>
                                (e.target.src = "/images/placeholder.png")
                              }
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                            id="profile-picture-upload"
                          />
                          <label
                            htmlFor="profile-picture-upload"
                            className="p-1 text-gray-500 hover:text-[#19183B] transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </label>
                        </div>
                        {file && (
                          <button
                            onClick={handleUploadProfilePicture}
                            disabled={isUploading}
                            className={`w-full bg-[#19183B] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition-opacity flex items-center justify-center gap-2 ${
                              isUploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {isUploading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Uploading...
                              </>
                            ) : (
                              "Upload Profile Picture"
                            )}
                          </button>
                        )}
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
                                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPassword((prev) => ({
                                    ...prev,
                                    otp: !prev.otp,
                                  }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#19183B]"
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
                              className="bg-[#19183B] text-white px-4 py-3 rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Verify OTP
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300 flex items-center justify-between group">
                        <p className="font-semibold text-gray-900">
                          {userData.email}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          {userData.phone || "Not provided"}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : isEditing.password ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              placeholder="Enter current password"
                              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword((prev) => ({
                                  ...prev,
                                  current: !prev.current,
                                }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#19183B]"
                            >
                              {showPassword.current ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              type={showPassword.new ? "text" : "password"}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="Enter new password"
                              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword((prev) => ({
                                  ...prev,
                                  new: !prev.new,
                                }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#19183B]"
                            >
                              {showPassword.new ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              name="confirmNewPassword"
                              value={formData.confirmNewPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm new password"
                              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#19183B] focus:border-[#19183B] transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword((prev) => ({
                                  ...prev,
                                  confirm: !prev.confirm,
                                }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#19183B]"
                            >
                              {showPassword.confirm ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
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
                        <p className="font-semibold text-gray-900">********</p>
                        <button
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              password: true,
                            }))
                          }
                          className="p-1 text-gray-500 hover:text-[#19183B] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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

                  {/* Join Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Join Date
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg p-3 border border-gray-300">
                        <p className="font-semibold text-gray-900">
                          {new Date(userData.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <UserCheck className="w-4 h-4" />
                      Verification Status
                    </label>
                    {isLoading ? (
                      <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    ) : (
                      <div
                        className={`rounded-lg p-3 border ${getVerificationStatusColor(
                          userData.status
                        )}`}
                      >
                        <p className="font-semibold capitalize">
                          {userData.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Stats and Badges */}
            <div className="space-y-8">
              {/* Impact Stats */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Your Impact</h2>
                {isLoading ? (
                  <SkeletonCard />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Heart className="w-10 h-10 text-[#19183B] bg-[#19183B]/10 p-2 rounded-full" />
                      <div>
                        <p className="text-sm text-gray-600">Lives Helped</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.livesTouched}
                        </p>
                        <p className="text-sm text-green-600">
                          {userData.impactChange}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-10 h-10 text-[#19183B] bg-[#19183B]/10 p-2 rounded-full" />
                      <div>
                        <p className="text-sm text-gray-600">Total Donations</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.donationCount}
                        </p>
                        <p className="text-sm text-green-600">
                          {userData.donationChange}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Shield className="w-10 h-10 text-[#19183B] bg-[#19183B]/10 p-2 rounded-full" />
                      <div>
                        <p className="text-sm text-gray-600">Trust Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {userData.trustScore}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Badges */}
              <section className="bg-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Badges</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    <SkeletonBadge />
                    <SkeletonBadge />
                  </div>
                ) : userData.badges.length > 0 ? (
                  <div className="space-y-4">
                    {userData.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 rounded-xl p-4 border border-gray-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Star
                            className={`w-10 h-10 bg-gradient-to-br ${getBadgeColor(
                              badge.type
                            )} text-white p-2 rounded-full`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {badge.type.charAt(0).toUpperCase() +
                                badge.type.slice(1)}{" "}
                              Badge
                            </p>
                            <p className="text-sm text-gray-600">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(badge.certificateId)}
                          className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Certificate ID
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No badges earned yet.</p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
