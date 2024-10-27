import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
import Cookies from "js-cookie";
import {
  CalendarDays,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

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

interface Orders {
  orderId: string;
  buyerId: string;
  total: number;
}

interface TopBuyer {
  userId: string;
  username: string;
  orders: Orders[];
}

interface OrderDetailsDashboardProps {
  transactions: Transaction[];
  revenue: RevenueItem[];
}

const OrderDetailsDashboard = ({
  transactions,
  revenue
}: OrderDetailsDashboardProps) => {
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} đ`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month index (0-11)
    const day = String(date.getDate()).padStart(2, "0"); // getDate() returns the day (1-31)
    const year = date.getFullYear(); // getFullYear() returns the full year

    return `${day}/${month}/${year}`; // Format as mm/dd/yyyy
  };

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  console.log("Recent Transactions:", recentTransactions);

  const calculateTotalRevenue = (revenueItems: RevenueItem[]): number => {
    return revenueItems.reduce((sum, item) => sum + item.revenue1, 0);
};

  const sumOrderTotals = (orders: Orders[]): number => {
    return orders.reduce((acc, order) => acc + order.total, 0);
  };

  useEffect(() => {
    const fetchTopBuyers = async () => {
      const sellerId = Cookies.get("id");
      try {
        const response = await fetch(
          `http://localhost:5296/api/User/topbuyer/${sellerId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("topbuyr:", result.data);

        setTopBuyers(result.data);
      } catch (error) {
        setTopBuyers([]);
      }
    };

    fetchTopBuyers();
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-slate-50 ">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
        {/* Total Revenue Card */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-blue-100 p-2 md:p-3 rounded-full">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 truncate">
                Total Revenue
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {formatCurrency(calculateTotalRevenue(revenue))}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Orders Card */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-green-100 p-2 md:p-3 rounded-full">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 truncate">
                Total Transaction
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">
                {transactions.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Buyers Card */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-purple-100 p-2 md:p-3 rounded-full">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 truncate">
                Total Buyers
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">
                {topBuyers.length}
              </p>
            </div>
          </div>
        </Card>

        {/* Average Order Value Card */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-orange-100 p-2 md:p-3 rounded-full">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 truncate">
                Avg. Order Value
              </p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {formatCurrency(calculateTotalRevenue(revenue) / transactions.length)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Recent Transactions */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Recent Transactions
            </h2>
            <span className="text-xs md:text-sm pr-5 text-slate-500">
              Price
            </span>
          </div>

          <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.order.orderId}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 hover:bg-slate-50 rounded-lg transition-colors gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                  <div className="bg-slate-100 p-2 md:p-3 rounded-full shrink-0">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm md:text-base text-slate-900 truncate">
                      {transaction.order.user?.username || "User"}
                    </h3>
                    <div className="flex items-center text-xs md:text-sm text-slate-500 mt-1">
                      <CalendarDays className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="truncate">
                        {formatDate(transaction.order.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto">
                  <p className="font-semibold text-sm md:text-base text-slate-900">
                    {formatCurrency(transaction.price * transaction.quantity)}
                  </p>
                  <p className="text-xs md:text-sm text-slate-500">
                    {transaction.quantity}{" "}
                    {transaction.quantity > 1 ? "items" : "item"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Buyers */}
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Top Buyers
            </h2>
            <span className="text-xs md:text-sm text-slate-500">
              Total Spent
            </span>
          </div>

          <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {topBuyers.map((buyer, index) => (
              <div
                key={buyer.userId}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 hover:bg-slate-50 rounded-lg transition-colors gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0
                  ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-slate-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-slate-300"
                  }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base text-slate-900 truncate">
                      {buyer.username}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-sm md:text-base text-slate-900 w-full sm:w-auto text-left sm:text-right">
                  {formatCurrency(sumOrderTotals(buyer.orders))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsDashboard;
