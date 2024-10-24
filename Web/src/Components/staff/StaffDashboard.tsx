import React from "react";
import { Users, FolderTree } from "lucide-react"; // Icons for the tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"; // Assuming these are your tab components
import UserManagement from "@/Components/staff/UsersManagement"; // Import the User Management component
import CategoryManagement from "@/Components/staff/CategoriesManagement"; // Import the Category Management component

const StaffDashboard = () => {
  return (
    <div className="bg-white mx-auto mt-20">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-700">
            Staff Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and categories through the tabs below.
          </p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="users" className="px-6 py-4">
          <TabsList className="flex space-x-2">
            <TabsTrigger
              value="users"
              className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <Users className="w-5 h-5 mr-2" />
              User Management
            </TabsTrigger>

            <TabsTrigger
              value="categories"
              className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <FolderTree className="w-5 h-5 mr-2" />
              Category Management
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="users" className="mt-6">
            {/* User Management Content */}
            <UserManagement />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            {/* Category Management Content */}
            <CategoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;
