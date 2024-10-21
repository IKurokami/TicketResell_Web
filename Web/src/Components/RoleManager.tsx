import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus } from "react-icons/fa";
import { Role } from "@/models/UserManagement";

interface RoleListProps {
  roles: Role[];
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onAdd: () => void;
}

const RoleManager: React.FC<RoleListProps> = ({
  roles,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

  useEffect(() => {
    const filterRoles = () => {
      if (!Array.isArray(roles)) {
        console.error("roles is not an array:", roles);
        setFilteredRoles([]);
        return;
      }

      const filtered = roles.filter(
        (role) =>
          role.rolename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    };

    filterRoles();
  }, [searchTerm, roles]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Search Input */}
          <div className="relative flex-grow mx-2 w-full mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search by role name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Add Role Button */}
          <button
            onClick={onAdd}
            className="flex items-center h-12 px-6 bg-transparent-500 text-black text-nowrap shadow-sm font-semibold rounded-xl hover:bg-transparent-600 transition duration-200"
          >
            <FaPlus className="mr-2" /> Add Role
          </button>
        </div>
      </div>

      {/* Role Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Role Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr
                  key={role.roleId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {role.rolename}
                  </th>
                  <td className="px-6 py-4">
                    {truncateText(role.description, 100)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onEdit(role.roleId)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(role.roleId)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManager;
