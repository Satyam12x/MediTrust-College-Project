import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaHandHoldingHeart,
  FaHospital,
  FaUserInjured,
  FaSpinner,
  FaCheckCircle,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import "../styles/Signup.css";

const OtpInput = ({ otp, setOtp, otpFocused, setOtpFocused }) => {
  const inputRefs = useRef([]);
  const OTP_LENGTH = 6;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData);
      inputRefs.current[OTP_LENGTH - 1].focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array(OTP_LENGTH)
        .fill()
        .map((_, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setOtpFocused(index)}
            onBlur={() => setOtpFocused(null)}
            whileFocus={{ scale: 1.05 }}
            whileHover={{ boxShadow: "0 0 10px rgba(25, 24, 59, 0.2)" }}
            className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 bg-[#F8F9FA]/80 backdrop-blur-sm hover:border-[#4B4A8C] ${
              otpFocused === index
                ? "border-[#19183B] shadow-lg bg-[#F8F9FA]"
                : otp[index]
                ? "border-[#4B4A8C] bg-[#E6E6FA]/50"
                : "border-[#E6E6FA]"
            }`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
    </div>
  );
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpFocused, setOtpFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "donor",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.age) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.age < 18) {
        setError("You must be at least 18 years old");
        return;
      }
    } else if (step === 2) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.userType || !["donor", "patient", "hospital"].includes(formData.userType)) {
      setError("Please select a valid user type");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms");
      return;
    }
    if (!otp || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      // Send signup request
      console.log("Signup payload:", formData);
      const signupResponse = await axios.post("http://localhost:5000/api/signup", formData);
      setOtpSent(true);
      setError("");
      alert(signupResponse.data.message);

      // Verify OTP
      const otpResponse = await axios.post("http://localhost:5000/api/otp/verify", {
        email: formData.email,
        otp,
      });
      setLoading(false);
      alert(otpResponse.data.message);
      localStorage.setItem("token", otpResponse.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sign up or verify OTP");
      console.error("Error details:", err.response?.data?.details);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login - Feature coming soon!");
  };

  const labelVariants = {
    resting: { y: 0, scale: 1, color: "#6B7280" },
    floating: { y: -24, scale: 0.85, color: "#19183B" },
  };

  const steps = ["Personal Details", "Credentials", "Verification"];
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 relative overflow-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-[#19183B]/30 via-[#4B4A8C]/20 to-[#E6E6FA]/10 rounded-[60%_40%_30%_70%] -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-tl from-[#19183B]/30 via-[#4B4A8C]/20 to-[#E6E6FA]/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl opacity-20"></div>
      </div>

      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-20 flex items-center gap-1 px-3 py-1.5 bg-[#F8F9FA]/80 backdrop-blur-sm rounded-full border border-[#19183B]/20 text-[#2D2D2D] text-sm transition-all duration-300 shadow-md sm:px-4 sm:py-2 sm:text-base hover:bg-[#E6E6FA]"
      >
        <FaArrowLeft className="group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium hidden sm:inline">Home</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-[#F8F9FA]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#E6E6FA]/20 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#19183B] to-[#4B4A8C]"></div>

          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                }}
                className="w-16 h-16 bg-gradient-to-br from-[#19183B] to-[#4B4A8C] rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl"
              >
                <FaLock className="group-hover:rotate-12 transition-transform duration-300" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#4B4A8C] rounded-full flex items-center justify-center"
              >
                <FaLock className="text-white text-xs" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              Join MediTrust
            </h2>
            <p className="text-[#6B7280]">Create your secure account</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex justify-between mb-8 relative"
          >
            <div className="absolute top-4 left-0 w-full h-0.5 bg-[#E6E6FA] rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#19183B] to-[#4B4A8C] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {steps.map((stepName, index) => (
              <><div
                key={index}
                className="flex flex-col items-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold relative ${index < step
                      ? "bg-[#4B4A8C]"
                      : index === step - 1
                        ? "bg-[#19183B]"
                        : "bg-[#E6E6FA]"}`}
                  animate={{
                    boxShadow: index === step - 1
                      ? "0 4px 15px rgba(25, 24, 59, 0.3)"
                      : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index < step - 1 ? (
                    <FaCheckCircle className="text-sm" />
                  ) : (
                    index + 1
                  )}
                  {index === step - 1 && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#4B4A8C]"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                  )}
                </div><span className="text-xs text-[#6B7280] mt-2 font-medium">
                  {stepName}
                </span></>
              </div>
            ))}
          </motion.div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{
                        color: formData.firstName ? "#19183B" : "#6B7280",
                      }}
                    >
                      <FaUser className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={formData.firstName ? "floating" : "resting"}
                      variants={labelVariants}
                    >
                      First Name
                    </motion.label>
                    <motion.input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="First Name"
                      required
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{
                        color: formData.lastName ? "#19183B" : "#6B7280",
                      }}
                    >
                      <FaUser className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={formData.lastName ? "floating" : "resting"}
                      variants={labelVariants}
                    >
                      Last Name
                    </motion.label>
                    <motion.input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="Last Name"
                      required
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{ color: formData.age ? "#19183B" : "#6B7280" }}
                    >
                      <FaUser className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={formData.age ? "floating" : "resting"}
                      variants={labelVariants}
                    >
                      Age
                    </motion.label>
                    <motion.input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="Age"
                      required
                      min="18"
                    />
                  </div>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-gradient-to-r from-[#19183B] to-[#4B4A8C] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#4B4A8C]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                      Next
                    </div>
                  </motion.button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{
                        color: formData.email ? "#19183B" : "#6B7280",
                      }}
                    >
                      <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={formData.email ? "floating" : "resting"}
                      variants={labelVariants}
                    >
                      Email Address
                    </motion.label>
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="Email Address"
                      required
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{
                        color: formData.password ? "#19183B" : "#6B7280",
                      }}
                    >
                      <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={formData.password ? "floating" : "resting"}
                      variants={labelVariants}
                    >
                      Password
                    </motion.label>
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-12 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="Password"
                      required
                      minLength="6"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#4B4A8C] transition-colors duration-300"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.button>
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      animate={{
                        color: formData.confirmPassword ? "#19183B" : "#6B7280",
                      }}
                    >
                      <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-[#6B7280] font-medium pointer-events-none transition-all duration-300"
                      animate={
                        formData.confirmPassword ? "floating" : "resting"
                      }
                      variants={labelVariants}
                    >
                      Confirm Password
                    </motion.label>
                    <motion.input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      whileFocus={{ scale: 1.03 }}
                      className="w-full pl-12 pr-12 py-4 border-2 border-[#E6E6FA] rounded-xl text-[#2D2D2D] bg-[#F8F9FA]/50 focus:outline-none focus:border-[#4B4A8C] focus:ring-2 focus:ring-[#4B4A8C]/30 transition-all duration-300 hover:border-[#4B4A8C] group"
                      aria-label="Confirm Password"
                      required
                      minLength="6"
                    />
                    <motion.button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      whileHover={{ scale: 1.1 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#4B4A8C] transition-colors duration-300"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.button>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 bg-[#E6E6FA] text-[#2D2D2D] rounded-xl font-semibold transition-all duration-300 hover:bg-[#4B4A8C] hover:text-white"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNextStep}
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-[#19183B] to-[#4B4A8C] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center hover:bg-[#4B4A8C]"
                    >
                      <div className="flex items-center gap-2">
                        <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                        Next
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <label className="block text-center text-[#2D2D2D] font-medium text-sm">
                      Enter Verification Code
                    </label>
                    <OtpInput
                      otp={otp}
                      setOtp={setOtp}
                      otpFocused={otpFocused}
                      setOtpFocused={setOtpFocused}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-center text-[#2D2D2D] font-medium text-sm">
                      I am a
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          value: "donor",
                          label: "Donor",
                          icon: FaHandHoldingHeart,
                        },
                        {
                          value: "hospital",
                          label: "Hospital",
                          icon: FaHospital,
                        },
                        {
                          value: "patient",
                          label: "Patient",
                          icon: FaUserInjured,
                        },
                      ].map((type) => (
                        <motion.label
                          key={type.value}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 10px rgba(25, 24, 59, 0.2)",
                          }}
                          className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                            formData.userType === type.value
                              ? "border-[#19183B] bg-[#E6E6FA]/50"
                              : "border-[#E6E6FA] hover:border-[#4B4A8C]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={type.value}
                            checked={formData.userType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <type.icon className="text-2xl mb-1 text-[#19183B] group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-xs font-medium text-[#2D2D2D]">
                            {type.label}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <motion.input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      whileHover={{ scale: 1.05 }}
                      className="h-5 w-5 text-[#19183B] border-[#E6E6FA] rounded focus:ring-[#4B4A8C]/50 transition-all duration-300"
                      required
                    />
                    <label className="text-sm text-[#6B7280] leading-relaxed">
                      I agree to the{" "}
                      <motion.button
                        type="button"
                        onClick={() =>
                          alert("Terms of Service - Feature coming soon!")
                        }
                        whileHover={{ scale: 1.05 }}
                        className="text-[#19183B] hover:text-[#4B4A8C] underline relative group transition-all duration-300"
                      >
                        Terms of Service
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B4A8C] transition-all duration-200 group-hover:w-full"></span>
                      </motion.button>{" "}
                      and{" "}
                      <motion.button
                        type="button"
                        onClick={() =>
                          alert("Privacy Policy - Feature coming soon!")
                        }
                        whileHover={{ scale: 1.05 }}
                        className="text-[#19183B] hover:text-[#4B4A8C] underline relative group transition-all duration-300"
                      >
                        Privacy Policy
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B4A8C] transition-all duration-200 group-hover:w-full"></span>
                      </motion.button>
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 bg-[#E6E6FA] text-[#2D2D2D] rounded-xl font-semibold transition-all duration-300 hover:bg-[#4B4A8C] hover:text-white"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || !formData.agreeTerms}
                      className="flex-1 py-4 bg-gradient-to-r from-[#19183B] to-[#4B4A8C] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center hover:bg-[#4B4A8C]"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex items-center gap-2"
                        >
                          <FaSpinner />
                          Verifying...
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                          Verify OTP
                        </div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm font-medium text-center">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled
            className="mt-6 w-full py-4 bg-[#F8F9FA] border border-[#E6E6FA] rounded-xl flex items-center justify-center gap-2 text-[#2D2D2D] font-medium transition-all duration-300 opacity-50 cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            Continue with Google (Coming Soon)
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center pt-6 border-t border-[#E6E6FA]"
          >
            <p className="text-[#6B7280]">
              Already have an account?{" "}
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                className="text-[#19183B] hover:text-[#4B4A8C] font-semibold relative group transition-all duration-300"
              >
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B4A8C] transition-all duration-200 group-hover:w-full"></span>
              </motion.button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;