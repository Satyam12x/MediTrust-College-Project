import React from "react";
import {
  LayoutDashboard,
  Upload,
  Medication,
  LocalShipping,
  History,
  Notifications,
  VerifiedUser,
  WorkspacePremium,
  Settings,
  Logout,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
    },
    { id: "upload", icon: Upload, label: "Upload Medicine" },
    { id: "medicines", icon: Medication, label: "Available Medicines" },
    { id: "tracking", icon: LocalShipping, label: "Request Tracking" },
    { id: "history", icon: History, label: "Donation History" },
    { id: "notifications", icon: Notifications, label: "Notifications" },
    { id: "kyc", icon: VerifiedUser, label: "KYC Verification" },
    { id: "certificates", icon: WorkspacePremium, label: "Certificates" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between min-h-screen sticky top-0 font-['Manrope']">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img
            alt="User avatar"
            className="rounded-full size-12"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARb0gYAkAxRyUdJV3IYHv9LVzgVlt8r7obGLPw9_JKSJSUYxRaCaBoNBP_ab7xJS-vXN64fuV2qGJA6spQvjfjUnn2OUs0mx9r3AtfinmN5rsemTNn9o8VznDY4UUR7oY5WYTzBiqbLYQHKHzet7q4cHpL4x22B5pQHhszXwhUe5UCQ4IOfqakJzi94Z2AAk15c9yfdt5u1LCwxYqOoISAH9avusFFywaN0RzV4GRatTehxD_W8UrNTxJL-ZrkkSYU6NotPeDVGuz6"
          />
          <div>
            <h1 className="font-bold text-lg text-gray-800">Sophia Clark</h1>
            <p className="text-sm text-gray-500">Donor & Receiver</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                item.active
                  ? "bg-[#1C352D] text-white font-bold"
                  : "hover:bg-gray-50 text-gray-600 hover:text-[#1C352D]"
              }`}
              href="#"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <a
          className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 hover:text-[#1C352D] transition-all duration-300"
          href="#"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300"
          href="#"
        >
          <Logout className="w-5 h-5" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
