import React, { useState, useRef, useEffect } from "react";
import { getCategoryNames, Ticket } from "@/models/TicketFetch";
import { FaTrash, FaEdit, FaSearch, FaCheck } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAmountDown,
  faSortAmountUp,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface TicketListProps {
  tickets: Ticket[];
  onActive: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
}

const TicketManager: React.FC<TicketListProps> = ({
  tickets,
  onActive,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Sort By");
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value to change items per page
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    { text: "Price low to high", icon: faSortAmountUp },
    { text: "Price high to low", icon: faSortAmountDown },
    { text: "Recently listed", icon: faClock },
  ];

  const handleSortOptionClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const sortTickets = (tickets: Ticket[]) => {
    const sortedTickets = [...tickets]; // Create a shallow copy to avoid mutation
    switch (sortOption) {
      case "Price low to high":
        return sortedTickets.sort((a, b) => a.cost - b.cost);
      case "Price high to low":
        return sortedTickets.sort((a, b) => b.cost - a.cost);
      case "Recently listed":
        return sortedTickets.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      default:
        return sortedTickets;
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Search Filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchLower) ||
          getCategoryNames(ticket).toLowerCase().includes(searchLower) ||
          ticket.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTickets(sortTickets(filtered));
    setCurrentPage(1); // Reset to first page on new search/sort
  };

  useEffect(() => {
    filterTickets();
  }, [searchTerm, tickets, sortOption]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedTickets = filteredTickets.slice(
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-24">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Center: Search input */}
          <div className="relative flex-grow mx-2 w-full mb-4">
            <input
              type="text"
              placeholder="Search by name"
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

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Categories
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((ticket) => (
              <tr
                key={ticket.ticketId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {truncateText(ticket.name, 20)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {getCategoryNames(ticket)
                      .split(",")
                      .filter((category) => category.trim() !== "")
                      .slice(0, 3)
                      .map((category) => (
                        <span
                          key={category}
                          className="bg-emerald-400 text-white rounded-full px-2 py-1 text-xs"
                        >
                          {category.trim()}
                        </span>
                      ))}
                    {getCategoryNames(ticket).trim() === "" && (
                      <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                        No categories
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {truncateText(ticket.location, 20)}
                </td>
                <td className="px-6 py-4">{formatVND(ticket.cost)}</td>
                <td className="px-6 py-4">{formatDate(ticket.startDate)}</td>
                <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                <td className="px-6 py-4 text-right">
                  {ticket.status === 1 ? (
                    <button
                      onClick={() => onDelete(ticket.ticketId)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      onClick={() => onActive(ticket.ticketId)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit Inactive Ticket"
                    >
                      <FaCheck />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default TicketManager;
