import React, { useState, useEffect } from "react";
import "@/Css/MyCart.css";
import { useRouter } from "next/navigation";
import { BuildingBankRegular } from "@fluentui/react-icons";
import Cookies from "js-cookie";
import { CheckCircle, Calendar } from "lucide-react";
import { fetchImage } from "@/models/FetchImage";

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
  imageUrl: string;
  sellerName: string;
}

const MyCart: React.FC = () => {
  const [items, setItems] = useState<CartItemWithSelection[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const id = Cookies.get("id");

        if (!id) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5296/api/cart/items/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        const itemsWithSelection = await Promise.all(
          data.data.map(async (item: any) => {
            let image =
              "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"; // default image

            if (item.ticketId && !image) {
              const { imageUrl: fetchedImageUrl, error } = await fetchImage(
                item.ticketId
              );

              if (fetchedImageUrl) {
                image = fetchedImageUrl;
              } else {
                console.error(
                  `Error fetching image for ticket ${item.ticketId}: ${error}`
                );
              }
            }

            return {
              ...item,
              imageUrl: image,
              isSelected: false,
              sellerName: item.ticket.seller.fullname,
            };
          })
        );

        setItems(itemsWithSelection);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const paymentMethods = [
    {
      id: "VNPay",
      name: "VNPay",
      imageUrl:
        "https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vnpayqr-noqr-mien-phi.jpg",
    },
    {
      id: "momo",
      name: "MoMo",
      imageUrl:
        "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
    },
  ];

  const selectedItems = items.filter((item) => item.isSelected);
  const totalItemsPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = totalItemsPrice > 0 ? totalItemsPrice : 0;

  const handleSelect = (id: string) => {
    setItems(items.map((item) =>
      item.orderDetailId === id
        ? { ...item, isSelected: !item.isSelected }
        : item
    ));
  };

  const handleSelectPayment = (id: string) => {
    setSelectedPayment((prev) => (prev === id ? null : id));
  };

  const handleQuantityChange = (id: string, increment: boolean) => {
    setItems(items.map((item) => {
      if (item.orderDetailId === id) {
        const newQuantity = increment
          ? item.quantity + 1
          : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = async (ticketId: string) => {
    const userId = Cookies.get("id");
    try {
      await fetch(
        `http://localhost:5296/api/cart/remove/${userId}/${ticketId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      setItems((prevItems) =>
        prevItems.filter((item) => item.ticketId !== ticketId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

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

  // Function to format price to VND
  const formatPriceVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Function to format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                {/* Delete button positioned absolutely at top right with label */}
                <div className="absolute bottom-2 right-2 mr-1 group">
                  <button
                    onClick={() => handleRemoveItem(item.ticketId)}
                    className="rounded-full flex items-center justify-center focus-within:outline-red-500"
                    aria-label="Delete item"
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
                </div>

                <div className="flex items-center col-span-3 mb-4 sm:mb-0">
                  <img
                    src={item.imageUrl}
                    alt={item.ticket.name}
                    className="w-64 h-32 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {item.ticket.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(item.ticket.startDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seller: {item.sellerName}
                    </p>
                  </div>
                </div>
                <div className="mb-2 sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Price:</span>
                  {formatPriceVND(item.price)}
                </div>
                <div className="flex items-center justify-between sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.orderDetailId, false)
                      }
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 1h16"
                        />
                      </svg>
                    </button>
                    <span className="mx-2 w-10 shrink-0 text-center text-sm font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.orderDetailId, true)
                      }
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-2 sm:mb-0">
                  <span className="sm:hidden font-medium mr-2">Total:</span>
                  {formatPriceVND(item.price * item.quantity)}
                </div>

                <div className="absolute top-2 right-2 mr-4 group">
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-gray-700">Select</span>
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => handleSelect(item.orderDetailId)}
                      className="hidden"
                    />
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ease-in-out ${
                        item.isSelected
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {item.isSelected && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </span>
                  </label>
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
                    {formatPriceVND(totalItemsPrice)}
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
                            ? "bg-blue-100 border border-green-500"
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
                  <span className="text-lg font-semibold text-green-600">
                    {formatPriceVND(totalPrice)}
                  </span>
                </div>

                <button
                  className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300 mt-4"
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