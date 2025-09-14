import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const Profile = () => {
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
    fullName: false,
    email: false,
    phone: false,
    location: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    otp: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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

        const config = { headers: { Authorization: `Bearer ${token}` } };
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
          location: profile.location || "",
          profilePicture: profile.profilePicture || "",
          donationCount: profile.donationCount || 0,
          requestCount: profile.requestCount || 0,
          donationChange: stats.donationChange || "+0%",
          requestChange: stats.requestChange || "+0%",
          transactionChange: stats.transactionChange || "+0%",
          impactChange: stats.impactChange || "+0%",
        });
        setFormData({
          fullName: `${profile.firstName || ""} ${
            profile.lastName || ""
          }`.trim(),
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
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
      selectedFile.size <= 5 * 1024 * 1024
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Note: Backend doesn't support updating fullName or location directly; implement if needed
    setIsEditing({
      fullName: false,
      email: false,
      phone: false,
      location: false,
      password: false,
    });
    setSuccess("Changes saved successfully");
  };

  const handleCancel = () => {
    setFormData({
      fullName: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      otp: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsEditing({
      fullName: false,
      email: false,
      phone: false,
      location: false,
      password: false,
    });
    setError("");
    setSuccess("");
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setSuccess("Copied to clipboard!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No certificate ID available to copy");
    }
  };

  if (error && userData.status !== "completed") {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-['Inter','Noto_Sans',sans-serif] flex items-center justify-center">
        <div className="text-center p-8 bg-[#100F2B] rounded-2xl shadow-lg">
          <span className="material-symbols-outlined text-6xl text-red-400 mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-red-400 mb-4">{error}</h1>
          <button
            onClick={() => navigate("/verify")}
            className="bg-[#19183B] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#3b82f6] transition-colors duration-300"
          >
            Go to Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-['Inter','Noto_Sans',sans-serif]">
      <Sidebar activeTab="profile" />
      <main className="flex-1 bg-[#141332] p-8 rounded-l-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{success}</span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-white">My Profile</h1>
              <p className="text-gray-400 mt-1">
                Manage your personal and account details.
              </p>
            </header>
            <div className="bg-[#100F2B] p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  {isLoading ? (
                    <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse"></div>
                  ) : (
                    <>
                      <img
                        alt={`${userData.firstName}'s profile picture`}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-[#19183B] group-hover:ring-[#3b82f6] transition-all duration-300"
                        src={
                          userData.profilePicture ||
                          "https://via.placeholder.com/128"
                        }
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/128")
                        }
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-picture-upload"
                      />
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-2 right-2 bg-[#19183B] hover:bg-[#3b82f6] text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">
                          edit
                        </span>
                      </label>
                    </>
                  )}
                </div>
                <div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold">
                        {userData.firstName} {userData.lastName}
                      </h2>
                      <p className="text-gray-400">{userData.email}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Joined on{" "}
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {file && (
                <button
                  onClick={handleUploadProfilePicture}
                  disabled={isUploading}
                  className={`w-full bg-[#19183B] text-white font-semibold py-3 rounded-lg hover:bg-[#3b82f6] transition-colors duration-300 mb-6 flex items-center justify-center gap-2 ${
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
                    <>
                      <span className="material-symbols-outlined">upload</span>
                      Upload Profile Picture
                    </>
                  )}
                </button>
              )}
              <form onSubmit={handleSaveChanges}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Full Name
                    </label>
                    {isEditing.fullName ? (
                      <div className="flex gap-2">
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter full name"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              fullName: false,
                            }))
                          }
                          className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="fullName"
                          type="text"
                          value={`${userData.firstName} ${userData.lastName}`}
                          disabled
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-gray-400 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              fullName: true,
                            }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6]"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Email
                    </label>
                    {isEditing.email ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                            placeholder="Enter new email"
                          />
                          <button
                            type="button"
                            onClick={handleUpdateEmail}
                            disabled={!formData.email}
                            className="bg-[#19183B] text-white p-3 rounded-md hover:bg-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined">
                              send
                            </span>
                          </button>
                          <button
                            type="button"
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
                            className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                          </button>
                        </div>
                        {isEditing.email && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="otp"
                              value={formData.otp}
                              onChange={handleInputChange}
                              className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                              placeholder="Enter OTP"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              disabled={!formData.otp}
                              className="bg-[#19183B] text-white p-3 rounded-md hover:bg-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined">
                                check
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          value={userData.email}
                          disabled
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-gray-400 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, email: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6]"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Phone Number
                    </label>
                    {isEditing.phone ? (
                      <div className="flex gap-2">
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter phone number"
                        />
                        <button
                          type="button"
                          onClick={handleUpdatePhone}
                          disabled={!formData.phone}
                          className="bg-[#19183B] text-white p-3 rounded-md hover:bg-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined">
                            save
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing((prev) => ({
                              ...prev,
                              phone: false,
                            }));
                            setFormData((prev) => ({
                              ...prev,
                              phone: userData.phone,
                            }));
                          }}
                          className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={userData.phone || ""}
                          disabled
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-gray-400 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, phone: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6]"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Location
                    </label>
                    {isEditing.location ? (
                      <div className="flex gap-2">
                        <input
                          id="location"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter your location"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              location: false,
                            }))
                          }
                          className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="location"
                          type="text"
                          value={userData.location || ""}
                          disabled
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-gray-400 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              location: true,
                            }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6]"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password
                    </label>
                    {isEditing.password ? (
                      <div className="space-y-4">
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter current password"
                        />
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Enter new password"
                        />
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleInputChange}
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 transition-all duration-300"
                          placeholder="Confirm new password"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleUpdatePassword}
                            disabled={
                              !formData.currentPassword ||
                              !formData.newPassword ||
                              !formData.confirmNewPassword
                            }
                            className="bg-[#19183B] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
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
                            className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="password"
                          value="********"
                          disabled
                          className="form-input w-full bg-[#19183B] border-transparent rounded-md py-3 px-4 text-gray-400 focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent placeholder-gray-500 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              password: true,
                            }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6]"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-[#19183B] transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#19183B] hover:bg-[#3b82f6] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-[#100F2B] p-8 rounded-2xl shadow-lg mt-8">
              <h3 className="text-xl font-bold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">KYC Status</span>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="material-symbols-outlined">
                        verified
                      </span>
                      <span className="font-medium">
                        {userData.kycVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Status</span>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="material-symbols-outlined">
                        task_alt
                      </span>
                      <span className="font-medium">
                        {userData.status === "completed" ? "Active" : "Pending"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Certificates</span>
                  {isLoading ? (
                    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <button
                      onClick={() =>
                        copyToClipboard(
                          userData.certificates[0]?.certificateId || ""
                        )
                      }
                      className="flex items-center gap-2 text-[#3b82f6] hover:underline"
                    >
                      <span className="material-symbols-outlined">link</span>
                      <span className="font-medium">View on Blockchain</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-[#100F2B] p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Profile Completion</h3>
              {isLoading ? (
                <div className="h-2.5 w-full bg-gray-700 rounded-full animate-pulse"></div>
              ) : (
                <>
                  <div className="w-full bg-[#19183B] rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] h-2.5 rounded-full"
                      style={{
                        width: userData.profilePicture
                          ? userData.kycVerified
                            ? "90%"
                            : "75%"
                          : "60%",
                      }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-2">
                    {userData.profilePicture
                      ? userData.kycVerified
                        ? "90% Complete"
                        : "75% Complete"
                      : "60% Complete"}
                  </p>
                </>
              )}
            </div>
            <div className="bg-[#100F2B] p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Impact Stats</h3>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-12 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-[#3b82f6]">
                      {userData.livesTouched}
                    </p>
                    <p className="text-sm text-gray-400">Lives Helped</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#3b82f6]">
                      {userData.donationCount}
                    </p>
                    <p className="text-sm text-gray-400">Donations</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#3b82f6]">
                      {userData.trustScore}
                    </p>
                    <p className="text-sm text-gray-400">Trust Score</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#100F2B] p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Badges Earned</h3>
              {isLoading ? (
                <div className="flex justify-center gap-4">
                  <div className="h-12 w-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-12 w-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-12 w-12 bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              ) : userData.badges && userData.badges.length > 0 ? (
                <div className="flex justify-center gap-4">
                  {userData.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[#19183B] rounded-full"
                      title={`${
                        badge.type.charAt(0).toUpperCase() + badge.type.slice(1)
                      } Badge`}
                    >
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          badge.type === "gold"
                            ? "text-yellow-400"
                            : badge.type === "silver"
                            ? "text-gray-400"
                            : badge.type === "bronze"
                            ? "text-orange-400"
                            : "text-blue-400"
                        }`}
                      >
                        {badge.type === "gold"
                          ? "emoji_events"
                          : badge.type === "silver"
                          ? "volunteer_activism"
                          : badge.type === "bronze"
                          ? "verified_user"
                          : "military_tech"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">
                  No badges earned yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
