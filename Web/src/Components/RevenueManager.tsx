import React, { useState } from "react";
import { Card } from "@/Components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Calendar, BarChart3, Check, LockIcon, TrendingUp } from "lucide-react";

interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

interface RevenueManagerProps {
  revenueData: RevenueItem[];
}

const RevenueManager: React.FC<RevenueManagerProps> = ({ revenueData }) => {
  const [timeframe, setTimeframe] = useState("month");
  const today = new Date();

  const calculatePercentageChangeTodayYesterday = (
    revenueData: RevenueItem[]
  ): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === today.getFullYear() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getDate() === today.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    const yesterdayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === yesterday.getFullYear() &&
          itemDate.getMonth() === yesterday.getMonth() &&
          itemDate.getDate() === yesterday.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    if (yesterdayRevenue === 0) {
      return todayRevenue > 0 ? "100.00" : "0.00";
    }

    const percentageChange =
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    return percentageChange.toFixed(2);
  };

  const calculateDayRevenue = (
    selectedDate: Date,
    revenueData: RevenueItem[]
  ): number => {
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

  const calculateMonthRevenue = (
    selectedMonth: number,
    selectedYear: number,
    revenueData: RevenueItem[]
  ): number => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthToFilter =
      selectedMonth === currentMonth && selectedYear === currentYear
        ? currentMonth
        : selectedMonth;

    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() === monthToFilter
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };

  const calculateYearRevenue = (
    selectedYear: number,
    revenueData: RevenueItem[]
  ): number => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const yearToFilter =
      selectedYear === currentYear ? currentYear : selectedYear;

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

  const StatCard = ({
    title,
    value,
    change,
    subtitle,
  }: {
    title: string;
    value: string;
    change: string;
    subtitle: string;
  }) => (
    <Card className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="space-y-1">
        <div className="text-sm text-slate-500 flex items-center gap-2">
          {title}
          <LockIcon className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-3xl font-bold text-slate-900 truncate">
          {value}
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>{change}%</span>
          <span className="text-slate-500 font-normal">{subtitle}</span>
        </div>
      </div>
    </Card>
  );

  // Format date for X-axis
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Generate Y-axis ticks
  const getYAxisTicks = () => {
    const maxRevenue = Math.max(...revenueData.map((item) => item.revenue1));
    const step = Math.ceil(maxRevenue / 4 / 100) * 100;
    return [0, step, step * 2, step * 3, step * 4];
  };

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600">{formatDate(label)}</p>
          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Revenue Chart Card */}
      <Card className="w-full p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold text-slate-900">
                {formatCurrency(
                  revenueData.length ? revenueData[0].revenue1 : 0
                )}
              </h2>
              <span className="px-2 py-1 text-sm font-medium text-green-500 bg-green-50 rounded-full">
                {calculatePercentageChangeTodayYesterday(revenueData)}%
              </span>
            </div>
            <p className="text-sm text-slate-500">Total Revenue</p>
            <div className="flex items-center gap-2 text-sm text-green-500">
              <Check size={16} className="text-green-500" />
              <span>On track</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-slate-50 text-sm rounded-lg px-4 py-2 pr-8 text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-slate-100 transition-colors duration-200"
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

            <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData.map((item) => ({
                name: item.startDate,
                value1: item.revenue1,
              }))}
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={formatDate}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                ticks={getYAxisTicks()}
                tickFormatter={formatYAxis}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Daily Revenue"
          value={formatCurrency(calculateDayRevenue(today, revenueData))}
          change={calculatePercentageChangeTodayYesterday(revenueData)}
          subtitle={`${today.getDate()}/${today.getMonth() + 1}`}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(
            calculateMonthRevenue(
              today.getMonth(),
              today.getFullYear(),
              revenueData
            )
          )}
          change={calculatePercentageChangeTodayYesterday(revenueData)}
          subtitle={`From ${today.getMonth() + 1}`}
        />
        <StatCard
          title="Yearly Revenue"
          value={formatCurrency(
            calculateYearRevenue(today.getFullYear(), revenueData)
          )}
          change={calculatePercentageChangeTodayYesterday(revenueData)}
          subtitle={`From ${today.getFullYear()}`}
        />
      </div>
    </div>
  );
};

export default RevenueManager;