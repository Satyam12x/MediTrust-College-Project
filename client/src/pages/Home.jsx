import React, { useState, useEffect, useRef } from "react";

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMGwyNi4wOTQgMTUuMTc3VjQ0LjgyM0wzMCA2MGwtMjYuMDk0LTE1LjE3N1YxNS4xNzdMMzAgMHptMCAxMC4yNzhsLTE3LjMyIDkuOTk5djE5Ljk5OEwxNi4zODcgNDAuNzIybDI2LjEyMy0xNS4xNzZ2LTE5Ljk5OEwyNi42MTMgMTkuMjc4eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-xl font-bold">+</span>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-slate-200 transition-colors duration-300">
                MediTrust
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering medical donations with cutting-edge secure technology
              for maximum impact and transparency.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4 text-lg">Platform</h4>
            <ul className="space-y-3">
              {["How It Works", "Security", "API", "Integrations"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-all duration-300 group flex items-center space-x-2"
                    >
                      <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-white group-hover:scale-150 transition-all duration-300"></span>
                      <span>{item}</span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4 text-lg">Support</h4>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-all duration-300 group flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-white group-hover:scale-150 transition-all duration-300"></span>
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4 text-lg">Connect</h4>
            <div className="flex space-x-4">
              {["f", "t", "in"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:shadow-lg hover:shadow-slate-500/20"
                >
                  <span className="text-sm font-medium group-hover:rotate-12 transition-transform duration-300">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
            <p className="text-sm mt-6">Subscribe to our newsletter</p>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-l-xl text-sm flex-1 focus:outline-none focus:border-slate-500 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-r-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-slate-400/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm">
          <p>
            &copy; 2025 MediTrust. All rights reserved. Built with passion for
            global healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Enhanced Navbar with mobile menu and smooth animations
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-100/50"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
              MediTrust
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {["how-it-works", "features", "impact", "testimonials"].map(
              (id, index) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-slate-600 hover:text-slate-800 transition-all duration-300 group relative font-medium"
                >
                  {id
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium hover:scale-105">
              Login
            </button>
            <button className="group px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-500 transform hover:scale-105 shadow-md hover:shadow-xl hover:shadow-slate-500/30 font-medium flex items-center space-x-2">
              <span>Sign Up</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-slate-600 group-hover:text-slate-800 transition-colors duration-300"
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
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 py-4">
            <div className="space-y-4 px-4">
              {["how-it-works", "features", "impact", "testimonials"].map(
                (id) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="block w-full text-left py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-300 px-4"
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

// Enhanced Hero Section with day theme and neon-inspired animations
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Particle animations */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `-${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              background: i % 3 === 0 ? "#475569" : "#94a3b8",
            }}
          ></div>
        ))}
      </div>

      {/* SVG network visualization */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-1/2 h-1/2 opacity-20 animate-pulse-slow">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#475569", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#94a3b8", stopOpacity: 1 }}
                />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur result="coloredBlur" stdDeviation="1.5" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 10 50 Q 50 20, 90 50"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              style={{ filter: "url(#glow)" }}
            />
            <path
              d="M 10 50 Q 50 80, 90 50"
              fill="none"
              opacity="0.5"
              stroke="url(#grad1)"
              strokeDasharray="4"
              strokeWidth="1"
            />
            <circle
              cx="10"
              cy="50"
              fill="#94a3b8"
              r="4"
              style={{ filter: "url(#glow)" }}
            />
            <circle cx="50" cy="35" fill="#475569" r="3" />
            <circle
              cx="90"
              cy="50"
              fill="#94a3b8"
              r="4"
              style={{ filter: "url(#glow)" }}
            />
            <circle cx="30" cy="37" fill="#475569" opacity="0.7" r="2" />
            <circle cx="70" cy="37" fill="#475569" opacity="0.7" r="2" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12">
        <div
          className={`space-y-8 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight"
            style={{ textShadow: "0 0 15px rgba(71, 85, 105, 0.3)" }}
          >
            Revolutionize Medicine Donations
            <span className="block bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent animate-gradient-text">
              with Secure Trust
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Connect donors, hospitals, and patients in a secure, transparent
            network. Save lives, reduce waste, maximize impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-8 py-4 text-lg font-bold text-white transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(71,85,105,0.5)] hover:scale-105 hover:from-slate-700 hover:to-slate-800">
              <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
              <span className="relative">Donate Now</span>
            </button>
            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border-2 border-slate-600 bg-transparent px-8 py-4 text-lg font-bold text-slate-600 transition-all duration-500 ease-in-out hover:bg-slate-600 hover:text-white hover:shadow-[0_0_20px_rgba(71,85,105,0.3)] hover:scale-105">
              <span className="relative">Request Help</span>
            </button>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { value: "1,234", label: "Medicines Donated Today" },
            { value: "567", label: "Lives Impacted" },
            { value: "25%", label: "Waste Reduced" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-slate-100/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-500 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <p className="text-4xl font-bold text-slate-700">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #475569;
          --secondary-color: #1e293b;
          --neon-blue: #94a3b8;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: var(--neon-blue);
          animation: float 20s infinite ease-in-out;
          opacity: 0;
        }
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            transform: translateY(-100vh);
            opacity: 0.4;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-120vh);
            opacity: 0;
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes gradient-text {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 5s ease infinite;
        }
      `}</style>
    </section>
  );
};

// Re-designed How It Works Section with modern timeline design
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Register & Verify",
      description:
        "Sign up with KYC verification to ensure trust and security in our ecosystem.",
      details:
        "Complete identity verification through our secure KYC process. Fast, simple, and compliant with global standards.",
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
      title: "Donate Securely",
      description:
        "Contribute medical supplies or funds via secure platform for complete transparency.",
      details:
        "Smart contracts handle your donations automatically, ensuring funds and supplies reach their destination without intermediaries.",
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
      title: "Track Impact",
      description:
        "Monitor your donation's journey and impact in real-time with detailed analytics.",
      details:
        "Receive live updates, detailed reports, and visual analytics on how your contribution is saving lives and improving healthcare.",
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
      className="py-32 bg-slate-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjOTRhM2I4Ii8+PC9zdmc+')] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            How MediTrust Works
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Our intuitive process combines advanced technology with
            human-centered design for seamless donations
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-200">
            <div
              className="w-full bg-gradient-to-b from-slate-600 to-slate-500 transition-all duration-500"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative mb-16 group cursor-pointer transition-all duration-500 ease-out ${
                activeStep === index ? "scale-105" : "hover:scale-102"
              } ${
                index % 2 === 0
                  ? "pr-[calc(50%+2rem)] text-right"
                  : "pl-[calc(50%+2rem)] text-left"
              }`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className="absolute left-1/2 top-10 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-slate-600 shadow-lg group-hover:scale-125 transition-all duration-300 z-20">
                <span className="text-slate-600 font-bold">{step.number}</span>
              </div>

              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-slate-300 transition-all duration-500 ease-out overflow-hidden group-hover:rotate-1 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex flex-col space-y-4 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-md transition-all duration-500 mx-auto ${
                      activeStep === index
                        ? "bg-gradient-to-r from-slate-600 to-slate-700 scale-110 rotate-12"
                        : "bg-slate-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  <div
                    className={`transition-all duration-500 ease-out overflow-hidden ${
                      activeStep === index
                        ? "max-h-32 opacity-100 scale-100"
                        : "max-h-0 opacity-0 scale-95"
                    }`}
                  >
                    <p className="text-base text-slate-500 bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Features Section with card flips and glow effects
const FeaturesSection = () => {
  const features = [
    {
      title: "System Security",
      description:
        "Immutable tracking technology ensures every transaction is verifiable and tamper-proof.",
      details:
        "Advanced encryption and decentralized validation protect your donations from fraud and manipulation.",
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
      title: "Real-time Tracking",
      description:
        "Live monitoring of donation journeys from contribution to final impact.",
      details:
        "Interactive dashboards provide instant updates, visualizations, and impact metrics for complete transparency.",
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
      title: "Smart Matching",
      description:
        "AI algorithms connect donations with the most urgent medical needs globally.",
      details:
        "Machine learning analyzes requirements in real-time to optimize distribution and maximize life-saving potential.",
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
      title: "Global Network",
      description:
        "Seamless connections between donors, hospitals, and patients worldwide.",
      details:
        "Multi-language support and cross-border compliance enable truly global healthcare impact.",
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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Powerful Features for Real Change
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Innovative tools designed to maximize the impact of every donation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="group relative perspective-1000">
              <div className="relative h-96 preserve-3d group-hover:rotate-y-180 transition-all duration-700 ease-in-out">
                {/* Front face */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-slate-50 rounded-3xl p-10 shadow-lg border border-slate-200 group-hover:shadow-2xl transition-shadow duration-500">
                  <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:bg-slate-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center group-hover:text-slate-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Back face */}
                <div className="absolute inset-0 rotate-y-180 backface-hidden bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl p-10 text-white shadow-2xl">
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-center leading-relaxed text-slate-200">
                    {feature.details}
                  </p>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <button className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 text-white font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
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
      className="py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(148,163,184,0.2)_0%,_transparent_60%)] pointer-events-none animate-pulse-slow"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Our Global Impact
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Measuring success through lives changed and communities strengthened
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group relative">
              <div className="absolute inset-0 bg-slate-100/50 rounded-3xl filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-3xl mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-2xl">
                  <span className="text-4xl">{stat.icon}</span>
                </div>
                <h3 className="text-6xl font-bold text-slate-900 mb-4">
                  {Math.round(counters[index]).toLocaleString()}
                  {stat.suffix}
                </h3>
                <p className="text-xl text-slate-600 font-medium group-hover:text-slate-800 transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Testimonials Section with carousel-like hover effects
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "MediTrust has completely transformed our donation management. The level of transparency is revolutionary!",
      author: "Dr. Sarah Johnson",
      role: "Chief Medical Officer at Global Health Org",
      avatar: "SJ",
    },
    {
      quote:
        "With secure tracking, we now have absolute confidence in our medical supply chain.",
      author: "Michael Chen",
      role: "Administrator at City Hospital Network",
      avatar: "MC",
    },
    {
      quote:
        "The AI matching system has accelerated our response to urgent medical needs dramatically.",
      author: "Lisa Rodriguez",
      role: "Director at International Aid Foundation",
      avatar: "LR",
    },
  ];

  return (
    <section id="testimonials" className="py-32 bg-slate-50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Voices from Our Community
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Real experiences from those making a difference every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:scale-105 hover:rotate-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl mb-8 shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-3xl font-bold">
                    {testimonial.avatar}
                  </span>
                </div>
                <p className="text-slate-700 italic mb-8 text-lg leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-xl text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                    {testimonial.author}
                  </h4>
                  <p className="text-base text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
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
