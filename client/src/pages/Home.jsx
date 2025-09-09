import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

// Enhanced Navbar with mobile menu and smooth animations
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-[#1C352D]/20"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1C352D] to-[#2E4F3F] rounded-xl flex items-center justify-center shadow-md transition-all duration-300">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-[#1C352D] transition-colors duration-300">
              MediTrust
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {["how-it-works", "features", "impact", "testimonials"].map(
              (id, index) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-[#1C352D] hover:text-[#2E4F3F] transition-all duration-300 font-medium text-base lg:text-lg relative"
                >
                  {id
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1C352D] transition-all duration-300 hover:w-full"></span>
                </button>
              )
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 sm:px-6 sm:py-3 text-[#1C352D] hover:text-[#2E4F3F] transition-all duration-300 font-medium text-base lg:text-lg"
            >
              Login
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSignUpClick}
              className="px-4 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] text-white rounded-xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-[#1C352D]/30 font-medium flex items-center space-x-2 text-base lg:text-lg"
            >
              <span>Sign Up</span>
              <svg
                className="w-4 h-4 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-[#1C352D] transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-[#1C352D]/20 py-4">
            <div className="space-y-4 px-4">
              {["how-it-works", "features", "impact", "testimonials"].map(
                (id) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="block w-full text-left py-3 text-[#1C352D] hover:text-[#2E4F3F] hover:bg-[#F0F7F6] rounded-lg transition-all duration-300 px-4"
                  >
                    {id
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Hero Section with wave background and subtle animations
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDonateClick = () => {
    navigate("/signup");
  };

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#F8FBFA]">
      {/* Wave background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-10"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1C352D"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            translateY: isVisible ? 0 : 20,
          }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1C352D] leading-tight tracking-tight"
            style={{ textShadow: "0 0 15px rgba(28, 53, 45, 0.3)" }}
          >
            Empower Healthcare
            <span className="block bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] bg-clip-text text-transparent">
              Through Trusted Donations
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Seamlessly connect donors, hospitals, and patients to save lives
            with transparency and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDonateClick}
              className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(28,53,45,0.5)]"
            >
              <span className="relative">Donate Now</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center justify-center rounded-xl border-2 border-[#1C352D] bg-transparent px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-[#1C352D] transition-all duration-500 hover:bg-[#1C352D] hover:text-white"
            >
              <span className="relative">Request Help</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            translateY: isVisible ? 0 : 20,
          }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "1,234", label: "Medicines Donated Today" },
            { value: "567", label: "Lives Impacted" },
            { value: "25%", label: "Waste Reduced" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-[#1C352D]/20 shadow-md transition-all duration-500"
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#1C352D]">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Re-designed How It Works Section with circular progress layout
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Join the Network",
      description:
        "Sign up and verify your identity to join our trusted community.",
      details:
        "Complete a quick and secure verification process to ensure trust and safety.",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Contribute",
      description: "Donate medicines or funds securely to those in need.",
      details:
        "Your contributions are securely processed to reach hospitals and patients efficiently.",
      icon: (
        <svg
          className="w-10 h-10 text-white"
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
      ),
    },
    {
      number: "03",
      title: "Track Your Impact",
      description: "Monitor how your donations make a difference in real-time.",
      details:
        "Access detailed reports and live updates on the impact of your contributions.",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-32 bg-[#F8FBFA] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1C352D"
            fillOpacity="0.3"
            d="M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,192C672,192,768,128,864,112C960,96,1056,128,1152,144C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1C352D] mb-6">
            How MediTrust Works
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-full mx-auto mb-6"></div>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A simple, secure process to connect donors with those in need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              onClick={() => setActiveStep(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[#1C352D]/20 transition-all duration-500 cursor-pointer ${
                activeStep === index ? "scale-105" : ""
              }`}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-full flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <div className="flex flex-col items-center text-center mt-8">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 ${
                    activeStep === index
                      ? "bg-gradient-to-r from-[#1C352D] to-[#2E4F3F]"
                      : "bg-[#1C352D]/50"
                  }`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1C352D] mt-4">
                  {step.title}
                </h3>
                <p className="text-base text-gray-600 mt-2">
                  {step.description}
                </p>
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{
                    maxHeight: activeStep === index ? 100 : 0,
                    opacity: activeStep === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-sm text-gray-500 mt-4"
                >
                  {step.details}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Features Section with minimalistic cards
const FeaturesSection = () => {
  const features = [
    {
      title: "Secure Donations",
      description:
        "Your contributions are protected with advanced security measures.",
      details:
        "Every donation is processed securely, ensuring trust and transparency.",
      icon: (
        <svg
          className="w-12 h-12"
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
      ),
    },
    {
      title: "Live Tracking",
      description: "Track your donations in real-time from start to finish.",
      details:
        "Get instant updates and visualizations on how your donations are used.",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Smart Connections",
      description: "AI matches donations to urgent medical needs worldwide.",
      details: "Our algorithms optimize distribution for maximum impact.",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Global Reach",
      description: "Connect with hospitals and patients across the globe.",
      details: "Support healthcare needs worldwide with seamless integration.",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FBFA]/50 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#1C352D] mb-6">
            Why Choose MediTrust
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tools designed to make your donations count.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#1C352D]/20 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-2xl flex items-center justify-center mb-6 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#1C352D] mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
              <p className="text-sm text-gray-500 mt-4 text-center">
                {feature.details}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Impact Section with counter animations
const ImpactSection = () => {
  const stats = [
    { value: 10000, label: "Donors Connected", icon: "👥", suffix: "+" },
    { value: 500, label: "Hospitals Supported", icon: "🏥", suffix: "+" },
    { value: 1000000, label: "Lives Impacted", icon: "❤️", suffix: "+" },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        const increment = stat.value / 100;
        const timer = setInterval(() => {
          setCounters((prev) => {
            const newCounters = [...prev];
            if (newCounters[index] < stat.value) {
              newCounters[index] = Math.min(
                newCounters[index] + increment,
                stat.value
              );
            } else {
              clearInterval(timer);
            }
            return newCounters;
          });
        }, 20);
      });
    }
  }, [isVisible]);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-32 bg-[#F8FBFA] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1C352D"
            fillOpacity="0.3"
            d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#1C352D] mb-6">
            Our Global Impact
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Making a difference, one donation at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center relative"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] text-white rounded-3xl mb-8 shadow-lg">
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <h3 className="text-6xl font-bold text-[#1C352D] mb-4">
                {Math.round(counters[index]).toLocaleString()}
                {stat.suffix}
              </h3>
              <p className="text-xl text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Testimonials Section with carousel-like cards
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "MediTrust makes donating medicines so easy and transparent!",
      author: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      avatar: "SJ",
    },
    {
      quote:
        "The real-time tracking feature gives us confidence in every donation.",
      author: "Michael Chen",
      role: "Hospital Administrator",
      avatar: "MC",
    },
    {
      quote: "This platform has revolutionized how we connect with donors.",
      author: "Lisa Rodriguez",
      role: "Aid Foundation Director",
      avatar: "LR",
    },
  ];

  return (
    <section id="testimonials" className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FBFA]/50 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#1C352D] mb-6">
            What Our Community Says
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Hear from those making a difference with MediTrust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-[#1C352D]/20 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1C352D] to-[#2E4F3F] text-white rounded-2xl mb-8 shadow-md">
                <span className="text-3xl font-bold">{testimonial.avatar}</span>
              </div>
              <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-[#1C352D]/20 pt-6">
                <h4
                  class
                  squarely
                  className="font-semibold text-xl text-[#1C352D]"
                >
                  {testimonial.author}
                </h4>
                <p className="text-base text-gray-600">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
const MediTrustApp = () => {
  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ImpactSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default MediTrustApp;
