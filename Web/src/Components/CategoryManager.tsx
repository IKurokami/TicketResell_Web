import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus } from "react-icons/fa";

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

  useEffect(() => {
    const filterCategories = () => {
      if (!Array.isArray(categories)) {
        console.error("categories is not an array:", categories);
        setFilteredCategories([]);
        return;
      }
      console.log("category", categories);

      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    };

    filterCategories();
  }, [searchTerm, categories]);

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
              placeholder="Search by category name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Add Category Button */}
          <button
            onClick={onAdd}
            className="flex items-center h-12 px-6 bg-transparent-500 text-black text-nowrap shadow-sm font-semibold rounded-xl hover:bg-transparent-600 transition duration-200"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.categoryId}
              className="relative border border-gray-200 rounded-lg shadow-md p-4"
            >
              {/* Category Information */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{category.name}</h2>
                <div className="flex space-x-2">
                  {/* Edit and Delete Buttons */}
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
              </div>
              <p className="text-sm text-gray-600">
                {truncateText(category.description, 100)}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
