import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Upload,
  Medication,
  Favorite,
  VerifiedUser,
  WorkspacePremium,
  MilitaryTech,
} from "lucide-react";

// Skeleton Loading Components
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
  </div>
);

const SkeletonImpactCard = () => (
  <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    donations: [],
    requests: [],
    impact: { livesTouched: 0, verificationStatus: "Not Verified" },
    badges: [],
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserData({
        donations: [
          {
            id: "#98765",
            medicine: "Aspirin",
            quantity: "100mg",
            date: "2024-07-25",
            recipient: "City Hospital",
          },
          {
            id: "#54321",
            medicine: "Cetirizine",
            quantity: "10mg",
            date: "2024-07-18",
            recipient: "Community Clinic",
          },
        ],
        requests: [
          {
            id: "#12345",
            medicine: "Amoxicillin",
            quantity: "500mg",
            status: "pending",
            date: "2024-07-26",
            priority: "high",
          },
          {
            id: "#67890",
            medicine: "Ibuprofen",
            quantity: "200mg",
            status: "approved",
            date: "2024-07-20",
            priority: "medium",
          },
        ],
        impact: {
          livesTouched: 12,
          verificationStatus: "KYC Verified",
        },
        badges: [
          {
            title: "Top Donor - July 2024",
            description: "Thanks for your generosity!",
            certificateLink: "#",
          },
          {
            title: "Community Champion",
            description: "For 10+ donations.",
            certificateLink: "#",
          },
        ],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const isNewUser =
    userData.donations.length === 0 && userData.requests.length === 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-['Manrope']">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1C352D]">
                Welcome back, Sophia!
              </h1>
              <p className="text-gray-500 mt-1">
                Your actions today can save a life. Let's make a difference.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#1C352D] text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-opacity">
                <Upload className="w-5 h-5" />
                <span>Donate Medicine</span>
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-[#1C352D] hover:border-[#1C352D] py-2 px-4 rounded-full transition-all duration-300 shadow-sm">
                <Medication className="w-5 h-5" />
                <span>Request Medicine</span>
              </button>
            </div>
          </div>

          {isNewUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="bg-white rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
                  <div className="mb-4">
                    <Favorite className="text-6xl text-[#1C352D]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Be a Hero Today
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Your surplus medicine could be the miracle someone is
                    praying for. Donate now and bring hope to those in need.
                  </p>
                  <button className="flex items-center gap-2 bg-[#1C352D] text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-opacity text-lg">
                    <Upload className="w-5 h-5" />
                    <span>Start a Donation</span>
                  </button>
                </section>
                <section className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Newly Available Medicines
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <SkeletonCard key={i} />
                        ))
                      : [
                          {
                            name: "Amoxicillin 500mg",
                            type: "Antibiotic",
                            color: "bg-blue-100 text-blue-600",
                          },
                          {
                            name: "Lisinopril 10mg",
                            type: "Blood Pressure",
                            color: "bg-red-100 text-red-600",
                          },
                          {
                            name: "Metformin 500mg",
                            type: "Diabetes",
                            color: "bg-purple-100 text-purple-600",
                          },
                          {
                            name: "Ibuprofen 200mg",
                            type: "Pain Relief",
                            color: "bg-yellow-100 text-yellow-600",
                          },
                        ].map((medicine, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
                          >
                            <div
                              className={`p-3 rounded-full ${medicine.color}`}
                            >
                              <Medication className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {medicine.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {medicine.type}
                              </p>
                            </div>
                            <button className="ml-auto bg-white border border-gray-200 text-gray-600 hover:bg-[#1C352D] hover:text-white font-bold py-2 px-3 rounded-full text-sm transition-all duration-300 shadow-sm">
                              Request
                            </button>
                          </div>
                        ))}
                  </div>
                  <div className="text-center mt-6">
                    <a
                      className="text-[#1C352D] font-semibold hover:underline"
                      href="#"
                    >
                      View all available medicines →
                    </a>
                  </div>
                </section>
              </div>
              <div className="lg:col-span-1 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Impact
                  </h2>
                  {isLoading ? (
                    <SkeletonImpactCard />
                  ) : (
                    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                          <Favorite className="text-3xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            Lives Touched
                          </h3>
                          <p className="text-2xl font-bold text-[#1C352D]">
                            {userData.impact.livesTouched}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                          <VerifiedUser className="text-3xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            Verification Status
                          </h3>
                          <p className="text-sm font-semibold text-green-600">
                            {userData.impact.verificationStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Request Tracking
                  </h2>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1C352D] shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Request ID
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Medicine
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Quantity
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Status
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <tr key={i} className="border-b border-gray-200">
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                </td>
                              </tr>
                            ))
                          : userData.requests.map((request, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300 group"
                              >
                                <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getPriorityDot(
                                      request.priority
                                    )}`}
                                  ></div>
                                  {request.id}
                                </td>
                                <td className="p-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                  {request.medicine}
                                </td>
                                <td className="p-4 text-gray-600">
                                  {request.quantity}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                      request.status
                                    )}`}
                                  >
                                    {request.status.charAt(0).toUpperCase() +
                                      request.status.slice(1)}
                                  </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                  {request.date}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Donation History
                  </h2>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1C352D] shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Donation ID
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Medicine
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Quantity
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Date
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-500">
                            Recipient
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <tr key={i} className="border-b border-gray-200">
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                </td>
                                <td className="p-4">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                </td>
                              </tr>
                            ))
                          : userData.donations.map((donation, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300 group"
                              >
                                <td className="p-4 font-medium text-gray-800">
                                  {donation.id}
                                </td>
                                <td className="p-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                  {donation.medicine}
                                </td>
                                <td className="p-4 text-gray-600">
                                  {donation.quantity}
                                </td>
                                <td className="p-4 text-gray-600">
                                  {donation.date}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[#1C352D]">
                                    location_on
                                  </span>
                                  {donation.recipient}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
              <div className="lg:col-span-1 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Impact
                  </h2>
                  {isLoading ? (
                    <SkeletonImpactCard />
                  ) : (
                    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                          <Favorite className="text-3xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            Lives Touched
                          </h3>
                          <p className="text-2xl font-bold text-[#1C352D]">
                            {userData.impact.livesTouched}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 rounded-full size-12 flex-shrink-0 flex items-center justify-center">
                          <VerifiedUser className="text-3xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            Verification Status
                          </h3>
                          <p className="text-sm font-semibold text-green-600">
                            {userData.impact.verificationStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Badges
                  </h2>
                  <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                    {isLoading
                      ? Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg animate-pulse"
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            </div>
                          </div>
                        ))
                      : userData.badges.map((badge, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div
                              className={`rounded-full size-10 flex-shrink-0 flex items-center justify-center ${
                                index === 0
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {index === 0 ? (
                                <WorkspacePremium className="w-5 h-5" />
                              ) : (
                                <MilitaryTech className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {badge.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {badge.description}
                              </p>
                              <a
                                className="text-sm text-[#1C352D] font-semibold hover:underline"
                                href={badge.certificateLink}
                              >
                                View Certificate
                              </a>
                            </div>
                          </div>
                        ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
