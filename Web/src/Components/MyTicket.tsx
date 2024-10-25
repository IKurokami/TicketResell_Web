"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  User,
  Search,
  Calendar,
  CreditCard,
  X,
  Filter,
  ChevronDown,
  MapPin,
  Share2,
  Download,
  Tag,
  Info,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import QRCode from "qrcode";
import JSZip from "jszip";
import Cookies from "js-cookie";
import { fetchImage } from "@/models/FetchImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";

interface TicketData {
  id: string;
  name: string;
  date: string;
  cost: number;
  quantity: number;
  sellerId: string;
  description: string;
  categories?: string[];
  image: string;
  location?: string;
}

interface OrderDetail {
  ticket: {
    id: string;
    name: string;
    startDate: string;
    cost: number;
    sellerId: string;
    description?: string;
    categories?: string[];
    image: string;
    location?: string;
  };
  quantity: number;
}

interface Order {
  status: number;
  orderDetails: OrderDetail[];
}

const MyTicketPage = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const userId = Cookies.get("id");
      const response = await fetch(
        `http://localhost:5296/api/History/get/${userId}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (result.statusCode === 200 && Array.isArray(result.data)) {
        const completedTickets = await Promise.all(
          result.data
            .filter((order: Order) => order.status === 0)
            .flatMap((order: Order) =>
              order.orderDetails.map(async (detail: OrderDetail) => {
                const startDate = detail.ticket.startDate;
                const formattedDate = formatDate(startDate);
                const { imageUrl } = await fetchImage(detail.ticket.image);

                return {
                  id: detail.ticket.id,
                  name: detail.ticket.name,
                  date: formattedDate,
                  cost: detail.ticket.cost,
                  quantity: detail.quantity,
                  sellerId: detail.ticket.sellerId,
                  description: detail.ticket.description || "Không có mô tả",
                  categories: detail.ticket.categories || ["Chung"],
                  image: imageUrl || detail.ticket.image,
                  location: detail.ticket.location,
                };
              })
            )
        );

        setTickets(completedTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadQRCodes = async (ticket: any) => {
    try {
      // Create an array of promises for generating QR codes
      const qrPromises = Array.from(
        { length: ticket.quantity },
        async (_, index) => {
          // Create unique data for each ticket
          const ticketData = {
            id: ticket.id,
            name: ticket.name,
            date: ticket.date,
            ticketNumber: `${index + 1}/${ticket.quantity}`,
          };

          // Generate QR code as data URL
          return await QRCode.toDataURL(JSON.stringify(ticketData), {
            errorCorrectionLevel: "H",
            margin: 1,
            width: 300,
          });
        }
      );

      // Generate all QR codes
      const qrDataUrls = await Promise.all(qrPromises);

      // Create a zip file if there are multiple tickets
      if (ticket.quantity > 1) {
        const zip = new JSZip();

        // Add each QR code to the zip
        qrDataUrls.forEach((dataUrl: any, index: any) => {
          const data = dataUrl.split(",")[1];
          zip.file(`ticket-${index + 1}.png`, data, { base64: true });
        });

        // Generate and download zip
        const content = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = zipUrl;
        link.download = `tickets-${ticket.id}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(zipUrl);
      } else {
        // Download single QR code directly
        const link = document.createElement("a");
        link.href = qrDataUrls[0];
        link.download = `ticket-${ticket.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating QR codes:", error);
      // You might want to add proper error handling here
    }
  };
  const calculateDaysFromNow = (startDate: string) => {
    // Parse ngày từ format "DD/MM/YYYY, HH:mm"
    const [datePart, timePart] = startDate.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    // Tạo date object với các thành phần đã parse
    // Note: month trong JS bắt đầu từ 0 nên phải trừ 1
    const eventDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    // Kiểm tra tính hợp lệ của ngày
    if (isNaN(eventDate.getTime())) {
      return "Ngày sự kiện không hợp lệ";
    }

    // Lấy thời gian hiện tại và reset về đầu ngày theo giờ địa phương
    const now = new Date();
    const nowAtMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    // Reset eventDate về đầu ngày theo giờ địa phương
    const eventAtMidnight = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      0,
      0,
      0
    );

    // Tính số milliseconds giữa hai ngày
    const diffTime = eventAtMidnight.getTime() - nowAtMidnight.getTime();
    // Chuyển đổi thành số ngày
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Debug log với format địa phương
    // console.log({
    //   startDate,
    //   eventDate: eventDate.toLocaleString(),
    //   nowAtMidnight: nowAtMidnight.toLocaleString(),
    //   eventAtMidnight: eventAtMidnight.toLocaleString(),
    //   diffDays
    // });

    if (diffDays < 0) {
      return "Đã diễn ra";
    } else if (diffDays === 0) {
      return "Diễn ra hôm nay";
    } else {
      return "Sắp diễn ra";
    }
  };

  // Ví dụ sử dụng:

  const formatDate = (startDate: string) => {
    if (!startDate) return "Ngày không hợp lệ";
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sortedAndFilteredTickets = useMemo(() => {
    let filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.sellerId &&
          ticket.sellerId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "all" ||
        calculateDaysFromNow(ticket.date).includes(filterStatus);

      const matchesCategory =
        selectedCategory === "all" ||
        ticket.categories?.includes(selectedCategory);

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.cost - b.cost : b.cost - a.cost;
      }
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [tickets, searchTerm, filterStatus, selectedCategory, sortBy, sortOrder]);

  const totalPages = Math.ceil(
    sortedAndFilteredTickets.length / ITEMS_PER_PAGE
  );
  const currentTickets = sortedAndFilteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    if (status.includes("Đã diễn ra")) return "bg-gray-100 text-gray-600";
    if (status.includes("hôm nay")) return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
  };

  const renderTicketCard = (ticket: TicketData) => (
    <motion.div
      key={ticket.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white/90 backdrop-blur-sm"
        onClick={() => {
          setSelectedTicket(ticket);
          setIsModalOpen(true);
        }}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={ticket.image}
              alt={ticket.name}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-4 top-4 ${getStatusColor(
                calculateDaysFromNow(ticket.date)
              )} px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}
            >
              {calculateDaysFromNow(ticket.date)}
            </div>
            {ticket.categories && (
              <div className="absolute right-4 top-4 flex gap-2">
                {ticket.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {ticket.name}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Ticket className="w-5 h-5 text-blue-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xem chi tiết vé</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{ticket.date}</span>
              </div>

              {ticket.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{ticket.location}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Số lượng: {ticket.quantity}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Giá mỗi vé</span>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(ticket.cost)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderListItem = (ticket: TicketData) => (
    <motion.div
      key={ticket.id}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          setSelectedTicket(ticket);
          setIsModalOpen(true);
        }}
      >
        <img
          src={ticket.image}
          alt={ticket.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{ticket.name}</h3>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {ticket.date}
            </span>
            {ticket.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {ticket.location}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {ticket.categories?.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatPrice(ticket.cost)}
          </p>
          <p className="text-sm text-gray-500">x{ticket.quantity}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-600 ">
                Quản lý vé của bạn
              </h1>
              <p className="text-gray-500">
                Theo dõi và quản lý tất cả các vé đã mua của bạn một cách dễ
                dàng
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {sortedAndFilteredTickets.length} vé
              </motion.div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <div className="grid grid-cols-2 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={`small-circle-${i}`}
                        className="w-1.5 h-1.5 rounded-sm bg-current"
                      />
                    ))}
                  </div>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <div className="flex flex-col gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`rect-${i}`}
                        className="w-6 h-1 rounded-sm bg-current"
                      />
                    ))}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="relative sm:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80 backdrop-blur-sm"
                placeholder="Tìm kiếm theo tên vé hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full h-12 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 pl-4">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {filterStatus === "all"
                        ? "Tất cả trạng thái"
                        : filterStatus}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                  <SelectItem
                    value="all"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Tất cả trạng thái
                  </SelectItem>
                  <SelectItem
                    value="Sắp diễn ra"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Sắp diễn ra
                  </SelectItem>
                  <SelectItem
                    value="Diễn ra hôm nay"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Diễn ra hôm nay
                  </SelectItem>
                  <SelectItem
                    value="Đã diễn ra"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Đã diễn ra
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full h-12 border border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span>Danh mục</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="border border-gray-200 rounded-xl shadow-lg bg-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="comedy">Hài kịch</SelectItem>
                  <SelectItem value="conference">Hội nghị</SelectItem>
                  <SelectItem value="workshop">Hội thảo</SelectItem>
                  <SelectItem value="festival">Lễ hội</SelectItem>
                  <SelectItem value="magic">Ma thuật</SelectItem>
                  <SelectItem value="theater">Nhà hát</SelectItem>
                  <SelectItem value="dance">Nhảy múa</SelectItem>
                  <SelectItem value="sports">Thể thao</SelectItem>
                  <SelectItem value="exhibition">Triển lãm</SelectItem>
                  <SelectItem value="music">Âm nhạc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Select
                value={sortBy}
                onValueChange={(value: "date" | "price" | "name") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 pl-4">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {sortBy === "date"
                        ? "Ngày"
                        : sortBy === "price"
                        ? "Giá"
                        : sortBy === "name"
                        ? "Sắp xếp theo"
                        : "Sắp xếp theo"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                  <SelectItem
                    value="name"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Sắp xếp theo
                  </SelectItem>
                  <SelectItem
                    value="date"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Ngày
                  </SelectItem>
                  <SelectItem
                    value="price"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Giá
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`loading-placeholder-${index}`}
                  className="animate-pulse"
                >
                  <div className="bg-gray-200 h-48 rounded-t-lg" />
                  <div className="p-6 space-y-4 bg-white rounded-b-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tickets Display */}
          {!isLoading && (
            <>
              <AnimatePresence mode="wait">
                {currentTickets.length > 0 ? (
                  <motion.div
                    key="tickets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                          : "space-y-4"
                      }
                    >
                      {currentTickets.map(
                        (ticket) =>
                          viewMode === "grid"
                            ? renderTicketCard(ticket) // Không cần thêm key ở đây vì đã có trong renderTicketCard
                            : renderListItem(ticket) // Không cần thêm key ở đây vì đã có trong renderListItem
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="bg-gray-50 rounded-full p-6 mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Không tìm thấy vé nào
                    </h3>
                    <p className="text-gray-500 mt-2 text-center max-w-md">
                      Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc của
                      bạn
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedTicket && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto mt-20"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 z-10 p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative h-64">
                <img
                  src={selectedTicket.image}
                  alt={selectedTicket.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedTicket.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedTicket.date}</span>
                    </span>
                    {selectedTicket.location && (
                      <span className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTicket.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        <span>Chi tiết sự kiện</span>
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedTicket.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                        <span>Bản đồ</span>
                      </h4>
                      <div className="w-full h-64">
                        {/* Nhúng Google Map ở đây */}
                        <LoadScript googleMapsApiKey="AlzaSyNa20bToeNXLJ6qTZR19bANY6nwn9ZaGjo">
                          <GoogleMap
                            mapContainerStyle={{
                              width: "300px",
                              height: "250px",
                            }}
                            center={{ lat: 10.762622, lng: 106.660172 }} // Tọa độ trung tâm (có thể thay đổi theo vị trí thực tế)
                            zoom={15}
                          >
                            <Marker
                              position={{ lat: 10.762622, lng: 106.660172 }}
                            />
                          </GoogleMap>
                        </LoadScript>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <span>Thông tin người bán</span>
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {selectedTicket.sellerId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        <span>Thông tin thanh toán</span>
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Giá mỗi vé</span>
                          <span className="font-semibold">
                            {formatPrice(selectedTicket.cost)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Số lượng</span>
                          <span className="font-semibold">
                            {selectedTicket.quantity}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tổng tiền</span>
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(
                                selectedTicket.cost * selectedTicket.quantity
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>Trạng thái</span>
                      </h4>
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(
                          calculateDaysFromNow(selectedTicket.date)
                        )}`}
                      >
                        {calculateDaysFromNow(selectedTicket.date)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => downloadQRCodes(selectedTicket)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Tải về</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MyTicketPage;
