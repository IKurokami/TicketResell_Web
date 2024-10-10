import React, { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Calendar, Ticket, CheckCircle, ArrowRight } from "lucide-react";

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
    ]);
  }, []);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { items, paymentMethod });
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      window.location.href = "/"; // Redirect to home page after 5 seconds
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
  return (
    <div className="mt-24 w-full-screen rounded">
      <div className="mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl overflow-hidden">
        <div className="p-6 flex flex-col lg:flex-row">
          {/* Left Column: Order Summary */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">Complete Your Purchase</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-500 text-white p-4">
                <h3 className="text-xl font-semibold">Order Summary</h3>
              </div>
              <div className="p-4">
                {items.map((item) => (
                  <div key={item.orderDetailId} className="py-4 flex items-center border-b border-gray-200 last:border-b-0">
                    <img src={item.ticket.imageUrl} alt={item.ticket.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.ticket.name}</h3>
                      <p className="text-sm text-gray-500">
                        <Calendar className="inline-block mr-1 h-4 w-4" />
                        {new Date(item.ticket.startDate).toLocaleDateString()}
                      </p>
                      <div className="mt-1 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">€{item.price.toFixed(2)} x {item.quantity}</p>
                        <p className="text-lg font-semibold text-blue-600">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-between items-center text-xl font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method and Checkout */}
          <div className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-200">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-500 text-white p-4">
                <h3 className="text-xl font-semibold">Payment Method</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
                  <CreditCard className="h-8 w-8 text-blue-500" />
                  <span className="text-lg font-medium text-gray-700">{paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
                    Complete Order
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </button>
                </form>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    <p>Secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Tickets Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">Recommended Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
                <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{ticket.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(ticket.startDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">€{ticket.price.toFixed(2)}</p>
                    <button onClick={() => handleAddSuggestedTicket(ticket)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                      <Ticket className="inline-block mr-2 h-4 w-4" /> Add to Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <div>
              <p className="font-medium text-green-800">
                Success! Your purchase is complete.
              </p>
              <p className="mt-1 text-green-700">
                The QR code for your ticket will be sent to your email shortly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;