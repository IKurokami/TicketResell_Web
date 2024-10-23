import React, { useState, useEffect } from "react";
import { Card } from "@/Components/ui/card";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";
import { Calendar, BarChart3, Check, LockIcon, TrendingUp } from "lucide-react";
import Cookies from "js-cookie";
import ProductSalesDashboard from "./BuyerSellDashboard";

interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

const RevenueCard = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const today = new Date();
  
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

  const calculatePercentageChangeTodayYesterday = (revenueData: RevenueItem[]): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  

    const todayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === today.getFullYear() &&
               itemDate.getMonth() === today.getMonth() &&
               itemDate.getDate() === today.getDate();
      })
      .reduce((total, item) => total + item.revenue1, 0);
  

    const yesterdayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === yesterday.getFullYear() &&
               itemDate.getMonth() === yesterday.getMonth() &&
               itemDate.getDate() === yesterday.getDate();
      })
      .reduce((total, item) => total + item.revenue1, 0);
  
    // Calculate percentage change
    if (yesterdayRevenue === 0) {
      return todayRevenue > 0 ? "100.00" : "0.00"; 
    }
  
    const percentageChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    return percentageChange.toFixed(2); 
  };
  


  const calculateDayRevenue = (selectedDate: Date, revenueData: RevenueItem[]): number => {
    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };

  const calculateMonthRevenue = (selectedMonth: number, selectedYear: number, revenueData: RevenueItem[]): number => {
    const today = new Date();
    const currentMonth = today.getMonth(); // Get current month (0-indexed)
    const currentYear = today.getFullYear();
  
    // If the selected month is not the current month, sum the revenues for the current month
    const monthToFilter = selectedMonth === currentMonth && selectedYear === currentYear ? currentMonth : selectedMonth;
  
    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === selectedYear && itemDate.getMonth() === monthToFilter
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };
  

  const calculateYearRevenue = (selectedYear: number, revenueData: RevenueItem[]): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
  
    // If the selected year is not the current year, sum the revenues for all months in the current year
    const yearToFilter = selectedYear === currentYear ? currentYear : selectedYear;
  
    // Filter and sum all the revenues for the selected year
    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === yearToFilter;
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };
  


  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} đ`;
  };

  return (
    <div className="p-5">
    <div className="flex p-4">
      {/* Total Sales Block */}

      {/* Existing Revenue Chart Card */}
      <Card className="w-full p-6 bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-4xl font-bold text-slate-900">
                {formatCurrency(
                  revenueData.length ? revenueData[0].revenue1 : 0
                )}
              </h2>
              <span className="text-sm font-medium text-green-500">
                +{calculatePercentageChangeTodayYesterday(revenueData)}%
              </span>
            </div>
            <p className="text-sm text-slate-500">Total Spent</p>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <Check size={16} />
              <span>On track</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-slate-50 text-sm rounded-lg px-4 py-2 pr-8 text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[
                  { label: "This day", value: "day" },
                  { label: "This month", value: "month" },
                  { label: "This year", value: "year" },
                ].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData.map((item) => ({
                name: item.startDate.split("T")[0],
                value1: item.revenue1,
              }))}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <Line
                type="monotone"
                dataKey="value1"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="flex flex-col gap-4 p-3 ">
        <div className="flex justify-between p-1 gap-2">
          <Card className="  p-6 bg-white rounded-xl shadow-sm ">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  Total Day
                  <LockIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-bold truncate text-slate-900">
                {formatCurrency(calculateDayRevenue(today, revenueData))}
                </div>
                <div className="flex items-center gap-1 truncate text-emerald-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{calculatePercentageChangeTodayYesterday(revenueData)}%</span>
                  <span className="text-slate-500 font-normal">{today.getDate()}/{today.getMonth()+1}</span>
                </div>
              </div>
             
            </div>
          </Card>
          <Card className="  p-6  bg-white rounded-xl shadow-sm ">
            <div className="flex justify-between  items-start mb-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  Total Month
                  <LockIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl truncate font-bold text-slate-900">
                  {formatCurrency(calculateMonthRevenue(today.getMonth(), today.getFullYear(), revenueData))}
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{calculatePercentageChangeTodayYesterday(revenueData)}%</span>
                  <span className="text-slate-500 font-normal">From {today.getMonth()+1}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card className="  p-6 bg-white flex  items-center rounded-xl shadow-sm ">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  Total Year
                  <LockIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(calculateYearRevenue(today.getFullYear(), revenueData))}
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{calculatePercentageChangeTodayYesterday(revenueData)}%</span>
                  <span className="text-slate-500 font-normal">From {today.getFullYear()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <div>
      <ProductSalesDashboard/>
    </div>
    </div>

  );
};

export default RevenueCard;
