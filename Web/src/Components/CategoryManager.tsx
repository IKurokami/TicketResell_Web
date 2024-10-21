import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaSort } from "react-icons/fa";

interface Category {
  categoryId: string;
  name: string;
  description: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onAdd: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortField, setSortField] = useState<"name" | "description">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const filterCategories = () => {
      if (!Array.isArray(categories)) {
        console.error("categories is not an array:", categories);
        setFilteredCategories([]);
        return;
      }

      let filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort the filtered results
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortField].toLowerCase();
        const bValue = b[sortField].toLowerCase();
        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });

      setFilteredCategories(filtered);
    };

    filterCategories();
  }, [searchTerm, categories, sortField, sortDirection]);

  const handleSort = (field: "name" | "description") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="relative flex-grow mx-2 w-full mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search by category name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center h-12 px-6 bg-blue-500 text-white text-nowrap shadow-sm font-semibold rounded-xl hover:bg-blue-600 transition duration-200"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <FaSort className="w-3 h-3 ms-1.5" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  Description
                  <FaSort className="w-3 h-3 ms-1.5" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.name}
                  </th>
                  <td className="px-6 py-4">
                    {truncateText(category.description, 100)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(category.categoryId)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(category.categoryId)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
