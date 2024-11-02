"use client";
import React, { useState, useEffect } from "react";
import UserManagement from "@/Components/staff/UsersManagement";
import CategoryManagement from "@/Components/staff/CategoriesManagement";
import "@/Css/Staff.css";
import { logoutUser } from "@/Components/Logout";
import { removeAllCookies } from "@/Components/Cookie";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("Người dùng");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const sidebarTabs = [
    {
      name: "Người dùng",
      icon: (
        <span className="flex items-center justify-center w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="PersonIcon"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"></path>
          </svg>
        </span>
      ),
    },
    {
      name: "Danh mục",
      icon: (
        <span className="flex items-center justify-center w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="CategoryIcon"
          >
            <path d="m12 2-5.5 9h11z"></path>
            <circle cx="17.5" cy="17.5" r="4.5"></circle>
            <path d="M3 13.5h8v8H3z"></path>
          </svg>
        </span>
      ),
    },
  ];

  const handleNavigation = (tabName: string) => {
    setActiveTab(tabName);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Người dùng":
        return <UserManagement userDetails={userDetails} />;
      case "Danh mục":
        return <CategoryManagement />;
      default:
        return <UserManagement userDetails={userDetails} />;
    }
  };

  const handleLogout = async () => {
    if (userId) {
      const isLoggedOut = await logoutUser(userId);
      if (isLoggedOut) {
        removeAllCookies();
        window.location.href = "/login";
      } else {
        console.error("Đăng xuất không thành công.");
      }
    } else {
      console.error("Không có ID người dùng để đăng xuất.");
    }
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Use useEffect to set userId on client mount
  useEffect(() => {
    const idFromCookies = Cookies.get("id");
    setUserId(idFromCookies || null);

    const fetchUserDetails = async () => {
      if (idFromCookies) {
        try {
          const response = await fetch(
            `http://localhost:5296/api/User/read/${idFromCookies}`
          );
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data.data);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Mở thanh bên</span>
        <svg
          className="w-6 h-6"
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

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-6 overflow-y-auto pt-10 bg-white border-r border-gray-200">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">
              <span className="text-emerald-500 text-2xl font-bold">
                Ticket{" "}
              </span>
              <span className="text-black text-2xl font-bold">Resell </span>
              <span className="text-gray-500 text-lg">Staff</span>
            </h2>
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center sm:hidden"
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
              <span className="sr-only">Đóng thanh bên</span>
            </button>
          </div>

          {/* Main navigation */}
          <nav className="flex flex-col flex-grow space-y-1">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleNavigation(tab.name)}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left ${
                  activeTab === tab.name ? "bg-gray-100" : ""
                }`}
              >
                <span
                  className={`mr-4 ${
                    activeTab === tab.name
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="flex-1">{tab.name}</span>
                {tab.name === "Users" && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {/* Replace '5' with dynamic badge count if available */}5
                  </span>
                )}
                {activeTab === tab.name && (
                  <span className="w-1.5 h-10 bg-emerald-500 rounded-full ml-4"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center p-2 text-gray-600">
              <span className="ms-3 font-medium text-sm overflow-hidden max-w-64 text-nowrap">
                {userDetails ? (
                  <>
                    {userDetails.email}
                    <br />
                    <span className="text-xs text-gray-500">ID: {userId}</span>
                  </>
                ) : (
                  "Đang tải..."
                )}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            >
              <LogOut className="w-5 h-5" />
              <span className="ms-3 font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-gray-50 ">
        <div className="">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl pt-4 shadow-sm">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-semibold text-gray-800">
                  {activeTab}
                </h1>
                <p className="mt-2 text-base text-gray-500">
                  Quản lí {activeTab.toLowerCase()}
                </p>
              </div>

              {/* Content Area */}
              <div className="p-8">{renderContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
