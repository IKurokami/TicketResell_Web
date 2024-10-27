"use client";
import React, { useState } from "react";
import UserManagement from "@/Components/staff/UsersManagement";
import CategoryManagement from "@/Components/staff/CategoriesManagement";
import { logoutUser } from "@/Components/Logout";
import { removeAllCookies } from "@/Components/Cookie";
import Cookies from 'js-cookie';
import "@/Css/Staff.css";
import {
  Person as UsersIcon,
  Category as CategoriesIcon,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Người dùng");

  const sidebarTabs = [
    { name: "Người dùng", icon: <UsersIcon className="w-6 h-6" /> },
    { name: "Danh mục", icon: <CategoriesIcon className="w-6 h-6" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (tabName :any) => {
    setActiveTab(tabName);
    closeSidebar();
  };

  const handleLogout = async () => {
    const userId = Cookies.get('id');
    const isLoggedOut = await logoutUser(userId);

    if (isLoggedOut) {
      removeAllCookies();
      window.location.href = "/login";
    } else {
      console.error("Đăng xuất không thành công.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Người dùng":
        return <UserManagement />;
      case "Danh mục":
        return <CategoryManagement />;
      default:
        return <div>Nội dung cho {activeTab} ở đây</div>;
    }
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      {/* Nút Menu Hamburger (Di động) */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="fixed top-6 left-6 inline-flex items-center p-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
      >
        <span className="sr-only">Mở sidebar</span>
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

      {/* Mờ (Overlay) cho di động */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
      >
        <div className="h-full px-6 py-8 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {/* Tiêu đề Sidebar */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-border">
              <span className="text-emerald-500 text-2xl font-bold">
                Ticket{" "}
              </span>
              <span className="text-black text-2xl font-bold">Resell </span>
              Staff
            </h2>
            <button
              onClick={closeSidebar}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center sm:hidden"
            >
              <svg
                className="w-5 h-5"
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
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Điều hướng Sidebar */}
          <nav className="space-y-2 font-medium">
            {sidebarTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(tab.name)}
                className={`w-full flex items-center px-5 py-3 rounded-lg transition-colors duration-150 ease-in-out ${activeTab === tab.name ? "bg-gray-100 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <span className={`mr-4 ${activeTab === tab.name ? "text-emerald-600" : "text-gray-500"}`}>
                  {tab.icon}
                </span>
                <span className="flex-1">{tab.name}</span>
              </button>
            ))}

            {/* Nút Đăng Xuất */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center justify-start space-x-2 px-4 py-6 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;
