import React from "react";
import {
  Upload,
  Truck,
  History,
  Settings,
  LogOut,
  Shield,
  Award,
  TrendingUp,
  Package,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "dashboard", icon: TrendingUp, label: "Dashboard", active: true },
    { id: "upload", icon: Upload, label: "Upload Medicine" },
    { id: "medicines", icon: Package, label: "Available Medicines" },
    { id: "tracking", icon: Truck, label: "Request Tracking" },
    { id: "history", icon: History, label: "Donation History" },
  ];

  return (
    <aside className="w-72 bg-white shadow-lg p-6 flex flex-col justify-between min-h-screen sticky top-0 font-['Poppins']">
      <div>
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#1C352D] transition-all duration-300 hover:shadow-md group">
          <div className="relative">
            <div className="w-14 h-14 bg-[#1C352D] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              SC
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1C352D] rounded-full border-2 border-white flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-800 group-hover:text-[#1C352D] transition-colors duration-300">
              Sophia Clark
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Verified Donor
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id
                  ? "bg-[#1C352D] text-white shadow-md"
                  : "hover:bg-gray-50 text-gray-600 hover:text-[#1C352D] border border-transparent hover:border-[#1C352D]"
              }`}
            >
              <div className="absolute inset-0 bg-[#1C352D]/0 group-hover:bg-[#1C352D]/5 transition-all duration-300"></div>
              <item.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-[#1C352D] transition-all duration-300 group border border-transparent hover:border-[#1C352D]">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 group border border-transparent hover:border-red-200">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
