import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProductSalesDashboard from "./BuyerSellDashboard";
import RevenueManager from "./RevenueManager";

interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

const RevenueCard = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);

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
      }
    }
  };

  
  useEffect(() => {
    fetchRevenueBySellerId();
  }, []);

  return (
    <div className="p-5">
      <RevenueManager revenueData={revenueData} />
      <div>
        <ProductSalesDashboard  />
      </div>
    </div>
  );
};

export default RevenueCard;
