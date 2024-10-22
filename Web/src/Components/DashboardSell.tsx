"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Settings } from "lucide-react";
import { GrTransaction } from "react-icons/gr";
import { IoTicketOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import TicketsPage from "./TicketSeller";
import TransactionTable from "./TransactionPage";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Ticket"); // Set default to "Ticket"
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, disable: true },
    { id: "ticket", label: "Ticket", icon: IoTicketOutline },
    { id: "transactions", label: "Transactions", icon: GrTransaction },
    { id: "revenue", label: "Revenue", icon: MdAttachMoney },
    { id: "setting", label: "Setting", icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "Ticket":
        return <TicketsPage />;
      case "Transactions":
        return <TransactionTable />;
      default:
        return <TicketsPage />; // Default to TicketsPage
    }
  };

  return (
    <div className="flex bg-white pt-10">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed min-h-[140vh] inset-y-0 left-0 transform bg-white  transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full lg:p-4 md:mt-12">
          <div className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.disable) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center w-full px-4 py-3 text-lg font-bold text-gray-400"
                  >
                    <Icon className="w-5 h-5 mr-3 text-gray-400" />
                    {item.label}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedTab(item.label)}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors ${
                    selectedTab === item.label
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16   ">
        <div className="max-[1024px]:p-1">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={toggleSidebar}
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
