import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate login (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
      alert("Login successful! (Simulated)");
      navigate("/");
    }, 1000);
  };

  const handleGoogleLogin = () => {
    alert("Google login - Feature coming soon!");
  };

  const handleForgotPassword = () => {
    alert("Password reset link sent to your email!");
  };

  const labelVariants = {
    resting: { y: 0, scale: 1, color: "#6B7280" },
    floating: { y: -24, scale: 0.85, color: "#A1C2BD" },
  };

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

      {/* Main Login Card */}
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
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your MediTrust account</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                animate={{ color: formData.email ? "#A1C2BD" : "#9CA3AF" }}
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
                animate={{ color: formData.password ? "#A1C2BD" : "#9CA3AF" }}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-[#A1C2BD] border-gray-300 rounded focus:ring-[#A1C2BD]/50"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#A1C2BD] hover:text-[#5F8D89] font-medium hover:underline transition-all duration-300"
              >
                Forgot Password?
              </button>
            </div>

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

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#A1C2BD] to-[#5F8D89] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center relative overflow-hidden"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-2"
                >
                  <FaSpinner />
                  Signing In...
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaLock />
                  Sign In
                </div>
              )}
            </motion.button>
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

          {/* Signup Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center pt-6 border-t border-gray-200"
          >
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#A1C2BD] hover:text-[#5F8D89] font-semibold hover:underline transition-all duration-300"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        input:focus {
          box-shadow: 0 0 0 3px rgba(161, 194, 189, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;
