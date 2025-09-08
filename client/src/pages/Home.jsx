import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import Footer from '../components/Footer'
// Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#impact"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Impact
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              Testimonials
            </a>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Login
            </button>
            <button className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
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

    // Create subtle floating particles
    const geometry = new THREE.SphereGeometry(0.08, 8, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.3,
    });

    const particles = [];

    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(geometry, material);

      // Start particles from left side
      particle.position.x = -30 + Math.random() * 10;
      particle.position.y = (Math.random() - 0.5) * 20;
      particle.position.z = (Math.random() - 0.5) * 20;

      particle.userData = {
        velocity: {
          x: 0.01 + Math.random() * 0.02,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005,
        },
        originalY: particle.position.y,
      };

      scene.add(particle);
      particles.push(particle);
    }

    // Minimal lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    camera.position.z = 25;

    sceneRef.current = { scene, camera, renderer, particles };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      particles.forEach((particle) => {
        // Move particles from left to right
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;

        // Gentle floating motion
        particle.position.y +=
          Math.sin(Date.now() * 0.001 + particle.position.x) * 0.002;

        // Reset particle when it goes off screen
        if (particle.position.x > 30) {
          particle.position.x = -30;
          particle.position.y = (Math.random() - 0.5) * 20;
          particle.position.z = (Math.random() - 0.5) * 20;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle 3D Background */}
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Hero Image Background */}
      <div className="absolute inset-0 z-5">
        <img
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Medical professionals"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
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
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group px-8 py-4 bg-slate-700 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Start Donating</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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

              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-lg hover:border-slate-500 hover:text-slate-800 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">KYC Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Matched</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
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
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 008 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">
                    12.5K+
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Medicines Donated
                </h3>
                <p className="text-sm text-slate-500">Verified & Distributed</p>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-slate-700">5K+</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Lives Impacted
                </h3>
                <p className="text-sm text-slate-500">Across Communities</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-500/10 to-slate-600/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-slate-600"
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
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Blockchain Verified
                  </h3>
                  <p className="text-sm text-slate-600">
                    Every donation tracked & transparent
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 ml-2">
                      Trusted Platform
                    </span>
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

// How It Works Component
const HowItWorksSection = () => {
  const steps = [
    {
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Register & Verify",
      description:
        "Complete secure KYC verification to ensure trust and safety for all users.",
    },
    {
      icon: (
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      title: "Upload & Donate",
      description:
        "Upload medicine details. Our AI matches donations with those in need.",
    },
    {
      icon: (
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
      ),
      title: "Request & Approve",
      description:
        "Organizations request medicines with efficient approval processing.",
    },
    {
      icon: (
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Track & Deliver",
      description:
        "Monitor donation journey in real-time on blockchain ledger.",
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
            A seamless and transparent process for medicine donation, powered by
            blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-slate-600 rounded-xl mb-6">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Impact Section Component
const ImpactSection = () => {
  const stats = [
    { number: "12,500+", label: "Medicines Distributed", percentage: 85 },
    { number: "5,000+", label: "Lives Impacted", percentage: 70 },
    { number: "150+", label: "Partner Organizations", percentage: 60 },
    { number: "25+", label: "Cities Covered", percentage: 45 },
  ];

  return (
    <section id="impact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Impact</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Measuring success through the lives we change and the communities we
            serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgb(226 232 240)"
                    strokeWidth="8"
                    fill="transparent"
                  ></circle>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#475569"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${stat.percentage * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-700">
                    {stat.percentage}%
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {stat.number}
              </h3>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Hospital Director",
      content:
        "MediTrust has transformed how we handle medicine donations. The transparency and efficiency are remarkable.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "NGO Coordinator",
      content:
        "The blockchain tracking gives us complete visibility into where donations go. It's a game-changer for accountability.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Pharmacy Manager",
      content:
        "The platform's AI matching system ensures our surplus medicines reach the right patients quickly.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Hear from the medical professionals and organizations who trust
            MediTrust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-slate-700 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const [formData, setFormData] = useState({ email: "", role: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.role) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Join the MediTrust Network
        </h2>
        <p className="text-xl text-slate-600 mb-12">
          Start making a difference in healthcare accessibility today.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Welcome to MediTrust!
              </h3>
              <p className="text-slate-600">
                Check your email for next steps as a {formData.role}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-6 py-4 border border-slate-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Donor", "Hospital", "NGO", "Individual"].map((role) => (
                  <label
                    key={role}
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.role === role
                        ? "border-slate-600 bg-slate-50 text-slate-900"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="sr-only"
                    />
                    <span className="font-medium">{role}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-slate-700 text-white rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Today
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};


// Main App Component
const MediTrustApp = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ImpactSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default MediTrustApp;
