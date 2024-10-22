import React, { useState, useEffect } from 'react';
import { Ticket, User, Coins, Search, ArrowUpDown, X } from 'lucide-react';
import { Ticket as TicketModel } from '@/models/TicketFetch';
import Cookies from 'js-cookie';

const HistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{
    id: string;
    date: string;
    tickets: TicketModel[];
    price: number;
    status: number;
    seller: string | null;
  }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
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
          const groupedOrders = result.data.map(order => ({
            id: order.orderId,
            date: order.orderDetails[0]?.ticket.createDate || '',
            tickets: order.orderDetails.map(detail => ({
              ...detail.ticket,
              cost: detail.ticket.cost,
              quantity: detail.quantity,
            })),
            price: order.orderDetails.reduce((total: number, detail: any) =>
              total + detail.ticket.cost * detail.quantity, 0),
            status: order.status,
            seller: order.orderDetails[0]?.ticket.sellerId || null,
          }));

          setPurchaseHistory(groupedOrders);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: {
        label: 'Đã Thanh Toán',
        className: 'bg-green-100 text-green-800 ring-green-600/20',
        icon: '✓',
      },
      1: {
        label: 'Đang xử lý',
        className: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
        icon: '⧖',
      },
      2: {
        label: 'Đã hủy',
        className: 'bg-red-100 text-red-800 ring-red-600/20',
        icon: '×',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${config.className}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredOrders = purchaseHistory
    .filter(order => filterStatus === 'all' || order.status === Number(filterStatus))
    .filter(order =>
      order.id.includes(searchTerm) ||
      order.tickets.some(ticket => ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.seller && order.seller.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
              <p className="text-gray-500">Quản lý và theo dõi các đơn hàng của bạn</p>
            </div>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              {purchaseHistory.length} đơn hàng
            </span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Tìm kiếm theo mã đơn, tên vé hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Đã thanh toán</option>
              <option value="1">Đang xử lý</option>
              <option value="2">Đã hủy</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold">#{order.id}</h3>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ngày mua</p>
                      <p className="font-medium">{order.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Bao gồm</p>
                      <ul className="list-disc list-inside">
                        {order.tickets.map((ticket, idx) => (
                          <li key={idx} className="font-medium">{ticket.name} - {ticket.quantity} vé</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(order.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {order.tickets.map((ticket, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {ticket.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Không tìm thấy đơn hàng</h3>
                <p className="text-gray-500 mt-2">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="text-center flex-1">
                <h3 className="text-lg font-semibold">Chi tiết đơn hàng #{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
              {selectedOrder.tickets.map((ticket: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg">{ticket.name}</h4>
                        <p className="text-sm text-gray-500">
                          Vé {index + 1} / {selectedOrder.tickets.length}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Người bán</p>
                            <p className="text-sm text-gray-500">{selectedOrder.seller}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Giá tiền</p>
                            <p className="text-sm text-gray-500">{formatPrice(ticket.cost)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Display the quantity of tickets here */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">SL</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Số lượng</p>
                          <p className="text-sm text-gray-500">{ticket.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;