import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "@/Css/Transaction.css";
import DateRange from "@/Hooks/DateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface Order {
  orderId: string;
  date: string;
  user: User;
}

interface User {
  userId: string;
  username: string;
}

interface Ticket {
  ticketId: string;
  name: string;
}

interface Transaction {
  date: string;
  quantity: number;
  price: number;
  order: Order;
  ticket: Ticket;
}

const toISODate = ({ year, month, day }) => {
  const date = new Date(year, month - 1, day);
  return date.toISOString();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ start: any; end: any }>({
    start: null,
    end: null,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTransactions = async () => {
    const id = Cookies.get("id");
    if (!id) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5296/api/Transaction/buyers/${id}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const result = await response.json();
      setTransactions(result.data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newRange: { start: any; end: any }) => {
    setDateRange(newRange);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading transactions...</div>;
  }

  if (error) {
    return (
      <tr>
        <td colSpan={6} className="px-4 lg:px-6 py-4 text-center text-gray-500">
          No transactions available.
        </td>
      </tr>
    );
  }

  const startDate = dateRange.start ? toISODate(dateRange.start) : null;
  const endDate = dateRange.end ? toISODate(dateRange.end) : null;

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.order.date).toISOString();

    let adjustedEndDate = endDate;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      adjustedEndDate = endOfDay.toISOString();
    }

    const withinDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!adjustedEndDate || transactionDate <= adjustedEndDate);

    const matchesSearchTerm = transaction.ticket.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return withinDateRange && matchesSearchTerm;
  });

  const MobileCard = ({ transaction }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {formatDate(transaction.order.date)}
        </span>
        <span className="text-sm font-medium text-green-700">
          {formatVND(transaction.price * transaction.quantity)}
        </span>
      </div>
      <div className="mb-2">
        <h3 className="font-medium text-gray-900">
          {truncateText(transaction.ticket.name, 30)}
        </h3>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
            {transaction.quantity} tickets
          </span>
        </div>
        <div>From: {transaction.order.user.username}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-10 py-10 max-w-screen-xl">
      <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="relative flex items-center bg-white rounded-full h-12 p-1 px-3 border border-gray-300 w-3/5 lg:w-64">
          <input
            type="text"
            placeholder="Search ticket"
            className="border-none outline-none p-1 bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            className="text-lg p-1 cursor-pointer"
            icon={faMagnifyingGlass}
          />
        </div>

        <div className="">
          <DateRange onDateChange={handleDateChange} />
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No transactions available.
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <MobileCard key={index} transaction={transaction} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {["DATE", "TICKET", "PRICE", "QUANTITY", "TOTAL", "FROM"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 lg:px-6 py-3 lg:py-4 text-black text-sm font-semibold tracking-wider text-center"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 lg:px-6 py-4 text-center text-gray-500"
                    >
                      No transactions available.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        {formatDate(transaction.order.date)}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-left text-gray-900">
                        <div className="font-medium max-w-xs">
                          {truncateText(transaction.ticket.name, 20)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        {formatVND(transaction.price)}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">
                          {transaction.quantity}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium text-center text-green-700">
                        {formatVND(transaction.price * transaction.quantity)}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        {transaction.order.user.username}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
