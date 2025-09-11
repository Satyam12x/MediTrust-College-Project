// New Profile.jsx component
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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
    badges: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
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
          livesTouched: statsResponse.data.livesHelped || 0,
          trustScore: statsResponse.data.trustScore || "0%",
          badges:
            profile.certificates?.map((cert) => ({
              title: cert.certificateId || "Certificate",
              description: "Awarded for your contributions",
              certificateLink: cert.url || "#",
            })) || [],
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

  const handleUpdateEmail = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "http://localhost:5000/api/user/update-email",
        { newEmail },
        config
      );
      setOtpSent(true);
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "http://localhost:5000/api/user/verify-update-email",
        { newEmail, otp },
        config
      );
      setUserData((prev) => ({ ...prev, email: newEmail }));
      setOtpSent(false);
      setNewEmail("");
      setOtp("");
      setEditingEmail(false);
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
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "http://localhost:5000/api/user/update-phone",
        { newPhone },
        config
      );
      setUserData((prev) => ({ ...prev, phone: newPhone }));
      setEditingPhone(false);
      setNewPhone("");
      setSuccess(response.data.message || "Phone number updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update phone number");
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <User className="w-6 h-6" />
          <div>
            <label>Name</label>
            <p>
              {userData.firstName} {userData.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="w-6 h-6" />
          <div>
            <label>Email</label>
            <p>{userData.email}</p>
          </div>
          <button onClick={() => setEditingEmail(true)}>
            <Edit className="w-4 h-4" />
          </button>
        </div>
        {editingEmail && (
          <div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New Email"
            />
            <button onClick={handleUpdateEmail}>Send OTP</button>
            {otpSent && (
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                />
                <button onClick={handleVerifyEmailOtp}>Verify</button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-4">
          <Phone className="w-6 h-6" />
          <div>
            <label>Phone</label>
            <p>{userData.phone || "Not set"}</p>
          </div>
          <button onClick={() => setEditingPhone(true)}>
            <Edit className="w-4 h-4" />
          </button>
        </div>
        {editingPhone && (
          <div>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="New Phone"
            />
            <button onClick={handleUpdatePhone}>Update</button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <AlertCircle className="w-6 h-6" />
          <div>
            <label>Account Verification (OTP)</label>
            <p>{userData.status === "completed" ? "Verified" : "Pending"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6" />
          <div>
            <label>KYC Verification</label>
            <p>{userData.kycVerified ? "Verified" : "Not Verified"}</p>
          </div>
        </div>
        <div>
          <h2>Badges</h2>
          {userData.badges.length > 0 ? (
            userData.badges.map((badge, index) => (
              <div key={index}>
                <p>{badge.title}</p>
                <p>{badge.description}</p>
                <a href={badge.certificateLink}>View</a>
              </div>
            ))
          ) : (
            <p>No badges yet</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Heart className="w-6 h-6" />
          <div>
            <label>Lives Touched</label>
            <p>{userData.livesTouched}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TrendingUp className="w-6 h-6" />
          <div>
            <label>Trust Score</label>
            <p>{userData.trustScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
