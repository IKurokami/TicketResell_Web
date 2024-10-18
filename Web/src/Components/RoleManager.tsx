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

      {/* Role Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <div
              key={role.roleId}
              className="relative border border-gray-200 rounded-lg shadow-md p-4"
            >
              {/* Role Information */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{role.rolename}</h2>
                <div className="flex space-x-2">
                  {/* Edit and Delete Buttons */}
                  <button
                    onClick={() => onEdit(role.roleId)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Role"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(role.roleId)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Role"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {truncateText(role.description, 100)}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No roles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManager;
