import React, { useState, useEffect } from 'react';
import { Ticket, User,Coins, CheckSquare  ,ShoppingCart  } from 'lucide-react';
import { Ticket as TicketModel } from '@/models/TicketFetch';

const HistoryPage = () => {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{
    id: string;
    date: string;
    tickets: TicketModel[];
    price: number;
    status: number;
    seller: string;
  }>>([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const status = 1;
        const response = await fetch(`http://localhost:5296/api/Ticket/getByOrder/${status}`, {
          credentials: "include",
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const groupedOrders = result.data.reduce((acc: any, ticket: TicketModel) => {
            const existingOrder = acc.find((order: any) => order.id === ticket.id);

            if (existingOrder) {
              existingOrder.tickets.push(ticket);
              existingOrder.price += ticket.cost;
            } else {
              acc.push({
                id: ticket.id,
                date: ticket.createDate,
                tickets: [ticket],
                price: ticket.cost,
                status: ticket.status,
                seller: ticket.sellerId,

              });
            }
            return acc;
          }, []);
          setPurchaseHistory(groupedOrders);
        } else {
          console.error('Invalid data format', result);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const getStatusBadge = (status: number) => {
    const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
      1: {
        label: 'Đã Thanh Toán',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        icon: '✓',
      },
      2: {
        label: 'Đang xử lý',
        className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        icon: '⧖',
      },
      3: {
        label: 'Đã hủy',
        className: 'bg-red-50 text-red-700 ring-red-600/20',
        icon: '×',
      },
    };

    const config = statusConfig[status.toString()] || {};
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${config.className}`}>
        <span className="text-sm">{config.icon}</span>
        {config.label || 'Unknown'}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-none mx-auto py-12 w-full">
        <div className="bg-white p-6 sm:p-8 mt-16 h-screen">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Lịch sử đặt vé
            </h2>
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {purchaseHistory.length} đơn hàng
            </div>
          </div>

          <div className="space-y-4">
            {purchaseHistory.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6 space-y-4" onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">#{order.id}</h4>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Ngày mua</span>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Tổng tiền</span>
                    <span className="text-xl font-semibold text-gray-900">{formatPrice(order.price)}</span>
                  </div>

                </div>

                {/* Dropdown Details */}
                {openOrderId === order.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {order.tickets.map((ticket, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{ticket.name}</h4>
                          <p className="text-sm text-gray-500 mt-0.5">Vé {index + 1} / {order.tickets.length}</p>
                          <div className="grid gap-2 mt-2">

                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Người bán</p>
                                <p className="text-sm text-gray-500">{order.seller}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <ShoppingCart  className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Số lượng</p>
                                <p className="text-sm text-gray-500">{order.seller}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <Coins  className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Giá: {formatPrice(ticket.cost)}</p> {/* Hiển thị giá từng vé */}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <CheckSquare  className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Phương thức thanh toán</p>
                                <p className="text-sm text-gray-500">{order.seller}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Trạng thái</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng tiền</span>
                      <span className="text-xl font-semibold text-gray-900">{formatPrice(order.price)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
