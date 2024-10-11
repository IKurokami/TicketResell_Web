import React, { useState, useEffect } from "react";
import "@/Css/MyCart.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  CreditCardClockRegular,
  WalletRegular,
  MoneyRegular,
  GiftRegular,
  BuildingBankRegular,
  PhonePageHeaderRegular,
} from "@fluentui/react-icons";

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
        // Cookies.get("id") 
        const id = "USER001"; // Get the user ID from cookies
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
    // Cookies.get("id") 
    const userId = "USER001"; // Assuming you have the userId in cookies
    try {
      await fetch(`http://localhost:5296/api/cart/remove/${userId}/${ticketId}`, {
        method: "DELETE",
      });
      // Remove the item locally from the state after successful deletion
      setItems((prevItems) => prevItems.filter((item) => item.ticketId !== ticketId));
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
    localStorage.setItem("selectedTickets", JSON.stringify(productsForCheckout));
    localStorage.setItem("paymentMethod", selectedPayment);
    router.push("/checkout");
  };

  return (
    <div className="mt-24 w-full-screen rounded">
      <div className="mx-auto bg-white rounded-t-xl overflow-hidden">
        <div className="p-6 flex flex-col lg:flex-row relative">
          {/* Left Column: Tickets Table */}
          <div className="w-full lg:w-2/3 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-white z-10 py-4">
              Shopping Cart
            </h2>
            <div className="hidden sm:grid sm:grid-cols-6 gap-4 mb-4 text-sm font-medium text-gray-500 sticky top-16 bg-white z-10 py-2">
              <div className="col-span-3">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            {items.map((item) => (
              <div
                key={item.orderDetailId}
                className="border-b border-t border-gray-200 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:items-center relative"
              >
                {/* Delete button positioned absolutely at top right */}
                <button
                  onClick={() => handleRemoveItem(item.ticketId)}
                  className="absolute top-2 right-2 rounded-full group flex items-center justify-center focus-within:outline-red-500"
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                      cx="17"
                      cy="17"
                      r="17"
                      fill=""
                    />
                    <path
                      className="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                      d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                      stroke="#EF4444"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center col-span-3 mb-4 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => handleSelect(item.orderDetailId)}
                    className="mr-4 h-4 w-4 text-blue-600"
                  />
                  <img
                    src={item.imageUrl}
                    alt={item.ticket.name}
                    className="w-64 h-32 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.ticket.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.ticket.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mb-2 sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Price:</span>€
                  {item.price.toFixed(2)}
                </div>
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Quantity:</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.orderDetailId, false)
                    }
                    className="text-gray-500 hover:text-gray-600"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.orderDetailId, true)
                    }
                    className="text-gray-500 hover:text-gray-600"
                  >
                    +
                  </button>
                </div>
                <div className="mb-2 sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Total:</span>€
                  {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Payment Method and Summary */}
          <div className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-200 sticky top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 py-4">
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
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 mt-4"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
