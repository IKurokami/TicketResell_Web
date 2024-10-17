import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAmountDown,
  faSortAmountUp,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "@/models/UserManagement";

interface UserManagerProps {
  users: User[];
  onDelete: (userId: string) => void;
  onEdit: (userId: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  onDelete,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Sort By");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    { text: "Name A to Z", icon: faSortAmountUp },
    { text: "Name Z to A", icon: faSortAmountDown },
    { text: "Recently joined", icon: faClock },
  ];

  const handleSortOptionClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const sortUsers = (users: User[]) => {
    const sortedUsers = [...users];
    switch (sortOption) {
      case "Name A to Z":
        return sortedUsers.sort((a, b) => a.fullname.localeCompare(b.fullname));
      case "Name Z to A":
        return sortedUsers.sort((a, b) => b.fullname.localeCompare(a.fullname));
      case "Recently joined":
        return sortedUsers.sort(
          (a, b) =>
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
      default:
        return sortedUsers;
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullname.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.gmail.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(sortUsers(filtered));
    setCurrentPage(1);
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users, sortOption]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="bg-gray-200 text-gray-900 py-1 px-2 text-xs font-bold rounded">
            Inactive
          </span>
        );
      case 1:
        return (
          <span className="bg-green-200 text-green-900 py-1 px-2 text-xs font-bold rounded">
            Active
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-900 py-1 px-2 text-xs font-bold rounded">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Center: Search input */}
          <div className="relative flex-grow mx-2 w-full mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Right: Sort dropdown */}
          <div className="flex items-center space-x-4 w-auto mb-4">
            <div className="relative mr-3 w-full md:w-64" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-12 w-full pl-4 pr-10 rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:outline-none flex items-center justify-between transition duration-200"
              >
                <span className="truncate">{sortOption}</span>
                <MdKeyboardArrowDown className="text-2xl text-gray-600" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
                  <ul className="py-1">
                    {sortOptions.map((option) => (
                      <li key={option.text}>
                        <button
                          onClick={() => handleSortOptionClick(option.text)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none transition duration-200 flex items-center"
                        >
                          <FontAwesomeIcon
                            icon={option.icon}
                            className="mr-2"
                          />
                          {option.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8 justify-items-center">
        {paginatedUsers.map((user) => (
          <div
            key={user.userId}
            className="relative bg-emerald-500 rounded-lg w-full max-w-sm shadow-lg group overflow-hidden"
          >
            <svg
              className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
              viewBox="0 0 375 283"
              fill="none"
              style={{ opacity: 0.1 }}
            >
              <rect
                x="159.52"
                y="175"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 159.52 175)"
                fill="white"
              />
              <rect
                y="107.48"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 0 107.48)"
                fill="white"
              />
            </svg>
            <div className="pt-12 px-12 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="block absolute w-full h-56 bottom-0 left-0 -mb-24 ml-3"
                style={{
                  background: "radial-gradient(black, transparent 60%)",
                  transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                  opacity: 0.2,
                }}
              ></div>
              <img
                src={
                  user.avatar ||
                  "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                }
                alt={user.fullname}
                className="relative w-48 h-48 rounded-full object-cover"
              />
            </div>
            <div className="relative text-white px-8 pb-8 mt-8">
              <div className="flex justify-between items-start">
                <div className="w-3/4">
                  <h2
                    className="block font-semibold text-xl mb-1 truncate"
                    title={user.fullname || user.username}
                  >
                    {truncateText(user.fullname || user.username, 20)}
                  </h2>
                  <p className="text-sm truncate" title={user.gmail}>
                    {truncateText(user.gmail, 25)}
                  </p>
                </div>
                {getStatusBadge(user.status)}
              </div>
              <p className="text-sm mt-2">{user.phone || "No phone"}</p>
              <p className="text-sm mt-1">
                Joined: {formatDate(user.createDate)}
              </p>
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => onEdit(user.userId)}
                  className="text-white hover:text-blue-200 transition-colors duration-200"
                  title="Edit"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => onDelete(user.userId)}
                  className="text-white hover:text-red-200 transition-colors duration-200"
                  title="Delete"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManager;
