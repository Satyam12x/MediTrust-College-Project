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

// OTP Input Component
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
            className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A1C2BD]/50 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
              otpFocused === index
                ? "border-[#A1C2BD] shadow-lg bg-white"
                : otp[index]
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
    </div>
  );
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
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
      // Send OTP here
      setLoading(true);
      setError("");
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        alert("OTP sent to your email! (Simulated)");
      }, 1000);
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

  const handleVerifyOtp = () => {
    if (!otp || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      alert("OTP verified! (Simulated)");
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setError("You must agree to the terms");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate signup
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully! (Simulated)");
      navigate("/");
    }, 1000);
  };

  const handleGoogleLogin = () => {
    alert("Google login - Feature coming soon!");
  };

  const labelVariants = {
    resting: { y: 0, scale: 1, color: "#6B7280" },
    floating: { y: -24, scale: 0.85, color: "#A1C2BD" },
  };

  const steps = ["Personal Details", "Credentials", "Verification"];
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBFA] via-white to-[#F0F7F6] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-20 flex items-center gap-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-[#A1C2BD]/20 text-[#A1C2BD] text-sm transition-all duration-300 shadow-md sm:px-4 sm:py-2 sm:text-base"
      >
        <FaArrowLeft />
        <span className="font-medium hidden sm:inline">Home</span>
      </motion.button>

      {/* Main Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ perspective: "1000px" }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89]"></div>

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A1C2BD] to-[#5F8D89] rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl">
                <FaLock />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              >
                <FaLock className="text-white text-xs" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl font-bold text-[#A1C2BD] mb-2">
              Join MediTrust
            </h2>
            <p className="text-gray-600">Create your secure account</p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex justify-between mb-8 relative"
          >
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {steps.map((stepName, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative z-10"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold relative ${
                    index < step
                      ? "bg-green-500"
                      : index === step - 1
                      ? "bg-[#A1C2BD]"
                      : "bg-gray-300"
                  }`}
                  animate={{
                    scale: index === step - 1 ? 1.1 : 1,
                    boxShadow:
                      index === step - 1
                        ? "0 4px 15px rgba(161, 194, 189, 0.3)"
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
                      className="absolute inset-0 rounded-full border-2 border-[#A1C2BD]"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className="text-xs text-gray-600 mt-2 font-medium">
                  {stepName}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{
                        color: formData.firstName ? "#A1C2BD" : "#9CA3AF",
                      }}
                    >
                      <FaUser />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="First Name"
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{
                        color: formData.lastName ? "#A1C2BD" : "#9CA3AF",
                      }}
                    >
                      <FaUser />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="Last Name"
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{ color: formData.age ? "#A1C2BD" : "#9CA3AF" }}
                    >
                      <FaUser />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="Age"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89] text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaLock />
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{
                        color: formData.email ? "#A1C2BD" : "#9CA3AF",
                      }}
                    >
                      <FaEnvelope />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="Email Address"
                    />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{
                        color: formData.password ? "#A1C2BD" : "#9CA3AF",
                      }}
                    >
                      <FaLock />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A1C2BD] transition-colors duration-300"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      animate={{
                        color: formData.confirmPassword ? "#A1C2BD" : "#9CA3AF",
                      }}
                    >
                      <FaLock />
                    </motion.div>
                    <motion.label
                      className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none transition-all duration-300"
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
                      whileFocus={{ scale: 1.02 }}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50/50 focus:outline-none focus:border-[#A1C2BD] focus:ring-2 focus:ring-[#A1C2BD]/20 transition-all duration-300"
                      aria-label="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A1C2BD] transition-colors duration-300"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNextStep}
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
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
                          Sending...
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaEnvelope />
                          Next & Send OTP
                        </div>
                      )}
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
                    <label className="block text-center text-gray-700 font-medium text-sm">
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
                    <label className="block text-center text-gray-700 font-medium text-sm">
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
                        <label
                          key={type.value}
                          className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.userType === type.value
                              ? "border-[#A1C2BD] bg-gray-50"
                              : "border-gray-200"
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
                          <type.icon className="text-2xl mb-1 text-[#A1C2BD]" />
                          <span className="text-xs font-medium text-gray-700">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <motion.input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#A1C2BD] border-gray-300 rounded focus:ring-[#A1C2BD]/50"
                      whileFocus={{ scale: 1.05 }}
                    />
                    <label className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() =>
                          alert("Terms of Service - Feature coming soon!")
                        }
                        className="text-[#A1C2BD] hover:text-[#5F8D89] underline transition-all duration-300"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() =>
                          alert("Privacy Policy - Feature coming soon!")
                        }
                        className="text-[#A1C2BD] hover:text-[#5F8D89] underline transition-all duration-300"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
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
                          Signing Up...
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaLock />
                          Complete Signup
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

          {/* Google Login */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="mt-6 w-full py-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-medium transition-all duration-300"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </motion.button>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center pt-6 border-t border-gray-200"
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#A1C2BD] hover:text-[#5F8D89] font-semibold hover:underline transition-all duration-300"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        input:focus {
          box-shadow: 0 0 0 3px rgba(161, 194, 189, 0.1);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default Signup;
