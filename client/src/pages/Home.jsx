import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Footer from "../components/Footer";

// Enhanced Navbar with mobile menu
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">+</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">MediTrust</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("impact")}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Testimonials
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Login
            </button>
            <button className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg">
              Sign Up
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-slate-600"
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
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block px-3 py-2 text-slate-600 hover:text-slate-800"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block px-3 py-2 text-slate-600 hover:text-slate-800"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("impact")}
                className="block px-3 py-2 text-slate-600 hover:text-slate-800"
              >
                Impact
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block px-3 py-2 text-slate-600 hover:text-slate-800"
              >
                Testimonials
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Enhanced Hero Section with optimized 3D
const HeroSection = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    initThreeJS();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sceneRef.current?.renderer) {
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  const initThreeJS = () => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    // Create network-style connections
    const particlesGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const particlesMaterial = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.7,
    });

    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.2,
    });

    const particles = [];
    const connections = [];

    // Create fewer, more organized particles
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(particlesGeometry, particlesMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15
      );
      particle.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        originalY: particle.position.y,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(particle);
      particles.push(particle);
    }

    // Create connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].position.distanceTo(
          particles[j].position
        );
        if (distance < 15) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            particles[i].position.clone(),
            particles[j].position.clone(),
          ]);
          const line = new THREE.Line(geometry, connectionMaterial);
          scene.add(line);
          connections.push({ line, p1: particles[i], p2: particles[j] });
        }
      }
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    camera.position.z = 25;
    sceneRef.current = { scene, camera, renderer, particles, connections };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      particles.forEach((particle, index) => {
        // Gentle floating motion
        particle.position.y =
          particle.userData.originalY +
          Math.sin(time + particle.userData.phase) * 2;
        particle.position.x += particle.userData.velocity.x;
        particle.position.z += particle.userData.velocity.z;

        // Subtle pulsing
        const scale = 0.8 + Math.sin(time * 2 + index) * 0.2;
        particle.scale.setScalar(scale);

        // Boundary bounce
        if (Math.abs(particle.position.x) > 20)
          particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.z) > 7)
          particle.userData.velocity.z *= -1;
      });

      // Update connections
      connections.forEach(({ line, p1, p2 }) => {
        const positions = line.geometry.attributes.position;
        positions.setXYZ(0, p1.position.x, p1.position.y, p1.position.z);
        positions.setXYZ(1, p2.position.x, p2.position.y, p2.position.z);
        positions.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`text-center lg:text-left space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Blockchain-Powered Medical Donations
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Transform Medicine
              <span className="block bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                Donations Forever
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              Connect donors, hospitals, and patients through our secure
              blockchain platform. Every donation tracked, every life saved
              matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-xl hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
                <span>Start Donating</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
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
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-full font-semibold text-lg hover:border-slate-500 hover:text-slate-800 hover:bg-slate-50/50 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              {["Blockchain Verified", "KYC Protected", "AI Matched"].map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-slate-600"
                  >
                    <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div
            className={`hidden lg:block transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Enhanced visual representation */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl transform rotate-6 opacity-50"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            Verified Donation
                          </div>
                          <div className="text-xs text-slate-500">
                            Blockchain Confirmed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">
                          $2,500
                        </div>
                        <div className="text-xs text-green-600">
                          ✓ Delivered
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">
                          Impact Tracking
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Lives Impacted</span>
                          <span className="font-medium text-slate-800">
                            127
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-slate-600 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced How It Works Section
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Register & Verify",
      description:
        "Sign up with KYC verification to ensure trust and security in our ecosystem.",
      details:
        "Complete identity verification through our secure blockchain-based KYC process.",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Donate Securely",
      description:
        "Contribute medical supplies or funds via blockchain for complete transparency.",
      details:
        "Smart contracts ensure your donations reach their intended recipients automatically.",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
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
        "Get instant updates on how your contributions are making a difference in people's lives.",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How MediTrust Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our streamlined process makes medical donations transparent, secure,
            and impactful
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-500 ${
                activeStep === index ? "scale-105" : "hover:scale-102"
              }`}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-slate-300 transform -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-slate-600 transition-all duration-500"
                    style={{ width: activeStep > index ? "100%" : "0%" }}
                  ></div>
                </div>
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 z-10">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-600 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg group-hover:bg-slate-700 transition-colors">
                  {step.number}
                </div>

                <div className="flex flex-col items-center text-center space-y-4 pt-8">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      activeStep === index ? "bg-slate-600" : "bg-slate-500"
                    }`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      activeStep === index
                        ? "max-h-20 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 mt-2">
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

// New Features Section
const FeaturesSection = () => {
  const features = [
    {
      title: "Blockchain Security",
      description:
        "Immutable records ensure every transaction is transparent and secure.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      title: "Real-time Tracking",
      description:
        "Monitor donation progress from contribution to final delivery.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Smart Matching",
      description:
        "AI-powered system connects donations with urgent medical needs.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Global Network",
      description:
        "Connect with hospitals and donors worldwide through our platform.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced technology meets compassionate healthcare to create
            meaningful impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Impact Section
const ImpactSection = () => {
  const stats = [
    { value: "10K+", label: "Donors", icon: "👥" },
    { value: "500+", label: "Hospitals", icon: "🏥" },
    { value: "1M+", label: "Lives Saved", icon: "❤️" },
  ];

  return (
    <section id="impact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Our Global Impact
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Together, we're revolutionizing healthcare access worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-600 text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "MediTrust has transformed how we manage medical donations. The transparency is unmatched!",
      author: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      avatar: "SJ",
    },
    {
      quote:
        "The blockchain tracking gives us complete confidence in our supply chain management.",
      author: "Michael Chen",
      role: "Hospital Administrator",
      avatar: "MC",
    },
    {
      quote:
        "AI matching connects donors with urgent needs faster than ever before.",
      author: "Lisa Rodriguez",
      role: "NGO Director",
      avatar: "LR",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real stories from healthcare professionals and partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full mb-4">
                <span className="font-semibold">{testimonial.avatar}</span>
              </div>
              <p className="text-slate-700 italic mb-4">
                "{testimonial.quote}"
              </p>
              <div>
                <h4 className="font-semibold text-slate-900">
                  {testimonial.author}
                </h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
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
    <div className="relative">
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
