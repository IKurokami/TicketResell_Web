"use client"
import React, { useState } from "react";
import { Users, FolderTree } from "lucide-react";
import UserManagement from "@/Components/staff/UsersManagement";
import CategoryManagement from "@/Components/staff/CategoriesManagement";
import "@/Css/Staff.css"


const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Users");

  const sidebarTabs = [
    { name: "Users", icon: <Users className="w-6 h-6" /> },
    { name: "Categories", icon: <FolderTree className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (tabName: any) => {
    setActiveTab(tabName);
    closeSidebar();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Users":
        return <UserManagement />;
      case "Categories":
        return <CategoryManagement />;
      default:
        return <div>{activeTab} content goes here</div>;
    }
  };
 
  return (
    <div className="relative min-h-screen flex bg-gray-100">
      {/* Hamburger Menu Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="fixed top-6 left-6 inline-flex items-center p-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-7 h-7"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
      >
        <div className="h-full px-6 py-8 overflow-y-auto bg-white border-r border-gray-200">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-semibold">
              <span className="text-emerald-500 text-3xl font-bold">
                Ticket{" "}
              </span>
              <span className="text-black text-3xl font-bold">
                Resell{" "}
              </span>
              <span className="text-gray-600 text-2xl inline mt-1">Staff</span> {/* Thay đổi ở đây */}
            </h2>


            <button
              onClick={closeSidebar}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 inline-flex items-center sm:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {sidebarTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(tab.name)}
                className={`w-full flex items-center px-5 py-4 text-base font-medium rounded-xl transition-colors duration-150 ease-in-out ${activeTab === tab.name
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className={`mr-4 ${activeTab === tab.name
                    ? "text-emerald-600"
                    : "text-gray-500"
                  }`}>
                  {tab.icon}
                </span>
                <span className="flex-1">{tab.name}</span>
                {activeTab === tab.name && (
                  <span className="w-1.5 h-10 bg-emerald-500 rounded-full ml-4"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-gray-50 ">
        <div className="">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800">
                  {activeTab}
                </h1>
                <p className="mt-2 text-base text-gray-500">
                  Manage {activeTab.toLowerCase()} in the system
                </p>
              </div>

              {/* Content Area */}
              <div className="p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;