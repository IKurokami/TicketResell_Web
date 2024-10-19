import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAmountDown,
  faSortAmountUp,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface OrderDetail {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  buyerId: string;
  status: number;
  orderDetails: OrderDetail[];
}

interface OrderManagerProps {
  orders: Order[];
  onComplete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  onComplete,
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Sort By");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    { text: "Total low to high", icon: faSortAmountUp },
    { text: "Total high to low", icon: faSortAmountDown },
    { text: "Recently ordered", icon: faClock },
  ];

  const handleSortOptionClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const getOrderTotal = (order: Order): number => {
    return order.orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const sortOrders = (orders: Order[]) => {
    const sortedOrders = [...orders];
    switch (sortOption) {
      case "Total low to high":
        return sortedOrders.sort((a, b) => getOrderTotal(a) - getOrderTotal(b));
      case "Total high to low":
        return sortedOrders.sort((a, b) => getOrderTotal(b) - getOrderTotal(a));
      case "Recently ordered":
        return sortedOrders.sort((a, b) => b.orderId.localeCompare(a.orderId)); // Assuming orderId is chronological
      default:
        return sortedOrders;
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.buyerId.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOrders(sortOrders(filtered));
    setCurrentPage(1);
  };

  useEffect(() => {
    filterOrders();
  }, [searchTerm, orders, sortOption]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedOrders = filteredOrders.slice(
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
          <span className="bg-green-200 text-green-900 py-1 px-2 text-xs font-bold rounded">
            Completed
          </span>
        );
      case 1:
        return (
          <span className="bg-yellow-200 text-yellow-900 py-1 px-2 text-xs font-bold rounded">
            Pending
          </span>
        );
      case 2:
        return (
          <span className="bg-blue-200 text-blue-900 py-1 px-2 text-xs font-bold rounded">
            Refund
          </span>
        );
      case 3:
        return (
          <span className="bg-red-200 text-red-900 py-1 px-2 text-xs font-bold rounded">
            Cancel
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
  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 1: // Pending
        return (
          <>
            <button
              onClick={() => onCancel(order.orderId)}
              className="text-red-500 hover:text-red-700 mr-2"
              title="Cancel Order"
            >
              <FaTimes />
            </button>
            <button
              onClick={() => onComplete(order.orderId)}
              className="text-green-500 hover:text-green-700"
              title="Complete Order"
            >
              <FaCheck />
            </button>
          </>
        );
      case 0: // Completed
        return (
          <button
            onClick={() => onCancel(order.orderId)}
            className="text-red-500 hover:text-red-700"
            title="Cancel Order"
          >
            <FaTimes />
          </button>
        );
      case 3: // Canceled
        return (
          <button
            onClick={() => onComplete(order.orderId)}
            className="text-green-500 hover:text-green-700"
            title="Complete Order"
          >
            <FaCheck />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Search input */}
          <div className="relative flex-grow mx-2 w-full mb-4">
            <input
              type="text"
              placeholder="Search by order ID or buyer ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Sort dropdown */}
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

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {paginatedOrders.map((order) => (
          <div
            key={order.orderId}
            className="relative border border-gray-200 rounded-lg shadow-md overflow-hidden min-w-[250px]"
          >
            {/* Action buttons */}
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {renderActionButtons(order)}
            </div>

            {/* Order Information */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Order: {order.orderId}</h2>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xl font-bold mb-2">
                {formatVND(getOrderTotal(order))}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Buyer ID: {order.buyerId}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Items: {order.orderDetails.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {order.orderDetails.slice(0, 3).map((detail) => (
                  <span
                    key={detail.orderDetailId}
                    className="bg-emerald-400 text-white rounded-full px-2 py-1 text-xs"
                  >
                    {detail.ticketId}
                  </span>
                ))}
                {order.orderDetails.length > 3 && (
                  <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                    +{order.orderDetails.length - 3} more
                  </span>
                )}
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

export default OrderManager;
