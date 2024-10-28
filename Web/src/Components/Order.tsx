"use client"
import { useEffect, useState } from 'react';
import { Search, Package2, X, Calendar, CreditCard, Ticket } from 'lucide-react';
import "@/Css/Staff.css";

interface OrderDetail {
    orderDetailId: string;
    ticketId: string;
    price: number;
    quantity: number;
    ticket: {
        name: string;
        location: string;
        startDate: string;
        description: string;
        seller: {
            fullname: string;
        };
        image: string;
    };
}

interface OrderData {
    orderId: string;
    buyerId: string;
    status: number;
    date: string;
    orderDetails: OrderDetail[];
}

interface OrderProps {
    email: string;
}

const Order: React.FC<OrderProps> = ({ email }) => {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    useEffect(() => {
        if (email) {
            fetch(`http://localhost:5296/api/Order/read?email=${email}`, {
                method: 'GET',
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => {
                    const orders = data.data.filter((order: OrderData) =>
                        order.buyerId.trim().toLowerCase() === email.trim().toLowerCase()
                    );
                    if (orders.length > 0) {
                        setOrderData(orders[0]);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching order data:', error);
                    setLoading(false);
                });
        }
    }, [email]);

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (!orderData) {
        return <p>Không tìm thấy đơn hàng cho email này.</p>;
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const filteredOrderDetails = orderData.orderDetails.filter((detail) =>
        detail.ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Chi tiết đơn hàng </h1>
                        
                        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {filteredOrderDetails.length} sản phẩm
                        </span>
                    </div>

                    {/* Search Filter */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Tìm kiếm vé..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Order Items List */}
                    <div className="grid gap-4">
                        {filteredOrderDetails.map((detail) => (
                            <div
                                key={detail.orderDetailId}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    setSelectedOrder(detail);
                                    setIsModalOpen(true);
                                }}
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{detail.ticket.name}</h3>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Địa điểm</p>
                                            <p className="font-medium">{detail.ticket.location}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                                            <p className="font-medium">{new Date(detail.ticket.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-sm text-gray-500">Giá</p>
                                            <p className="text-lg font-bold text-blue-600">{formatPrice(detail.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredOrderDetails.length === 0 && (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">Không tìm thấy đơn hàng phù hợp</h3>
                                <p className="text-gray-500 mt-2">Hãy thử tìm kiếm với thuật ngữ khác</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden mt-16">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                            <div>
                                <h3 className="text-lg font-semibold">Chi tiết vé</h3>
                                <p className="text-sm text-gray-500">Mã đơn hàng: {orderData.orderId}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold">{selectedOrder.ticket.name}</h4>
                            <p className="text-sm text-gray-500">Người bán: {selectedOrder.ticket.seller.fullname}</p>
                            <p className="text-sm text-gray-500">Địa điểm: {selectedOrder.ticket.location}</p>
                            <p className="text-sm text-gray-500">Ngày bắt đầu: {new Date(selectedOrder.ticket.startDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">Mô tả: {selectedOrder.ticket.description}</p>
                            <p className="text-lg font-bold mt-2">Tổng cộng: {formatPrice(selectedOrder.price * selectedOrder.quantity)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;
