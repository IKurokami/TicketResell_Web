import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie for cookie management
import "@/Css/Transaction.css";
// import { DateRangePicker } from "@nextui-org/date-picker";
// Define the transaction interface for better type safety

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

function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Using custom formatting
  const day = String(date.getDate()).padStart(2, "0"); // Pad day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
  const year = date.getFullYear();

  return `${day}/${month}/${year}`; // Return formatted date
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
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

  // Function to fetch transactions
  const fetchTransactions = async () => {
    const id = Cookies.get("id"); // Replace 'id' with the actual cookie name
    if (!id) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5296/api/Transaction/buyers/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const result = await response.json();
      console.log("transaction", result);

      setTransactions(result.data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching transactions:", error); // Log error to console
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>; // Consider replacing this with a loading spinner
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions available.</div>; // Handle empty state
  }

  return (
    <div className="overflow-x-auto p-10 ">
      {/* <DateRangePicker label="Stay duration" className="max-w-xs" /> */}
      {/* <h1 className="text-3xl font-bold" >Transaction</h1> */}
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Ticket
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Quantity
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              From
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(transaction.order.date)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {truncateText(transaction.ticket.name, 20)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {transaction.quantity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {transaction.order.user.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatVND(transaction.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
