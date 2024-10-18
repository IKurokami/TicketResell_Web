"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import TicketsPage from "./TicketSeller"; // Adjust the path based on your file structure
import "@/Css/DashboardSeller.css";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Tickets");
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar starts closed
  const sidebarRef = useRef<HTMLDivElement | null>(null); // Create a ref for the sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle the sidebar visibility
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Tickets":
        return <TicketsPage />; // Render the TicketsPage component
      case "Transaction":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">Transaction Details</h2>
            <p>This is where you can manage transactions.</p>
          </div>
        );
      case "Revenue":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">Revenue Report</h2>
            <p>This is where you can view revenue details.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the sidebar
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setSidebarOpen(false); // Close the sidebar if clicked outside
    }
  };

  // Use effect to handle clicks outside the sidebar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up event listener
    };
  }, []);

  return (
    <div className="relative py-14 bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          ref={sidebarRef} // Attach the ref to the sidebar div
          className={`fixed inset-y-0 left-0 transform bg-green-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/5 z-10 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ul className="flex flex-col slidebar-seller p-6 space-y-5 mt-7">
            {["Tickets", "Transaction", "Revenue"].map((tab) => (
              <li key={tab}>
                <a
                  className={`block font-semibold no-underline rounded-lg p-2 transition-all duration-300 ${
                    selectedTab === tab
                      ? "bg-green-600 text-white"
                      : "bg-white text-black hover:bg-green-500"
                  }`}
                  onClick={() => {
                    setSelectedTab(tab);
                    toggleSidebar(); // Optionally close the sidebar when a tab is clicked
                  }}
                  href="#"
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content area */}
        <div
          className={`flex-grow pt-11 px-4 md:px-0 ${
            isSidebarOpen ? "ml-0" : "ml-0"
          }`} // Maintain space for the sidebar when it's open
        >
          <div className="flex items-center justify-between">
            <FontAwesomeIcon
              icon={faBars}
              className="text-lg cursor-pointer sm:hidden" // Show icon only on small screens
              onClick={toggleSidebar} // Toggle sidebar on click
            />
          </div>

          {/* Always render content regardless of the sidebar state */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
