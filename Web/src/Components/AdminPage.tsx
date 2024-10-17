"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import TicketManager from "./TicketManager";
import { fetchTickets } from "@/models/TicketFetch";
import { UserService, User } from "@/models/UserManagement";
import {
  Person as UsersIcon,
  Group as RolesIcon,
  TravelExplore as TicketsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
} from "@mui/icons-material";
import UserManager from "./UserManager";

const AdminPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tickets");
  const router = useRouter();
  const searchParams = useSearchParams();
  const sidebarTabs = [
    { name: "Users", icon: <UsersIcon /> },
    { name: "Roles", icon: <RolesIcon /> },
    { name: "Tickets", icon: <TicketsIcon /> },
    { name: "Categories", icon: <CategoriesIcon /> },
    { name: "Orders", icon: <OrdersIcon /> },
  ];
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const validTab = sidebarTabs.find((tab) => tab.name === page);
      if (page && validTab) {
        setActiveTab(page);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const getTickets = async () => {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
    };
    const getUsers = async () => {
      try {
        const fetchedUsers = await UserService.fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    getUsers();
    getTickets();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTicketActive = async (ticketId: string) => {
    const url = `http://localhost:5296/api/ticket/update/${ticketId}`;

    try {
      const response = await fetch(url, {
        method: "PUT", // or PATCH based on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: null,
          cost: null,
          location: null,
          status: 1, // Setting the status back to 1 (Active)
          image: null,
          qrcode: null,
          description: null,
          createDate: null,
          categories: [], // Sending an empty array or null if no update to categories
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Ticket status update response:", result);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, status: 1 } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleTicketDelete = async (ticketId: string) => {
    const url = `http://localhost:5296/api/ticket/update/${ticketId}`;

    try {
      const response = await fetch(url, {
        method: "PUT", // or PATCH based on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: null,
          cost: null,
          location: null,
          status: 0, // Updating only the status to 0
          image: null,
          qrcode: null,
          description: null,
          createDate: null,
          categories: [], // Sending an empty array or null if no update to categories
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Ticket status update response:", result);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, status: 0 } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleUserEdit = async (userId: string) => {};
  const handleUserDelete = async (userId: string) => {};

  const handleNavigation = (tabName: string) => {
    console.log("Navigate to:", tabName);
    router.push(`/admin?page=${tabName}`, undefined, { shallow: true });
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Tickets":
        return (
          <TicketManager
            tickets={tickets}
            onActive={handleTicketActive}
            onDelete={handleTicketDelete}
          />
        );
      case "Users":
        return (
          <UserManager
            users={users}
            onEdit={handleUserEdit}
            onDelete={handleUserDelete}
          />
        );
      default:
        return <div>{activeTab} content goes here</div>;
    }
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
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

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              TicketResell Admin
            </h2>
            <button
              onClick={closeSidebar}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white sm:hidden"
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
          <ul className="space-y-2 font-medium">
            {sidebarTabs.map((tab, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(tab.name)}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left ${
                    activeTab === tab.name ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {tab.icon}
                  </span>
                  <span className="ms-3">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
        {renderContent()}
      </div>
    </>
  );
};

export default AdminPage;
