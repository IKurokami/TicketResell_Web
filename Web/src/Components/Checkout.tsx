import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BuildingBankRegular } from "@fluentui/react-icons";
import { CartItem } from "@/Components/Cart"; // Importing types from MyCart
import { Ticket } from "@/models/TicketFetch";

const Checkout: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
  });

  const router = useRouter();
  const taxRate = 0.05; // 5% tax

  useEffect(() => {
    const storedItems = localStorage.getItem("selectedTickets");
    const storedPaymentMethod = localStorage.getItem("paymentMethod");

    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems));
    }
    if (storedPaymentMethod) {
      setPaymentMethod(storedPaymentMethod);
    }
  }, []);

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const taxAmount = totalPrice * taxRate;
  const totalWithTax = totalPrice + taxAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted", { selectedItems, paymentMethod, shippingInfo });
    localStorage.removeItem("selectedTickets");
    localStorage.removeItem("paymentMethod");
    router.push("/order-confirmation");
  };

  return (
    <div className="mt-24 pb-32 px-4 sm:px-6 lg:px-16 shadow rounded">
      <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col lg:flex-row">
          {/* Left Column: Selected Items and Shipping Form */}
          <div className="w-full lg:w-2/3 lg:pr-6 mb-6 lg:mb-0">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8 tracking-wider" style={{ fontFamily: "serif" }}>
              🛒 Checkout
            </h2>

            {/* Selected Items */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Selected Items</h3>
              <div className="overflow-x-auto shadow-lg rounded-lg border bg-gray-50 p-6">
                <table className="w-full text-lg text-black">
                  <thead className="bg-white border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-600 tracking-wide">Ticket Name</th>
                      <th className="px-6 py-4 text-left text-gray-600 tracking-wide">Quantity</th>
                      <th className="px-6 py-4 text-left text-gray-600 tracking-wide">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {selectedItems.map((item) => (
                      <tr key={item.orderDetailId} className="hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.ticket.imageUrl}
                              alt={item.ticket.name}
                              className="w-16 h-16 rounded mr-4"
                              style={{ border: "2px solid #2b2b2b" }}
                            />
                            <span className="text-gray-900">{item.ticket.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">€ {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Buyer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary and Payment */}
          <div className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">€ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tax (5%)</span>
                <span className="text-sm font-medium text-gray-900">€ {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-lg font-semibold text-blue-600">€ {totalWithTax.toFixed(2)}</span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Payment Method:</p>
                <div className="flex items-center justify-center p-4 rounded-lg bg-gray-100">
                  {paymentMethod === "bank-transfer" ? (
                    <>
                      <BuildingBankRegular className="text-3xl mr-2 text-gray-700" />
                      <span className="text-sm text-gray-700">Bank Transfer</span>
                    </>
                  ) : (
                    <>
                      <img
                        src="https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png"
                        alt="MoMo"
                        className="w-8 h-8 mr-2"
                      />
                      <span className="text-sm text-gray-700">MoMo</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                onClick={handleSubmit}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
