import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear form data and error on component mount
    setFormData({ email: "", password: "", rememberMe: false });
    setError("");
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/login", {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      setLoading(false);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        {
          email: formData.email,
        }
      );
      setLoading(false);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link");
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
              Welcome Back
            </h2>
            <p className="text-[#6B7280]">Sign in to your MediTrust account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <motion.input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  whileHover={{ scale: 1.05 }}
                  className="h-5 w-5 text-[#19183B] border-[#E6E6FA] rounded focus:ring-[#4B4A8C]/50 transition-all duration-300"
                />
                <span className="ml-2 text-sm text-[#6B7280]">Remember me</span>
              </label>
              <motion.button
                type="button"
                onClick={handleForgotPassword}
                whileHover={{ scale: 1.05 }}
                className="text-sm text-[#19183B] hover:text-[#4B4A8C] font-medium relative group transition-all duration-300"
              >
                Forgot Password?
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B4A8C] transition-all duration-200 group-hover:w-full"></span>
              </motion.button>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(25, 24, 59, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#19183B] to-[#4B4A8C] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center hover:bg-[#4B4A8C]"
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
                  Signing In...
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaLock className="group-hover:scale-110 transition-transform duration-300" />
                  Sign In
                </div>
              )}
            </motion.button>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm font-medium text-center">
                  {error}
                </p>
              </motion.div>
            )}
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
              Don't have an account?{" "}
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                className="text-[#19183B] hover:text-[#4B4A8C] font-semibold relative group transition-all duration-300"
              >
                Sign Up
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4B4A8C] transition-all duration-200 group-hover:w-full"></span>
              </motion.button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        input:focus {
          box-shadow: 0 0 0 3px rgba(75, 74, 140, 0.2);
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

export default Login;


