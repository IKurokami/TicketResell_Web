"use client";
import React, { useState, useEffect } from 'react';
import { Ticket, User, Search, Calendar, CreditCard, X, Filter, ChevronDown, MapPin } from 'lucide-react';
import Cookies from 'js-cookie';
import { fetchImage } from '@/models/FetchImage';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const MyTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const userId = Cookies.get('id');
      const response = await fetch(`http://localhost:5296/api/History/get/${userId}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      if (result.statusCode === 200 && Array.isArray(result.data)) {
        const completedTickets = await Promise.all(result.data
          .filter(order => order.status === 0) // Only completed orders
          .flatMap(order =>
            order.orderDetails.map(async detail => {
              const startDate = detail.ticket.startDate;
              const formattedDate = formatDate(startDate);
              const { imageUrl } = await fetchImage(detail.ticket.image); // Fetching the image

              return {
                id: detail.ticket.id,
                name: detail.ticket.name,
                date: formattedDate,
                cost: detail.ticket.cost,
                quantity: detail.quantity,
                sellerId: detail.ticket.sellerId,
                description: detail.ticket.description || 'Không có mô tả',
                categories: detail.ticket.categories,
                image: imageUrl || detail.ticket.image, // Use fetched image or fallback
                location: detail.ticket.location
              };
            })
          )
        );

        setTickets(completedTickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Calculate days from now to event date
  const calculateDaysFromNow = (startDate: string) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Đã diễn ra';
    } else if (diffDays === 0) {
      return 'Diễn ra hôm nay';
    } else {
      return 'Sắp diễn ra';
    }
  };

  // Format date to Vietnamese format
  const formatDate = (startDate: string) => {
    if (!startDate) return 'Ngày không hợp lệ';
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}`;
  };

  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Bonus: Filter tickets function
  const filterTickets = (tickets, searchTerm, filterStatus) => {
    return tickets.filter(ticket => {
      const matchesSearch =
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.sellerId && ticket.sellerId.toLowerCase().includes(searchTerm.toLowerCase()));

      if (filterStatus === 'all') return matchesSearch;
      return matchesSearch && calculateDaysFromNow(ticket.date) === filterStatus;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã diễn ra':
        return 'bg-gray-100 text-gray-600';
      case 'Diễn ra hôm nay':
        return 'bg-green-100 text-green-600';
      case 'Sắp diễn ra':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredTickets = filterTickets(tickets, searchTerm, filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header with Animation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-gray-600">
                Giỏ hàng
              </h1>
              <p className="text-gray-500">
                Quản lý và theo dõi các vé đã mua thành công
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-blue-50 text-green-700 rounded-full text-sm font-medium animate-pulse">
                {tickets.length} vé
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="relative sm:col-span-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80 backdrop-blur-sm"
                placeholder="Tìm kiếm theo tên vé hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full h-12 border border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <div className="flex items-center space-x-3 px-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {filterStatus === 'all' ? 'Tất cả' :
                        filterStatus === '' ? 'Lọc theo trạng thái' :
                          filterStatus}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg mt-1">
                  <SelectItem value="all" className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    Tất cả
                  </SelectItem>
                  <SelectItem value="Sắp diễn ra" className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    Sắp diễn ra
                  </SelectItem>
                  <SelectItem value="Diễn ra hôm nay" className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    Diễn ra hôm nay
                  </SelectItem>
                  <SelectItem value="Đã diễn ra" className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    Đã diễn ra
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets Grid with Animation */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket, index) => (
              <Card
                key={ticket.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white/80 backdrop-blur-sm"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setIsModalOpen(true);
                }}
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
                }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={ticket.image}
                      alt={ticket.name}
                      className="w-full h-auto   rounded-t-lg group-hover:brightness-90 transition-all"
                      style={{ aspectRatio: '16 / 9' }} // Thay đổi tỉ lệ khung hình nếu cần
                    />
                    <div className={`absolute left-4 top-4 ${getStatusColor(calculateDaysFromNow(ticket.date))} px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}>
                      {calculateDaysFromNow(ticket.date)}
                    </div>
                  </div>


                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                        {ticket.name}
                      </h3>
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Ticket className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{ticket.date}</span>
                      </div>

                      {ticket.location && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate max-w-full block">Vị trí: {ticket.location}</span>

                        </div>
                      )}


                      <div className="flex items-center gap-3 text-gray-600">
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Số lượng: {ticket.quantity}</span>
                      </div>

                      <p className="text-lg font-bold text-green-600 ml-auto text-right">
                        {formatPrice(ticket.cost)} / Vé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTickets.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-50 rounded-full p-6 mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Không tìm thấy vé nào</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc của bạn
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center mt-20">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative h-64">
              <img
                src={selectedTicket.image}
                alt={selectedTicket.name}
                className="w-full h-full "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedTicket.name}</h3>
                <p className="text-white/80">{selectedTicket.date}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Chi tiết sự kiện:</h4>
                  <p className="text-gray-600 leading-relaxed overflow-hidden overflow-ellipsis  max-w-full">{selectedTicket.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Thông tin người bán:</h4>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{selectedTicket.sellerId}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Thông tin vé:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                        <span className="text-gray-700">Số lượng:</span>
                        <span className="font-semibold text-green-600">{selectedTicket.quantity}</span>
                      </div>

                      <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                        <span className="text-gray-700">Tổng giá:</span>
                        <span className="font-semibold text-green-600">
                          {formatPrice(selectedTicket.cost * selectedTicket.quantity)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyTicketPage;