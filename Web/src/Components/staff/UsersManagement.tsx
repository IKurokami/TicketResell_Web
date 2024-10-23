"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

// Define the User interface
interface User {
  userId: string;
  username: string;
  fullname: string;
  gmail: string;
  phone: string;
  address: string;
  sex: string;
  status: number;
  birthday: string;
  bio: string;
}

// UserManagement component
const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]); // Manage users state
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Current user for edit
  const [formData, setFormData] = useState<Partial<User>>({}); // Form data state

  // Fetch user data from the API when the component mounts
  useEffect(() => {
    fetch("http://localhost:5296/api/User/read")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setUsers(data.data); // Set users from the API response
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Handle form submit for both adding and editing users
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.userId === currentUser.userId ? { ...user, ...formData } : user
        )
      );
    } else {
      // Create new user
      const newUser = {
        ...formData,
        userId: `USER${(users.length + 1).toString().padStart(3, "0")}`,
        status: 1,
      } as User;
      setUsers([...users, newUser]);
    }
    setIsOpen(false);
    setCurrentUser(null);
    setFormData({});
  };

  // Handle user deletion
  const handleDelete = (userId: string) => {
    setUsers(users.filter((user) => user.userId !== userId));
  };

  // Handle editing a user
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData(user);
    setIsOpen(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      (user.fullname &&
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) || // Check if fullname exists
      (user.gmail &&
        user.gmail.toLowerCase().includes(searchTerm.toLowerCase())) // Check if gmail exists
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="px-8 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setCurrentUser(null);
              setFormData({});
              setIsOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.fullname}</td>
                  <td className="py-3 px-4">{user.gmail}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.address}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.userId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {currentUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={formData.fullname || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.gmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gmail: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sex</label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.sex || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Nam">Male</option>
                  <option value="Nữ">Female</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {currentUser ? "Save Changes" : "Add User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
