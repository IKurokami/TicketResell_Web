import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import OrderDetailsDashboard from "./BuyerSellDashboard"; // Ensure this is the correct path
import RevenueManager from "./RevenueManager";

interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

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

interface TopBuyer {
  buyerId:string;
  username: string;
  total: number;
}
const RevenueCard = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]); // State to hold top buyers

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
      console.log(result.data);

      setTransactions(result.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setTransactions([]);
    }
  };

  const fetchRevenueBySellerId = async () => {
    const sellerId = Cookies.get("id");
    if (sellerId) {
      try {
        const response = await fetch(
          `http://localhost:5296/api/Revenue/readbysellerid/${sellerId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setRevenueData(result.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueData([]);
      }
    }
  };

  useEffect(() => {
    fetchRevenueBySellerId();
    fetchTransactions(); // Call fetchTransactions here
  }, []);

  useEffect(() => {
    // Calculate top buyers once transactions are fetched
    if (transactions.length > 0) {
      calculateTopBuyers(transactions);
    }
  }, [transactions]);

  const calculateTopBuyers = (transactions: Transaction[]) => {
    const buyerTotals: { [key: string]: number } = {};
    const buyerUsernames: { [key: string]: string } = {}; // Store usernames
  
    transactions.forEach(transaction => {
      const buyerId = transaction.order.user.userId; // Get buyer ID
      const total = transaction.price * transaction.quantity;
  
      // Sum the total price for each buyer
      if (buyerTotals[buyerId]) {
        buyerTotals[buyerId] += total;
      } else {
        buyerTotals[buyerId] = total;
      }
  
      // Store username if not already present
      if (!buyerUsernames[buyerId]) {
        buyerUsernames[buyerId] = transaction.order.user.username; // Get username
      }
    });
  
    // Convert to an array and sort by total revenue
    const sortedBuyers = Object.entries(buyerTotals)
      .map(([buyerId, total]) => ({
        buyerId,
        total,
        username: buyerUsernames[buyerId], // Include username
      }))
      .sort((a, b) => b.total - a.total) // Sort descending
      .slice(0, 3); // Get top 3
  console.log(sortedBuyers);
  
    setTopBuyers(sortedBuyers); // Set state with top buyers
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <RevenueManager revenueData={revenueData} />
      <div>
        <OrderDetailsDashboard topBuyers={topBuyers} transactions={transactions} /> {/* Pass transactions to your dashboard if needed */}
      </div>
      {/* Display top buyers */}
    </div>
  );
};

export default RevenueCard;
