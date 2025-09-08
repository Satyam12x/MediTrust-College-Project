import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

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

    // Create dynamic animated particles
    const particlesGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    const particlesMaterial = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.5,
    });

    const particles = [];
    for (let i = 0; i < 100; i++) {
      const particle = new THREE.Mesh(particlesGeometry, particlesMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );
      particle.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.05,
          z: (Math.random() - 0.5) * 0.05,
        },
        rotation: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 0.5,
      };
      scene.add(particle);
      particles.push(particle);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    camera.position.z = 30;

    sceneRef.current = { scene, camera, renderer, particles };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      particles.forEach((particle) => {
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;

        // Add pulsating effect
        particle.scale.setScalar(
          particle.userData.scale +
            Math.sin(Date.now() * 0.002 + particle.userData.rotation) * 0.2
        );

        // Bounce particles within bounds
        if (Math.abs(particle.position.x) > 30)
          particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 20)
          particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 10)
          particle.userData.velocity.z *= -1;

        particle.userData.rotation += 0.02;
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
    return () => window.removeEventListener("resize", handleResize);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
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
                Learn More
              </button>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">KYC Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Matched</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative w-full max-w-md mx-auto">
              <svg
                className="w-full h-auto"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 300 Q 150 250, 200 300 T 300 300"
                  stroke="url(#grad1)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M150 350 Q 200 300, 250 350"
                  stroke="url(#grad2)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#475569", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#1e293b", stopOpacity: 1 }}
                    />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#64748b", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#334155", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Register & Verify",
      description:
        "Sign up with KYC verification to ensure trust and security.",
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Donate Securely",
      description:
        "Contribute medical supplies or funds via blockchain for transparency.",
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
            d="M12 8c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3s3-1.343 3-3v-2c0-1.657-1.343-3-3-3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10V8a7 7 0 0114 0v2"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Track Impact",
      description: "Monitor your donation’s journey and impact in real-time.",
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          How MediTrust Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-600 text-white text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                {step.number}
              </div>
              <div className="flex flex-col items-center text-center space-y-4 pt-8">
                <div className="w-14 h-14 bg-slate-600 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Impact Section
const ImpactSection = () => {
  const stats = [
    { value: "10K+", label: "Donors Connected" },
    { value: "500+", label: "Hospitals Supported" },
    { value: "1M+", label: "Lives Impacted" },
  ];

  return (
    <section
      id="impact"
      className="py-20 bg-gradient-to-br from-slate-100 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 text-center"
            >
              <h3 className="text-3xl font-bold text-slate-700">
                {stat.value}
              </h3>
              <p className="text-slate-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "MediTrust made donating medical supplies seamless and transparent. I could see exactly where my contribution went!",
      author: "Dr. Sarah Johnson",
      role: "Physician",
    },
    {
      quote:
        "As a hospital, we rely on MediTrust to connect us with donors efficiently. It’s a game-changer!",
      author: "Michael Lee",
      role: "Hospital Administrator",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
            >
              <p className="text-slate-600 italic mb-4">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.author[0]}
                </div>
                <div className="ml-4">
                  <p className="text-slate-800 font-semibold">
                    {testimonial.author}
                  </p>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action Section
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-700 to-slate-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">Join the MediTrust Movement</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Be part of a transparent, secure, and impactful way to save lives
          through medical donations.
        </p>
        <button className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-lg">
          Get Started Now
        </button>
      </div>
    </section>
  );
};

// Main App Component
const MediTrustApp = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ImpactSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default MediTrustApp;
