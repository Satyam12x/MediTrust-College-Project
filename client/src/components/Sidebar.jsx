import React from "react";
import {
  Upload,
  Truck,
  History,
  Settings,
  LogOut,
  Bell,
  CheckCircle,
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
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "kyc", icon: CheckCircle, label: "KYC Verification" },
    { id: "certificates", icon: Award, label: "Certificates" },
  ];

  return (
    <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between min-h-screen sticky top-0 font-['Space_Grotesk','Noto_Sans',sans-serif] text-gray-900">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img
            alt="User avatar"
            className="rounded-full size-12"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARb0gYAkAxRyUdJV3IYHv9LVzgVlt8r7obGLPw9_JKSJSUYxRaCaBoNBP_ab7xJS-vXN64fuV2qGJA6spQvjfjUnn2OUs0mx9r3AtfinmN5rsemTNn9o8VznDY4UUR7oY5WYTzBiqbLYQHKHzet7q4cHpL4x22B5pQHhszXwhUe5UCQ4IOfqakJzi94Z2AAk15c9yfdt5u1LCwxYqOoISAH9avusFFywaN0RzV4GRatTehxD_W8UrNTxJL-ZrkkSYU6NotPeDVGuz6"
          />
          <div>
            <h1 className="font-bold text-lg">Sophia Clark</h1>
            <p className="text-sm text-gray-600">Donor & Receiver</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-[#19183B] text-white font-bold"
                  : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-300">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;