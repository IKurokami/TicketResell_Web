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

const RevenueCard = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sellerId = Cookies.get("id");

  const fetchTransactions = async () => {
    if (!sellerId) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5296/api/Transaction/buyers/${sellerId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const result = await response.json();
      setTransactions(result.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
      
    }
  };

  const fetchRevenueBySellerId = async () => {
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
    fetchTransactions();
  }, []);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (
    <div className="p-6">
      <RevenueManager revenueData={revenueData} transactions={transactions} />
      <div>
        <OrderDetailsDashboard
        revenue={revenueData}
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export default RevenueCard;
