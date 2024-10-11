import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Ticket, CheckCircle, ArrowRight, Lock, Tag, ChevronLeft, ChevronRight } from "lucide-react";

interface CheckoutItem {
    orderDetailId: string;
    ticketId: string;
    price: number;
    quantity: number;
    ticket: {
        name: string;
        imageUrl: string;
        startDate: string;
    };
}

interface SuggestedTicket {
    id: string;
    name: string;
    imageUrl: string;
    startDate: string;
    price: number;
}

const Checkout: React.FC = () => {
    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [suggestedTickets, setSuggestedTickets] = useState<SuggestedTicket[]>([]);
    const [currentGroup, setCurrentGroup] = useState(0);

    useEffect(() => {
        const storedItems = localStorage.getItem("selectedTickets");
        const storedPaymentMethod = localStorage.getItem("paymentMethod");
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
        if (storedPaymentMethod) {
            setPaymentMethod(storedPaymentMethod);
        }
        setSuggestedTickets([
            { id: "1", name: "Concert A", imageUrl: "/api/placeholder/300/200", startDate: "2024-11-15", price: 50 },
            { id: "2", name: "Theater Show B", imageUrl: "/api/placeholder/300/200", startDate: "2024-11-20", price: 35 },
            { id: "3", name: "Sports Event C", imageUrl: "/api/placeholder/300/200", startDate: "2024-11-25", price: 75 },
            { id: "4", name: "Festival D", imageUrl: "/api/placeholder/300/200", startDate: "2024-12-01", price: 60 },
            { id: "5", name: "Comedy Night E", imageUrl: "/api/placeholder/300/200", startDate: "2024-12-05", price: 40 },
        ]);
    }, []);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% tax
    const totalPrice = subtotal + tax;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Order submitted:", { items, paymentMethod, totalPrice });
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
            // Redirect to home page or order confirmation page
            // window.location.href = "/";
        }, 5000);
    };

    const handleAddSuggestedTicket = (ticket: SuggestedTicket) => {
        const newItem: CheckoutItem = {
            orderDetailId: `new-${Date.now()}`,
            ticketId: ticket.id,
            price: ticket.price,
            quantity: 1,
            ticket: {
                name: ticket.name,
                imageUrl: ticket.imageUrl,
                startDate: ticket.startDate,
            },
        };
        setItems([...items, newItem]);
    };

    const nextGroup = () => {
        setCurrentGroup((prevGroup) => (prevGroup + 1) % Math.ceil(suggestedTickets.length / 5));
    };

    const prevGroup = () => {
        setCurrentGroup((prevGroup) => (prevGroup - 1 + Math.ceil(suggestedTickets.length / 5)) % Math.ceil(suggestedTickets.length / 5));
    };

    const currentTickets = suggestedTickets.slice(currentGroup * 5, (currentGroup + 1) * 5);

    return (
        <div className="mt-24 min-h-screen w-full bg-gray-100 py-16 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-6xl font-extrabold text-gray-900 mb-16 text-center">
                    Complete Your Purchase
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                                <h2 className="text-3xl leading-8 font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.orderDetailId} className="px-8 py-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img src={item.ticket.imageUrl} alt={item.ticket.name} className="h-32 w-32 rounded-xl object-cover mr-8" />
                                                <div>
                                                    <h3 className="text-2xl font-medium text-gray-900">{item.ticket.name}</h3>
                                                    <p className="mt-2 text-xl text-gray-500 flex items-center">
                                                        <Calendar className="inline-block mr-2 h-6 w-6" />
                                                        {new Date(item.ticket.startDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-medium text-gray-900">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                                <h2 className="text-3xl leading-8 font-semibold text-gray-900">Payment Method</h2>
                            </div>
                            <div className="px-8 py-8">
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="h-12 w-12 text-gray-400" />
                                    <span className="text-2xl text-gray-700">{paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Total and Checkout Button */}
                    <div className="space-y-12">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-8 py-8">
                                <dl className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-xl text-gray-600">Subtotal</dt>
                                        <dd className="text-xl font-medium text-gray-900">€{subtotal.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-xl text-gray-600">Tax (5%)</dt>
                                        <dd className="text-xl font-medium text-gray-900">€{tax.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                        <dt className="text-2xl font-medium text-gray-900">Order total</dt>
                                        <dd className="text-2xl font-medium text-gray-900">€{totalPrice.toFixed(2)}</dd>
                                    </div>
                                </dl>
                                <div className="mt-10">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-indigo-600 border border-transparent rounded-xl shadow-lg py-4 px-6 text-2xl font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-lg text-gray-500 flex items-center justify-center">
                                        <Lock className="h-6 w-6 mr-2" />
                                        Secure checkout
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Tickets */}
                <div className="mt-24">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12">RECOMMENDED TICKETS</h2>
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                                {currentTickets.map((ticket) => (
                                    <div key={ticket.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105">
                                        <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-56 object-cover" />
                                        <div className="p-6">
                                            <h3 className="text-xl font-medium text-gray-900">{ticket.name}</h3>
                                            <p className="mt-2 text-lg text-gray-500 flex items-center">
                                                <Calendar className="inline-block mr-2 h-5 w-5" />
                                                {new Date(ticket.startDate).toLocaleDateString()}
                                            </p>
                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="text-2xl font-medium text-gray-900">€{ticket.price.toFixed(2)}</span>
                                                <button
                                                    onClick={() => handleAddSuggestedTicket(ticket)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                                                >
                                                    <Ticket className="h-5 w-5 mr-2" />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={prevGroup} className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-100 transition duration-300">
                            <ChevronLeft className="h-8 w-8 text-gray-600" />
                        </button>
                        <button onClick={nextGroup} className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-100 transition duration-300">
                            <ChevronRight className="h-8 w-8 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Success Alert */}
                {showSuccessAlert && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 max-w-2xl w-full bg-green-100 border-l-8 border-green-500 p-8 rounded-2xl shadow-2xl">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-xl font-medium text-green-800">
                                    Order placed successfully! Check your email for the ticket QR code.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;