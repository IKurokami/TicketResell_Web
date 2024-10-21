import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie for cookie management
import "@/Css/Transaction.css";
import DateRange from "@/Hooks/DateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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

  const hours = String(date.getHours()).padStart(2, "0"); // Get hours and pad
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad

  return `${day}/${month}/${year}, ${hours}:${minutes}`; // Return formatted date and time
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
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

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
        `http://localhost:5296/api/Transaction/buyers/${id}`,{
          credentials: "include",
        }
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

  const fetchTransactionbyDate = async () => {
    const id = Cookies.get("id"); // Replace 'id' with the actual cookie name
    if (!id) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    // Prepare the body for the API request with date range
    const body = {
      StartDate: dateRange[0]?.toISOString() || "", // Convert to ISO string or empty if null
      EndDate: dateRange[1]?.toISOString() || "",   // Convert to ISO string or empty if null
    };

    try {
      const response = await fetch(
        `http://localhost:5296/api/Transaction/orderdetails/${id}`, {
          method: "POST", // Change to POST as we're sending data
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body), // Send date range in the body
        }
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

  const handleDateChange = (newRange: [Date | null, Date | null]) => {
    setDateRange(newRange); // Update the date range state
  };

  useEffect(()=>{
    if (dateRange[0] && dateRange[1]) { // Check if both dates are selected
      fetchTransactionbyDate(dateRange[0], dateRange[1]); // Fetch transactions with the selected date range
    }
  },[dateRange])

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

  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto p-10 ">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex items-center bg-white rounded-full h-[7vh]  p-1 px-3 border border-gray-300 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search ticket"
            className="border-none outline-none p-1 bg-transparent w-full"
            value={searchTerm} // Bind the input to the searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
          />
          <FontAwesomeIcon
            className="text-lg p-1 cursor-pointer"
            icon={faMagnifyingGlass}
          />
        </div>

        <div>
        <DateRange  onDateChange={handleDateChange}/>
        </div>
       
      </div>

      {/* Render filtered transactions */}
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
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center border border-gray-300 px-4 py-2">
                No matching transactions found.
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction, index) => (
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
                <td className="border border-gray-300 px-4 py-2">
                  {formatVND(transaction.price * transaction.quantity)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
