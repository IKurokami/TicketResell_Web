import React, { useState, useEffect } from "react";
import "@/Css/MyCart.css";
import { useRouter } from "next/navigation";
import { BuildingBankRegular } from "@fluentui/react-icons";
import Cookies from "js-cookie";
import { CheckCircle, Trash2 } from "lucide-react";
import { fetchImage } from "@/models/FetchImage";

export interface CartItem {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: {
    name: string;
    image: string;
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

  // Fetch cart items when component loads
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

            console.log("ticket", item.ticket.image);
            if (item.ticket.image) {
              const { imageUrl: fetchedImageUrl, error } = await fetchImage(
                item.ticket.image
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

  useEffect(() => {
    console.log("Cart items updated: ", items);
  }, [items]);

  const paymentMethods = [
    {
      id: "VNpay",
      name: "VNpay",
      imageUrl:
        "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg",
    },
    {
      id: "momo",
      name: "MoMo",
      imageUrl:
        "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
    },
    {
      id: "Paypal",
      name: "Paypal",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png",
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

  const fetchPaypalOrder = async (vndAmount) => {
    try {
      const response = await fetch("/api/getPaypalOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vndAmount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const data = await response.json();
      return data.paymentUrl; // Return the order data
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error; // Re-throw the error for handling elsewhere if needed
    }
  };

  const fetchVnPay = async (amount, vnp_TxnRef) => {
    try {
      const response = await fetch("/api/getPaymentUrl", {
        method: "POST", // Specify the method as POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, vnp_TxnRef }), // Include amount and vnp_TxnRef in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment URL");
      }

      const data = await response.json();
      return data.paymentUrl; // Return the payment URL
    } catch (error) {
      console.error("Error fetching payment URL:", error);
      throw error; // Re-throw the error for handling elsewhere
    }
  };

  const fetchMoMoPayment = async (amount, requestId, orderId) => {
    try {
      const response = await fetch("/api/createMoMoPayment", {
        // Adjust the API endpoint as necessary
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, requestId, orderId }), // Send the amount, requestId, and orderId
      });

      if (!response.ok) {
        throw new Error("Failed to fetch MoMo payment URL");
      }

      const data = await response.json();
      return data.payUrl; // Return the payment URL from MoMo's response
    } catch (error) {
      console.error("Error fetching MoMo payment URL:", error);
      throw error; // Re-throw the error for handling elsewhere
    }
  };

  // Proceed to checkout
  const handleCheckout = async () => {
    const productsForCheckout = items.filter((item) => item.isSelected);

    if (productsForCheckout.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }

    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }

    // Store selected products and payment method in local storage
    localStorage.setItem(
      "selectedTickets",
      JSON.stringify(productsForCheckout)
    );
    localStorage.setItem("paymentMethod", selectedPayment);
    const requestId = `requestId_${Date.now()}`; // Generate a unique request ID
    const orderId = `orderId_${Date.now()}`;
    if (selectedPayment === "Paypal") {
      try {
        const paymentUrl = await fetchPaypalOrder(totalItemsPrice);
        router.push(paymentUrl);
      } catch (error) {
        console.error("Error fetching PayPal order:", error);
        alert(
          "There was an error processing your PayPal order. Please try again."
        );
      }
    } else if (selectedPayment === "VNpay") {
      try {
        const paymentUrl = await fetchVnPay(totalItemsPrice, orderId); // Fetch the VNPay payment URL
        console.log("VNPay Payment URL:", paymentUrl);
        router.push(paymentUrl); // Redirect to VNPay URL
      } catch (error) {
        console.error("Error fetching VNPay order:", error);
        alert(
          "There was an error processing your VNPay order. Please try again."
        );
      }
    } else if (selectedPayment === "momo") {
      // Generate a unique order ID

      try {
        const paymentUrl = await fetchMoMoPayment(
          totalItemsPrice,
          requestId,
          orderId
        ); // Fetch the MoMo payment URL
        console.log("MoMo Payment URL:", paymentUrl);
        router.push(paymentUrl); // Redirect to MoMo URL
      } catch (error) {
        console.error("Error fetching MoMo payment URL:", error);
        alert(
          "There was an error processing your MoMo order. Please try again."
        );
      }
    }
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
      <div className=" bg-white rounded-t overflow-hidden">
        <div className="px-8 xl:px-24 pb-16 flex flex-col lg:flex-row relative">
          {/* Left Column: Tickets Table */}
          <div className="w-full lg:w-2/3 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-white z-10 py-4">
              Shopping Cart
            </h2>
            <div className="hidden sm:grid sm:grid-cols-7 gap-4 mb-4 min-w-full text-sm font-medium text-gray-500 sticky top-16 bg-white z-10 py-2">
              <div className="col-span-3">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
              <div>Actions</div>
            </div>
            {items.map((item) => (
              <div
                key={item.orderDetailId}
                className="border-b border-t border-gray-200 py-4 sm:grid sm:grid-cols-7 sm:gap-4 sm:items-center relative"
              >
                <div className="flex flex-col col-span-3 mb-4 sm:mb-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {item.ticket.name}
                  </h3>
                  <div className="flex flex-col items-start">
                    <img
                      src={item.imageUrl}
                      alt={item.ticket.name}
                      className="w-64 h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      {formatDateTime(item.ticket.startDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seller: {item.sellerName}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="sm:hidden font-medium mr-2">Price:</span>
                  {formatPriceVND(item.price)}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="sm:hidden font-medium">Quantity:</span>
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1h16"
                        />
                      </svg>
                    </button>
                    <span className="w-10 shrink-0 text-center text-sm font-medium text-gray-900">
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="sm:hidden font-medium mr-2">Total:</span>
                  {formatPriceVND(item.price * item.quantity)}
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
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
                  <button
                    onClick={() => handleRemoveItem(item.ticketId)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Payment Method and Summary */}
          <div className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-200 sticky min-h-full">
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
