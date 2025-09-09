import React, { useState, useEffect } from "react";
import {
  FaHandHoldingHeart,
  FaHospital,
  FaUserInjured,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "donor",
    agreeTerms: false,
    rememberMe: false,
  });

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
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    alert(isLogin ? "Login successful!" : "Account created successfully!");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "donor",
      agreeTerms: false,
      rememberMe: false,
    });
  };

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider} - Feature coming soon!`);
  };

  const handleForgotPassword = () => {
    alert("Password reset link sent to your email!");
  };

  const handleBackToHome = () => {
    alert("Redirecting to home page...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <span className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                MediTrust
              </span>
            </div>
            <button
              onClick={handleBackToHome}
              className="text-slate-600 hover:text-slate-800 transition-colors duration-300 font-medium hover:scale-105 transform"
            >
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 relative z-10">
        <div style={{ perspective: "1000px" }}>
          <div
            style={{
              transform: isVisible
                ? "translateY(0) rotateY(0deg)"
                : "translateY(5rem) rotateY(-90deg)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1s ease-out",
              transformStyle: "preserve-3d",
            }}
            className="w-full max-w-md"
          >
            {/* Auth Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 animate-pulse-slow" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? "Welcome Back" : "Join MediTrust"}
                  </h2>
                  <p className="text-slate-200 text-sm">
                    {isLogin
                      ? "Sign in to continue making an impact"
                      : "Create your account to start saving lives"}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 py-8 space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4 animate-slide-down">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 hover:border-slate-300"
                        placeholder="John"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 hover:border-slate-300"
                        placeholder="Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 hover:border-slate-300"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 hover:border-slate-300"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2 animate-slide-down">
                    <label className="text-sm font-medium text-slate-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white transition-all duration-300 hover:border-slate-300"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-3 animate-slide-down">
                    <label className="text-sm font-medium text-slate-700">
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
                          className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 ${
                            formData.userType === type.value
                              ? "border-slate-600 bg-slate-50 scale-105"
                              : "border-slate-200"
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
                          <type.icon className="text-2xl mb-1 text-slate-600" />
                          <span className="text-xs font-medium text-slate-700">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-slate-600 bg-slate-50 border-slate-200 rounded focus:ring-slate-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-slate-600">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-slate-600 hover:text-slate-800 transition-colors duration-300 hover:scale-105 transform"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-start space-x-3 animate-slide-down">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-slate-600 bg-slate-50 border-slate-200 rounded focus:ring-slate-500 focus:ring-2 mt-1"
                      required={!isLogin}
                    />
                    <label className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() =>
                          alert("Terms of Service - Feature coming soon!")
                        }
                        className="text-slate-800 hover:text-slate-900 underline transition-colors duration-300"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() =>
                          alert("Privacy Policy - Feature coming soon!")
                        }
                        className="text-slate-800 hover:text-slate-900 underline transition-colors duration-300"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-8 py-4 text-lg font-bold text-white transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(71,85,105,0.5)] hover:scale-105 hover:from-slate-700 hover:to-slate-800"
                >
                  <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
                  <span className="relative">
                    {isLogin ? "Sign In" : "Create Account"}
                  </span>
                </button>
              </div>

              {/* Toggle */}
              <div className="px-8 pb-8 text-center">
                <p className="text-sm text-slate-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-slate-800 hover:text-slate-900 font-medium underline transition-colors duration-300 hover:scale-105 transform inline-block"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-4">Or continue with</p>
              <div className="flex justify-center space-x-4">
                {[
                  {
                    name: "Google",
                    color: "bg-red-500 hover:bg-red-600",
                    icon: FcGoogle,
                  },
                  {
                    name: "GitHub",
                    color: "bg-gray-800 hover:bg-gray-900",
                    icon: FaGithub,
                  },
                  {
                    name: "LinkedIn",
                    color: "bg-blue-600 hover:bg-blue-700",
                    icon: FaLinkedin,
                  },
                ].map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSocialLogin(provider.name)}
                    className={`w-12 h-12 ${provider.color} text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  >
                    <provider.icon className="text-xl" />
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Secure authentication powered by industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input:focus {
          box-shadow: 0 0 0 3px rgba(71, 85, 105, 0.1);
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

export default AuthPage;
