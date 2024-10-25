"use client";
import React, { useState } from "react";
import { Users, FolderTree } from "lucide-react";
import UserManagement from "@/Components/staff/UsersManagement";
import CategoryManagement from "@/Components/staff/CategoriesManagement";
import { logoutUser } from "@/Components/Logout"; // Điều chỉnh đường dẫn nhập khẩu nếu cần
import { removeAllCookies } from "@/Components/Cookie"; // Điều chỉnh đường dẫn nhập khẩu nếu cần
import Cookies from 'js-cookie';
import "@/Css/Staff.css";
import { Button } from "@/Components/ui/button";
import { LogOut } from "lucide-react";

const StaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Người dùng");

  const sidebarTabs = [
    { name: "Người dùng", icon: <Users className="w-6 h-6" /> },
    { name: "Danh mục", icon: <FolderTree className="w-6 h-6" /> },
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

  const handleLogout = async () => {
    const userId = Cookies.get('id'); // Lấy ID người dùng từ cookies
    const isLoggedOut = await logoutUser(userId);

    if (isLoggedOut) {
      removeAllCookies(); // Xóa tất cả cookies khi đăng xuất thành công
      // Chuyển hướng đến trang đăng nhập
      window.location.href = "/login"; // Điều chỉnh đường dẫn nếu cần
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
        className={`fixed sm:relative inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
      >
        <div className="h-full px-6 py-8 overflow-y-auto bg-white border-r border-gray-200">
          {/* Tiêu đề Sidebar */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-semibold">
              <span className="text-emerald-500 text-3xl font-bold">Ticket{" "}</span>
              <span className="text-black text-3xl font-bold">Resell{" "}</span>
              <span className="text-gray-600 text-2xl inline mt-1">Staff</span>
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

          {/* Điều hướng Sidebar */}
          <nav className="space-y-2">
            {sidebarTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(tab.name)}
                className={`w-full flex items-center px-5 py-4 text-base font-medium rounded-xl transition-colors duration-150 ease-in-out ${activeTab === tab.name ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <span className={`mr-4 ${activeTab === tab.name ? "text-emerald-600" : "text-gray-500"}`}>
                  {tab.icon}
                </span>
                <span className="flex-1">{tab.name}</span>
                {activeTab === tab.name && <span className="w-1.5 h-10 bg-emerald-500 rounded-full ml-4"></span>}
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
      <main className="flex-1 p-10 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;
