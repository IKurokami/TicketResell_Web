import React, { useState, useEffect } from "react";
import "@/Css/MyCart.css";
import { useRouter } from "next/navigation";
import { BuildingBankRegular } from "@fluentui/react-icons";
import Cookies from "js-cookie";
export interface CartItem {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: {
    name: string;
    imageUrl: string;
    startDate: string;
  };
}

interface CartItemWithSelection extends CartItem {
  isSelected: boolean;
  image: string;
}

const MyCart: React.FC = () => {
  const [items, setItems] = useState<CartItemWithSelection[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const router = useRouter();

  // Fetch cart items when component loads
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const id = Cookies.get("id");

        if (!id) {
          router.push("/login");
          return;
        }
        // Get the user ID from cookies
        const response = await fetch(
          `http://localhost:5296/api/cart/items/${id}`
        );
        const data = await response.json();
        const itemsWithSelection = data.data.map((item: CartItem) => ({
          ...item,
          image: item.ticket.imageUrl,
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

  const paymentMethods = [
    { id: "bank-transfer", name: "Bank Transfer", icon: BuildingBankRegular },
    {
      id: "momo",
      name: "MoMo",
      imageUrl:
        "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
    },
  ];

  // Filter selected items for checkout
  const selectedItems = items.filter((item) => item.isSelected);
  const totalItemsPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = totalItemsPrice > 0 ? totalItemsPrice : 0;

  // Select a cart item
  const handleSelect = (id: string) => {
    const updatedItems = items.map((item) =>
      item.orderDetailId === id
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    setItems(updatedItems);
  };

  // Select payment method
  const handleSelectPayment = (id: string) => {
    setSelectedPayment((prev) => (prev === id ? null : id));
  };

  // Change item quantity
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

  // Remove item from cart
  const handleRemoveItem = async (ticketId: string) => {
    const userId = Cookies.get("id"); // Assuming you have the userId in cookies
    try {
      await fetch(
        `http://localhost:5296/api/cart/remove/${userId}/${ticketId}`,
        {
          method: "DELETE",
        }
      );
      // Remove the item locally from the state after successful deletion
      setItems((prevItems) =>
        prevItems.filter((item) => item.ticketId !== ticketId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    const productsForCheckout = items.filter((item) => item.isSelected);
    if (productsForCheckout.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }
    localStorage.setItem(
      "selectedTickets",
      JSON.stringify(productsForCheckout)
    );
    localStorage.setItem("paymentMethod", selectedPayment);
    router.push("/checkout");
  };

  return (
    <div className="mt-24 pb-32 px-4 sm:px-6 lg:px-16 shadow rounded">
      <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col lg:flex-row">
          {/* Left Column: Tickets Table */}
          <div className="w-full lg:w-2/3 lg:pr-6 mb-6 lg:mb-0">
            <h2
              className="text-4xl font-semibold text-gray-800 mb-8 tracking-wider"
              style={{ fontFamily: "serif" }}
            >
              🛒 Payment Cart
            </h2>
            <div
              className="overflow-x-auto rounded border bg-gray-50 relative"
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                border: "2px solid #2b2b2b",
                borderRadius: "10px",
              }}
            >
              <table className="w-full text-lg text-black">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ticket Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Select
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {items.map((item, index) => (
                    <tr
                      key={item.orderDetailId}
                      className="hover:bg-gray-100 transition-all duration-200 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="block text-gray-900">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.ticket.name}
                            className="w-64 h-24 rounded mr-1"
                            style={{ border: "2px solid #2b2b2b" }}
                          />
                          <span className="text-gray-900 text-lg">
                            {item.ticket.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.orderDetailId, false)
                            }
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <span className="font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.orderDetailId, true)
                            }
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-center text-gray-600">
                        {new Date(item.ticket.startDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        € {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={item.isSelected}
                            onChange={() => handleSelect(item.orderDetailId)}
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          />
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveItem(item.ticketId)}
                          className="font-medium text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
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
                <div className="grid grid-cols-2 gap-4">
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
                      {method.icon ? (
                        <method.icon className="text-3xl mb-2 text-gray-700" />
                      ) : (
                        <img
                          src={method.imageUrl}
                          alt={method.name}
                          className="w-12 h-12 mb-2"
                        />
                      )}
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
