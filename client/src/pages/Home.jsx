import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const MediTrustHero = () => {
  const [animationType, setAnimationType] = useState("3d"); // '3d' or 'image'
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (animationType === "3d" && canvasRef.current) {
      initThreeJS();
      return () => {
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }
  }, [animationType]);

  const initThreeJS = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.setClearColor(0xf5faff, 0);
    canvasRef.current.appendChild(renderer.domElement);

    // Create animated medical particles
    const geometry = new THREE.SphereGeometry(0.15, 12, 8);
    const material = new THREE.MeshPhongMaterial({
      color: 0x1e88e5,
      transparent: true,
      opacity: 0.6,
      shininess: 100,
    });

    const particles = new THREE.Group();

    for (let i = 0; i < 30; i++) {
      const particle = new THREE.Mesh(geometry, material);

      particle.position.x = (Math.random() - 0.5) * 20;
      particle.position.y = (Math.random() - 0.5) * 15;
      particle.position.z = (Math.random() - 0.5) * 15;

      particle.userData = {
        floatSpeed: Math.random() * 0.008 + 0.003,
        rotationSpeed: Math.random() * 0.02 + 0.01,
      };

      particles.add(particle);
    }

    scene.add(particles);
    particlesRef.current = particles;

    // Add medical cross geometry
    const crossGeometry = new THREE.BoxGeometry(4, 1, 0.5);
    const crossGeometry2 = new THREE.BoxGeometry(1, 4, 0.5);
    const crossMaterial = new THREE.MeshPhongMaterial({
      color: 0x26a69a,
      transparent: true,
      opacity: 0.8,
    });

    const cross1 = new THREE.Mesh(crossGeometry, crossMaterial);
    const cross2 = new THREE.Mesh(crossGeometry2, crossMaterial);
    const crossGroup = new THREE.Group();
    crossGroup.add(cross1);
    crossGroup.add(cross2);
    crossGroup.position.set(8, 0, -5);
    scene.add(crossGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x1e88e5, 1, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 25;

    sceneRef.current = { scene, camera, renderer, particles, crossGroup };
    rendererRef.current = renderer;

    const animate = () => {
      requestAnimationFrame(animate);

      if (particles) {
        particles.children.forEach((particle, index) => {
          particle.position.y +=
            Math.sin(Date.now() * particle.userData.floatSpeed + index) * 0.01;
          particle.rotation.x += particle.userData.rotationSpeed;
          particle.rotation.y += particle.userData.rotationSpeed * 0.5;
        });

        particles.rotation.y += 0.001;
      }

      if (crossGroup) {
        crossGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();
  };

  const handleGetStarted = () => {
    // Smooth scroll to signup section or handle signup
    console.log("Get Started clicked");
  };

  const handleLearnMore = () => {
    // Scroll to how it works section
    console.log("Learn More clicked");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Background Canvas or Image */}
      <div className="absolute inset-0 z-0">
        {animationType === "3d" ? (
          <div ref={canvasRef} className="w-full h-full" />
        ) : (
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Medical background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                MediTrust
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Animation Type Toggle */}
            <div className="flex justify-center lg:justify-start space-x-4 mb-6">
              <button
                onClick={() => setAnimationType("3d")}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  animationType === "3d"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setAnimationType("image")}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  animationType === "image"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Image View
              </button>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Medicine
                <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Donations Forever
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Connect donors, hospitals, and patients through our secure
                blockchain platform. Every donation tracked, every life saved
                matters.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Get Started Today</span>
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

              <button
                onClick={handleLearnMore}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                Learn How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">KYC Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-sm">AI Matched</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Medicines Donated */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
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
                  <span className="text-2xl font-bold text-blue-600">
                    12.5K+
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Medicines Donated
                </h3>
                <p className="text-sm text-gray-500">Verified & Distributed</p>
              </div>

              {/* Lives Impacted */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
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
                  <span className="text-2xl font-bold text-teal-600">5K+</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Lives Impacted
                </h3>
                <p className="text-sm text-gray-500">Across Communities</p>
              </div>
            </div>

            {/* Featured Partnership */}
            <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                  <h3 className="font-semibold text-gray-800">
                    Blockchain Verified
                  </h3>
                  <p className="text-sm text-gray-600">
                    Every donation tracked & transparent
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      Trusted Platform
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediTrustHero;
