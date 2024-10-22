"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchTickets } from "@/models/TicketFetch";
import { UserService, User } from "@/models/UserManagement";
import {
  Person as UsersIcon,
  Group as RolesIcon,
  TravelExplore as TicketsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
  ShoppingBasket,
} from "@mui/icons-material";
import UserManager from "./UserManager";
import RoleManager from "./RoleManager";
import TicketManager from "./TicketManager";
import CategoryManager from "./CategoryManager";
import OrderManager from "./OrderManager";

const AdminPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
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
    { name: "Transaction", icon: <ShoppingBasket /> },
  ];

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [isRoleDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isCategoryDeleteConfirmOpen, setIsCategoryDeleteConfirmOpen] =
    useState(false);

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

    const getRoles = async () => {
      try {
        const response = await fetch("http://localhost:5296/api/Role/read", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        setRoles(data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const getCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5296/api/Category/read",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getOrders = async () => {
      try {
        const response = await fetch("http://localhost:5296/api/Order/read", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getUsers();
    getTickets();
    getRoles();
    getCategories();
    getOrders();
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

  const handleRoleAdd = async () => {
    setCurrentRole(null);
    setIsRoleModalOpen(true);
  };

  const handleRoleEdit = async (roleId: string) => {
    const roleToEdit = roles.find((role) => role.roleId === roleId);
    setCurrentRole(roleToEdit);
    setIsRoleModalOpen(true);
  };

  const handleRoleDelete = async (roleId: string) => {
    setCurrentRole(roles.find((role) => role.roleId === roleId));
    setIsDeleteConfirmOpen(true);
  };

  const handleRoleSubmit = async (roleData: any) => {
    try {
      let response;
      if (currentRole) {
        // Edit existing role
        response = await fetch(
          `http://localhost:5296/api/Role/update/${roleData.roleId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roleData),
            credentials: "include",
          }
        );
      } else {
        // Add new role
        response = await fetch("http://localhost:5296/api/Role/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roleData),
          credentials: "include",
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit role");
      }

      const result = await response.json();
      console.log(result.message);

      // Update the roles state
      if (currentRole) {
        setRoles(
          roles.map((role) =>
            role.roleId === roleData.roleId ? result.data : role
          )
        );
      } else {
        setRoles([...roles, result.data]);
      }

      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("Error submitting role:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (currentRole) {
        const response = await fetch(
          `http://localhost:5296/api/Role/delete/${currentRole.roleId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete role");
        }

        const result = await response.json();
        console.log(result.message);

        // Remove the deleted role from the state
        setRoles(roles.filter((role) => role.roleId !== currentRole.roleId));

        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleCategoryAdd = async () => {
    setCurrentCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryEdit = async (categoryId: string) => {
    const categoryToEdit = categories.find(
      (category) => category.categoryId === categoryId
    );
    setCurrentCategory(categoryToEdit);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryDelete = async (categoryId: string) => {
    setCurrentCategory(
      categories.find((category) => category.categoryId === categoryId)
    );
    setIsCategoryDeleteConfirmOpen(true);
  };

  const handleCategorySubmit = async (categoryData: any) => {
    try {
      let response;
      if (currentCategory) {
        response = await fetch(
          `http://localhost:5296/api/Category/update/${categoryData.categoryId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
            credentials: "include",
          }
        );
      } else {
        // Add new category
        response = await fetch("http://localhost:5296/api/Category/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
          credentials: "include",
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit category");
      }

      const result = await response.json();
      console.log(result.message);

      // Update the categories state
      if (currentCategory) {
        setCategories(
          categories.map((category) =>
            category.categoryId === categoryData.categoryId
              ? { ...category, ...categoryData }
              : category
          )
        );
      } else {
        setCategories([...categories, categoryData]);
      }

      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  const handleConfirmCategoryDelete = async () => {
    try {
      if (currentCategory) {
        const response = await fetch(
          `http://localhost:5296/api/Category/delete/${currentCategory.categoryId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        const result = await response.json();
        console.log(result.message);

        // Remove the deleted category from the state
        setCategories(
          categories.filter(
            (category) => category.categoryId !== currentCategory.categoryId
          )
        );

        setIsCategoryDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleOrderRefresh = async (orderID: string) => {};

  const handleNavigation = (tabName: string) => {
    console.log("Navigate to:", tabName);
    router.push(`/admin?page=${tabName}`, undefined);
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
      case "Roles":
        return (
          <RoleManager
            roles={roles}
            onEdit={handleRoleEdit}
            onDelete={handleRoleDelete}
            onAdd={handleRoleAdd}
          />
        );
      case "Categories":
        return (
          <CategoryManager
            categories={categories}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onAdd={handleCategoryAdd}
          />
        );
      case "Orders":
        return <OrderManager orders={orders} onRefresh={handleOrderRefresh} />;
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
            <h2 className="text-xl font-semibold text-border">
              <span className="text-emerald-500 text-2xl font-bold">
                Ticket{" "}
              </span>
              <span className="resell text-black text-2xl font-bold">
                Resell{" "}
              </span>
              Admin
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

      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-end justify-center sm:items-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                {currentRole ? "Edit Role" : "Add New Role"}
              </h3>
              <button
                type="submit"
                form="roleForm" // Link the button with the form submission
                className="text-blue-500 font-semibold"
              >
                {currentRole ? "Update" : "Add"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <form
                id="roleForm" // Add an ID to associate the submit button
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const roleData = {
                    roleId: formData.get("roleId"),
                    rolename: formData.get("rolename"),
                    description: formData.get("description"),
                  };
                  handleRoleSubmit(roleData);
                }}
              >
                <input
                  type="text"
                  name="roleId"
                  placeholder="Role ID"
                  defaultValue={currentRole?.roleId || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
                <input
                  type="text"
                  name="rolename"
                  placeholder="Role Name"
                  defaultValue={currentRole?.rolename || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  defaultValue={currentRole?.description || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {isRoleDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-end justify-center sm:items-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={handleConfirmDelete}
                className="text-red-500 font-semibold"
              >
                Delete
              </button>
            </div>
            <div className="p-4">
              <p>Are you sure you want to delete this role?</p>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-end justify-center sm:items-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                {currentCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="submit"
                form="categoryForm"
                className="text-blue-500 font-semibold"
              >
                {currentCategory ? "Update" : "Add"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <form
                id="categoryForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const categoryData = {
                    categoryId: formData.get("categoryId"),
                    name: formData.get("name"),
                    description: formData.get("description"),
                  };
                  handleCategorySubmit(categoryData);
                }}
              >
                <input
                  type="text"
                  name="categoryId"
                  placeholder="Category ID"
                  defaultValue={currentCategory?.categoryId || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  defaultValue={currentCategory?.name || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  defaultValue={currentCategory?.description || ""}
                  className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {isCategoryDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-end justify-center sm:items-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setIsCategoryDeleteConfirmOpen(false)}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={handleConfirmCategoryDelete}
                className="text-red-500 font-semibold"
              >
                Delete
              </button>
            </div>
            <div className="p-4">
              <p>Are you sure you want to delete this category?</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
