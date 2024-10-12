"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DateFilter from '@/Components/datefilter'; // Đường dẫn đến file chứa DateFilter

// Custom icon components

const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M14.83 14.83a4 4 0 0 0-5.66 0L3 21h18l-5.17-6.17z" />
    <path d="M9 9a4 4 0 1 0 6 0 4 4 0 0 0-6 0z" />
  </svg>
);
const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconAlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconMessageCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7
      8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8
      8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5"
    />
  </svg>
);

const IconStar = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77
      5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    />
  </svg>
);

const IconTag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MyTicketsPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      ticket: "World cup 2026",
      status: "Coming Soon",
      date: "2023-10-31 19:21:21",
      totalprice: "$50",
      seller: "Le Minh Quang",
      quantity: 1,
      imgURL: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451",
      tags: ["Sport"],
      rating: 0,
    },
    {
      id: 2,
      ticket: "Get rich with ghosts",
      status: "Expired",
      date: "2023-10-31 19:21:21",
      totalprice: "$75",
      seller: "Huynh Vuong Khang",
      quantity: 2,
      imgURL: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451",
      tags: ["Comedy", "Horror"],
      rating: 0,
    },
    {
      id: 3,
      ticket: "Anh Trai Say Hi",
      status: "Coming Soon",
      date: "2023-10-31 19:21:21",
      totalprice: "$75",
      seller: "Cao Dinh Giap",
      quantity: 2,
      imgURL: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451",
      tags: ["Comedy", "Musical"],
      rating: 0,
    },
    {
      id: 4,
      ticket: "Titanic 2",
      status: "Expired",
      date: "2023-10-31 19:21:21",
      totalprice: "$75",
      seller: "Nguyen Chi Cuong",
      quantity: 2,
      imgURL: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451",
      tags: ["Romance", "Horror"],
      rating: 0,
    },
    {
      id: 5,
      ticket: "Mada",
      status: "Expired",
      date: "2023-10-31 19:21:21",
      totalprice: "$75",
      seller: "Phu Vinh",
      quantity: 2,
      imgURL: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451",
      tags: ["Comedy", "Horror"],
      rating: 0,
    },
  ]);
  const router = useRouter(); // Ensure this line is present

  const handleNavigation = () => {
    router.push('/search'); // Navigate to the /search page
  };
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRating = (orderId, rating) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, rating } : order
      )
    );
  };
  const [selectedDate, setSelectedDate] = useState(""); // Thêm trạng thái cho bộ lọc ngày
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesCategory =
      selectedCategory === "All" || order.tags.includes(selectedCategory);
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchesSearch = order.ticket
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate =
      !selectedDate || order.date.startsWith(selectedDate); // So khớp theo ngày
    
    return matchesCategory && matchesStatus && matchesSearch && matchesDate;
  });
  
  return (
    <div className="mt-24 min-h-screen w-full bg-gray-50 py-12 px-6 sm:px-8 lg:px-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">My Tickets</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="relative mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search events or sellers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-64 rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div className="absolute right-3 top-2">
            <IconSearch />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="All">Categories</option>
              <option value="Sport">Sport</option>
              <option value="Comedy">Comedy</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Musical">Musical</option>

            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="All"> Status</option>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
                    <DateFilter selectedDate={selectedDate} onDateChange={handleDateChange} />

        </div>
        
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={order.imgURL}
              alt={order.ticket}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{order.ticket}</h2>
              <p
                className={`text-sm mb-4 p-2 rounded-full w-auto h-auto flex items-center justify-center ${order.status === 'Coming Soon'
                  ? 'bg-blue-50 text-blue-500 font-bold'
                  : order.status === 'Expired'
                    ? 'bg-red-50 text-red-500 font-bold'
                    : 'bg-gray-100 text-gray-500'
                  }`}
                style={{ width: 'fit-content', height: 'fit-content' }} // Đảm bảo chiều rộng và chiều cao tự động theo nội dung
              >
                {order.status}
              </p>




              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">
                  <IconCalendar className="inline-block mr-2" />
                  {order.date}
                </p>
                <p className="text-gray-600 text-sm">{order.totalprice}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm">
                  <IconUser className="inline-block mr-2" />
                  Seller: {order.seller}
                </p>
                <p className="text-gray-600 text-sm">Qty: {order.quantity}</p>
              </div>


              <div className="flex items-center space-x-1">
                {order.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-white bg-blue-600 px-2 py-1 rounded"
                  >
                    {tag}

                  </span>

                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleRating(order.id, i + 1)}
                    >
                      <IconStar filled={i + 1 <= order.rating} />
                    </button>
                  ))}
                </div>

                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Support
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Do you want to buy more tickets?</h1>
        <button
          onClick={handleNavigation}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          Explore More Tickets

        </button>
      </div>

    </div>
  );
};

export default MyTicketsPage;
