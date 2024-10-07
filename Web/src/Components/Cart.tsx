import React, { useState, useEffect } from "react";
import "@/Css/MyCart.css";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversity, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import Cookies from "js-cookie";
import {
  CreditCardClockRegular,
  WalletRegular,
  MoneyRegular,
  GiftRegular,
  BuildingBankRegular,
  PhonePageHeaderRegular,
} from "@fluentui/react-icons";

export interface Ticket {
  ticketId: string;
  sellerId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  createDate: string;
  modifyDate: string;
  status: number;
  seller: null | any;
  image: string;
  categories: any[];
  category: null | any;
}
export interface CartItem {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: Ticket;
}
interface CartItemWithSelection extends CartItem {
  isSelected: boolean;
}

const MyCart: React.FC = () => {
  const [items, setItems] = useState<CartItemWithSelection[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Cookies.get('id')
        const id = "USER001";
        const response = await fetch(
          `http://localhost:5296/api/cart/items/${id}`
        );
        const data = await response.json();
        console.log("cart data: ", data.data);
        const itemsWithSelection = data.data.map((item: CartItem) => ({
          ...item,
          isSelected: false,
        }));
        setItems(itemsWithSelection);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);
  useEffect(() => {
    console.log("Cart items updated: ", items);
  }, [items]);

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: CreditCardClockRegular },
    { id: "wallet", name: "Digital Wallet", icon: WalletRegular },
    { id: "cash", name: "Cash", icon: MoneyRegular },
    { id: "gift-card", name: "Gift Card", icon: GiftRegular },
    { id: "bank-transfer", name: "Bank Transfer", icon: BuildingBankRegular },
    {
      id: "mobile-payment",
      name: "Mobile Payment",
      icon: PhonePageHeaderRegular,
    },
  ];

  const router = useRouter();

  // Tính tổng giá tiền của các sản phẩm được chọn
  const selectedItems = items.filter((item) => item.isSelected);
  const totalItemsPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = totalItemsPrice > 0 ? totalItemsPrice : 0;

  // Chọn sản phẩm
  const handleSelect = (id: string) => {
    const updatedItems = items.map((item) =>
      item.orderDetailId === id
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    setItems(updatedItems);
  };

  // Chọn phương thức thanh toán
  const handleSelectPayment = (id: string) => {
    setSelectedPayment((prev) => (prev === id ? null : id));
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (id: string, increment: boolean) => {
    const updatedItems = items.map((item) => {
      if (item.orderDetailId === id) {
        const newQuantity = increment
          ? item.quantity + 1
          : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Tiến hành thanh toán
  const handleCheckout = () => {
    const selectedTickets = items.filter((item) => item.isSelected);
    const productsForCheckout = items.filter((item) => item.isSelected);
    if (productsForCheckout.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }
    localStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
    localStorage.setItem("paymentMethod", selectedPayment);
    router.push("/checkout");
  };

  return (
    <div className="mt-24 pb-32 px-4 sm:px-6 lg:px-16 shadow rounded">
      <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col lg:flex-row">
          {/* Left Column: Tickets Table */}
          <div className="w-full lg:w-2/3 lg:pr-6 mb-6 lg:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Payment Cart
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        No
                      </span>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                        Ticket Name
                      </span>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Amount
                      </span>
                    </th>
                    <th className="hidden sm:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Date
                      </span>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Price
                      </span>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Select
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.slice(0, 10).map((item, index) => (
                    <tr
                      key={item.orderDetailId}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src="https://picsum.photos/200"
                            alt={item.ticket.name}
                            className="w-10 h-10 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-900">
                            {item.ticket.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() =>
                              handleQuantityChange(item.orderDetailId, false)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="mx-2 text-sm text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() =>
                              handleQuantityChange(item.orderDetailId, true)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.ticket.startDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        € {item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={item.isSelected}
                          onChange={() => handleSelect(item.orderDetailId)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Payment Method and Summary */}
          <div className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Summary
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected Items</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedItems.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  € {totalItemsPrice.toFixed(2)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Payment Method:</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition duration-300 ${
                        selectedPayment === method.id
                          ? "bg-blue-100 border border-blue-500"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSelectPayment(method.id)}
                    >
                      <method.icon className="text-3xl mb-2 text-gray-700" />
                      <span className="text-xs text-gray-700">
                        {method.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">
                  Total Price
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  € {totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
