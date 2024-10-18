"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DateFilter from "@/Components/datefilter"; // Đường dẫn đến file chứa DateFilter
import { fetchImage } from "@/models/FetchImage";
import Cookies from "js-cookie";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCode
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Custom icon components

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
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false); // State cho modal QR code

  const router = useRouter(); // Ensure this line is present
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const buyerid = Cookies.get("id");
        const response = await fetch(
          `http://localhost:5296/api/orderdetail/buyer/${buyerid}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          const transformedOrders = await Promise.all(
            result.data.map(async (order: any, index: number) => {
              let image =
                "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/8932451";

              if (order.ticket.image) {
                const { imageUrl: fetchedImageUrl, error } = await fetchImage(
                  order.ticket.image
                );

                if (fetchedImageUrl) {
                  image = fetchedImageUrl;
                } else {
                  console.error(
                    `Error fetching image for ticket ${order.ticket.ticketId}: ${error}`
                  );
                }
              }

              return {
                id: index + 1,
                ticket: order.ticket.name,
                status:
                  new Date(order.ticket.startDate) > new Date()
                    ? "Sắp Diễn Ra"
                    : "Đã Hết Hạn", // Compare startDate with current date
                date: new Date(order.ticket.startDate).toLocaleString(), // Formatting the date
                totalprice: `${order.price * order.quantity} VND`, // Calculating the total price
                seller: order.ticket.seller.fullname,
                quantity: order.quantity,
                imgURL: image, // Placeholder image URL
                Categorys: order.ticket.Categorys || [], // Giá trị mặc định nếu không có Categorys
                location: order.ticket.location || "Unknown", // Add the location field
              };
            })
          );

          setOrders(transformedOrders);
        } else {
          console.error("Failed to fetch orders:", result.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleNavigation = () => {
    router.push("/search"); // Navigate to the /search page
  };
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLocation = (orderId: any, location: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, location } : order
      )
    );
  };
  const handleShowDetail = (order: any) => {
    setSelectedTicket(order); // Set the selected ticket
    setIsModalOpen(true); // Open the modal
  };
  const handleCloseModalDetail = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedTicket(null); // Clear the selected ticket
  };
  const handleShowQR = (order: any) => {
    setSelectedTicket(order); // Set the selected ticket for QR code
    setIsQRCodeModalOpen(true); // Open the QR code modal
  };

  const handleCloseQRCodeModal = () => {
    setIsQRCodeModalOpen(false); // Close the QR code modal
    setSelectedTicket(null); // Clear the selected ticket
  };

  const [selectedDate, setSelectedDate] = useState(""); // Thêm trạng thái cho bộ lọc ngày
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesCategory =
      selectedCategory === "All" || order.Categorys.includes(selectedCategory);
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchesSearch = order.ticket
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || order.date.startsWith(selectedDate); // So khớp theo ngày

    return matchesCategory && matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div className="mt-24 min-h-screen w-full bg-gray-50 py-12 px-6 sm:px-8 lg:px-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Danh Sách Vé Của Tôi
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="relative w-full sm:w-1/3 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder=" Khám phá sự kiện hoặc người bán"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div className="absolute right-3 top-3">
            <IconSearch />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="w-full sm:w-auto relative mt-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23000000'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 1rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem", // Adjusted size for better visibility
              }}
            >
              <option value="All">Thể Loại</option>
              <option value="Sport">Thể Thao</option>
              <option value="Comedy">Hài Kịch</option>
              <option value="Horror">Kinh Dị</option>
              <option value="Romance">Tình Cảm</option>
              <option value="Musical">Âm Nhạc</option>
            </select>
          </div>

          <div className="w-full sm:w-auto relative mt-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23000000'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 1rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem", // Adjusted size for better visibility
              }}
            >
              <option value="All"> Trạng Thái</option>
              <option value="Coming Soon">Sắp Diễn Ra</option>
              <option value="Expired">Đã Hết Hạn</option>
            </select>
          </div>

          {/* Date Filter */}
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          {/* Reset Button */}
          <div className="w-full sm:w-auto">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedStatus("All");
                setSelectedDate("");
                setSearchTerm("");
              }}
              className="mt-4 px-2 py-1 bg-gray-200 text-gray-600 rounded focus:outline-none focus:ring focus:ring-gray-400"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={order.imgURL}
              alt={order.ticket}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{order.ticket}</h2>
              <p
                className={`text-sm mb-4 p-2 rounded-full w-auto h-auto flex items-center justify-center ${
                  order.status === "Sắp Diễn Ra"
                    ? "bg-blue-50 text-blue-500 font-bold"
                    : order.status === "Đã Hết Hạn"
                    ? "bg-red-50 text-red-500 font-bold"
                    : "bg-gray-100 text-gray-500"
                }`}
                style={{ width: "fit-content", height: "fit-content" }} // Đảm bảo chiều rộng và chiều cao tự động theo nội dung
              >
                {order.status}
              </p>

              <div className="flex flex-col mb-4 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 text-sm font-medium flex items-center">
                    👤 Người bán vé:
                  </p>
                  <p className="text-gray-800 text-sm font-semibold">
                    {order.seller}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 text-sm font-medium flex items-center">
                    💵 Tổng cộng:
                  </p>
                  <p className="text-gray-800 text-sm font-semibold">
                    {order.totalprice}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-800 text-sm font-semibold">
                    {order.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {order.Categorys.map((Category: any, index: number) => (
                  <span
                    key={index}
                    className="text-xs text-white bg-blue-600 px-2 py-1 rounded"
                  >
                    {Category}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleShowQR(order)}
                  className="w-50% bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
                >
                  Mã vé của bạn
                </button>
                <button
                  onClick={() => handleShowDetail(order)}
                  className="w-50% bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal hiển thị QR và location */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Nút X để đóng modal */}
            <button
              onClick={handleCloseModalDetail}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &#10005; {/* Ký tự "X" */}
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              Thông Tin Sự Kiện
            </h2>
            <p className="text-sm mb-2 text-center">
              📅 Ngày diễn ra: {selectedTicket.date}
            </p>
            <p className="text-sm mb-2 text-center">
              📍 Vị Trí: {selectedTicket.location}
            </p>
            <p className="text-sm mb-2 text-center">
              🎫 Số lượng vé: {selectedTicket.quantity}
            </p>
            {/* Google Map hiển thị dưới thông tin vé */}
            <div className="mb-4">
              <LoadScript googleMapsApiKey="AlzaSyZm3kzU9IJgXD3oBUdsCjTDiyxushApIYq">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "350px" }}
                  center={{ lat: 10.762622, lng: 106.660172 }} // Tọa độ trung tâm (có thể thay đổi theo vị trí thực tế)
                  zoom={15}
                >
                  <Marker position={{ lat: 10.762622, lng: 106.660172 }} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      )}
      {/* Modal hiển thị QR Code */}
      {isQRCodeModalOpen && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={handleCloseQRCodeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &#10005; {/* Ký tự "X" */}
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              Mã Vé: {selectedTicket.ticket}
            </h2>

            {/* Scrolling container for QR Codes */}
            <div
              className={`flex flex-col items-center mb-4 ${
                selectedTicket.quantity === 1
                  ? "max-h-none"
                  : "max-h-[300px] overflow-y-auto"
              }`}
            >
              {Array.from({ length: selectedTicket.quantity }, (_, index) => (
                <div key={index} className="mb-2">
                  <QRCodeCanvas
                    value={JSON.stringify(selectedTicket)} // Thay đổi giá trị nếu cần
                    size={256} // Kích thước QR code
                  />
                  <p className="text-center mt-4">Vé {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-12">
          Bạn có muốn khám phá thêm những lựa chọn khác?
        </h1>
        <button
          onClick={handleNavigation}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          Xem thêm vé
        </button>
      </div>
    </div>
  );
};

export default MyTicketsPage;
