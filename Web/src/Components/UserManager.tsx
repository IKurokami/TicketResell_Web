import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaSort,
  FaUserCog,
  FaUserSlash,
  FaKey,
} from "react-icons/fa";
import { User } from "@/models/UserManagement";
import Cookies from "js-cookie";
import * as signalR from "@microsoft/signalr";
import UserRequest, { UserData } from "./ChatBox/UserRequest";
import { BlockStatus, ChatMessage } from "./staff/UsersManagement";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "@/Components/ui/button";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  options,
}) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white shadow-lg rounded-lg py-2 z-50 min-w-[200px] border border-gray-200"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            option.onClick();
            onClose();
          }}
          className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
            option.className || "text-gray-700"
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

interface UserManagerProps {
  users: User[];
  onEdit?: (userId: string) => void;
  onDisableAccount?: (userId: string) => void;
  onDisableSeller?: (userId: string) => void;
  onEnableAccount?: (userId: string) => void;
  onResetPassword?: (userId: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  onEdit,
  onDisableAccount,
  onEnableAccount,
  onDisableSeller,
  onResetPassword,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [sortField, setSortField] = useState<
    "fullname" | "userId" | "gmail" | "createDate"
  >("fullname");
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const popupRef = useRef<any>(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);

  const [cookieUser, setCookieUser] = useState<UserData | undefined>(undefined);
  const userId = Cookies.get("id");

  const handleRequestClick = (user: UserData) => {
    setSelectedUser(user);
    setShowRequestPopup(true);
  };

  const [newMessages, setNewMessages] = useState<Record<string, string>>({});
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [blockStatus, setBlockStatus] = useState<BlockStatus>({});

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (
    field: "fullname" | "userId" | "gmail" | "createDate"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    // Setup SignalR
    setupSignalRConnection();

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop();
      }
    };
  }, []); // Empty dependency array for initial load only

  const setupSignalRConnection = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://${process.env.NEXT_PUBLIC_API_URL}/chat-hub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.on("Welcome", (message: any) => {
      console.log(message);
      setConnectionStatus("Connected");
    });

    connection.on("Logged", (message: any) => {
      console.log(message);
      setConnectionStatus("Authenticated");
    });

    connection.on("LoginFail", (message: any) => {
      console.error(message);
      setConnectionStatus("Authentication Failed");
    });

    connection.on("ReceiveMessage", (senderId: string, message: string) => {
      const newMessage: ChatMessage = {
        senderId,
        receiverId: Cookies.get("id") || "",
        message,
        chatId: Date.now().toString(),
        date: new Date().toISOString(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), newMessage],
      }));
    });

    connection.on("Block", (senderId: string, message: string) => {
      console.log(`Block event received for ${senderId}: ${message}`);
      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: true,
      }));
    });

    connection.on("Unblock", (senderId: string, message: string) => {
      console.log(`Unblock event received for ${senderId}: ${message}`);
      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: false,
      }));
    });

    connection.on("UnblockEvent", (senderId: string, message: string) => {
      console.log(
        `moi lan staff bam unlock, ham nay se hoat dong ${senderId}: ${message}`
      );

      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: false,
      }));
    });

    try {
      await connection.start();
      const accessKey = Cookies.get("accessKey");

      if (userId && accessKey) {
        await connection.invoke("LoginAsync", userId, accessKey);
      }
    } catch (err) {
      console.error("Error establishing connection:", err);
      setConnectionStatus("Connection Failed");
    }
  };

  const handleChat = (user: User) => {
    setSelectedUser(user);
    setIsChatOpen((prev) => ({ ...prev, [user.userId]: true }));
    fetchChatMessages(user.userId);
    // Initialize new message for this user
    setNewMessages((prev) => ({ ...prev, [user.userId]: "" }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e.currentTarget.value);
    }
  };

  const handleSendMessage = async (receiverId: string) => {
    if (!newMessages[receiverId].trim() || !hubConnectionRef.current) return;

    try {
      await hubConnectionRef.current.invoke(
        "SendMessageAsync",
        receiverId,
        newMessages[receiverId],
        "CB318b7ea9-ac94-46a9-a40c-807085f384ed" // Nút này chỉnh boxchatId tương ứng
      );
      await hubConnectionRef.current.invoke(
        "UnblockChatbox",
        "CB318b7ea9-ac94-46a9-a40c-807085f384ed",
        receiverId // Nút unblock của staff sẽ xài hàm này
      );

      const newChatMessage: ChatMessage = {
        senderId: Cookies.get("id") || "",
        receiverId,
        message: newMessages[receiverId],
        chatId: Date.now().toString(),
        date: new Date().toISOString(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newChatMessage],
      }));

      // Clear the input for this user after sending the message
      setNewMessages((prev) => ({ ...prev, [receiverId]: "" }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessageDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchChatMessages = async (receiverId: string) => {
    try {
      const senderID = Cookies.get("id");
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chat/get/${senderID}/${receiverId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 200 && data.data) {
        setChatMessages((prev) => ({
          ...prev,
          [receiverId]: data.data,
        }));
      } else {
        console.error("Failed to fetch chat messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = users;

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullname.toLowerCase().includes(searchLower) ||
            user.userId.toLowerCase().includes(searchLower) ||
            user.gmail.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "createDate") {
          return sortDirection === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setFilteredUsers(filtered);
      setCurrentPage(1);
    };

    filterAndSortUsers();
  }, [searchTerm, users, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <FaSort className="w-3 h-3 ms-1.5 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 ms-1.5 ${
          sortDirection === "asc" ? "text-blue-500" : "text-blue-700"
        }`}
      />
    );
  };

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    userId: string;
    isActive: boolean;
    isSeller: boolean;
  } | null>(null);

  const handleContextMenu = useCallback(
    (
      e: React.MouseEvent,
      userId: string,
      isActive: boolean,
      isSeller: boolean
    ) => {
      e.preventDefault();
      const { pageX, pageY } = e;
      setContextMenu({ x: pageX, y: pageY, userId, isActive, isSeller });
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 ">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email tài khoản hoặc email thanh toán"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("fullname")}
                >
                  Tên
                  {getSortIcon("fullname")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("userId")}
                >
                  Email Tài Khoản
                  {getSortIcon("userId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("gmail")}
                >
                  Email Thanh Toán
                  {getSortIcon("gmail")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Vai Trò
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng Thái
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("createDate")}
                >
                  Ngày Tham Gia
                  {getSortIcon("createDate")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                onContextMenu={(e) =>
                  handleContextMenu(
                    e,
                    user.userId,
                    user.status === 1,
                    user.roles.some((role) => role.roleId === "RO2")
                  )
                }
                className="border-b hover:bg-gray-50 transition-colors duration-150 cursor-context-menu"
              >
                <td className="px-6 py-4 font-medium text-gray-900 truncate text-nowrap">
                  {user.fullname || user.username}
                </td>
                <td className="px-6 py-4 text-blue-600">{user.userId}</td>
                <td className="px-6 py-4">{user.gmail}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {role.rolename}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 text-nowrap py-4">
                  {user.status === 1 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Hoạt Động
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Không Hoạt Động
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      user.roles.some(
                        (role) => role.roleId === "RO1" || role.roleId === "RO2"
                      )
                        ? handleRequestClick(user)
                        : handleChat(user);
                    }}
                    className="group relative flex items-center gap-2 px-4 py-2  text-white rounded-full  transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    {user.roles.some(
                      (role) => role.roleId === "RO1" || role.roleId === "RO2"
                    ) ? (
                      <>
                        <Mail className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
            {
              label: "Chỉnh Sửa Người Dùng",
              icon: <FaEdit className="w-4 h-4" />,
              onClick: () => onEdit?.(contextMenu.userId),
            },
            {
              label: contextMenu.isSeller ? "Vô Hiệu Hóa Người Bán" : "",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () => {
                if (contextMenu.isSeller) {
                  onDisableSeller?.(contextMenu.userId);
                }
              },
              className: contextMenu.isSeller ? "text-orange-600" : "hidden",
            },
            {
              label: contextMenu.isActive
                ? "Vô Hiệu Hóa Tài Khoản"
                : "Kích Hoạt Tài Khoản",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () =>
                contextMenu.isActive
                  ? onDisableAccount?.(contextMenu.userId)
                  : onEnableAccount?.(contextMenu.userId),
              className: contextMenu.isActive
                ? "text-orange-600"
                : "text-green-600",
            },
            {
              label: "Đặt Lại Mật Khẩu",
              icon: <FaKey className="w-4 h-4" />,
              onClick: () => onResetPassword?.(contextMenu.userId),
            },
          ]}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
      {Object.keys(isChatOpen)
        .filter((userId) => isChatOpen[userId])
        .map((userId, index) => {
          const user = users.find((u) => u.userId === userId);
          if (!user) return null;

          return (
            <div
              key={userId}
              className={`fixed bottom-4 h-[70vh] bg-white w-full max-w-md shadow-xl rounded-lg overflow-hidden transition-all duration-200 ease-in-out`}
              style={{
                right: `${index * 330 + 30}px`,
              }}
            >
              <div className="h-12 flex justify-between items-center px-4 border-b bg-white shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-8 w-8">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      ></path>
                    </svg>
                  </div>
                  <div className="font-bold text-lg">{user.fullname}</div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    setIsChatOpen((prev) => ({ ...prev, [userId]: false }))
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-hidden bg-gray-50"
              >
                <div className="h-96 overflow-y-auto p-4">
                  {" "}
                  {/* Adjusted height to match ChatComponent */}
                  <div className="grid grid-cols-12">
                    {chatMessages[userId]?.map((msg, i) => (
                      <div
                        key={i}
                        className={`${
                          msg.senderId === Cookies.get("id")
                            ? "col-start-1 col-end-13 text-right"
                            : "col-start-1 col-end-13"
                        } px-2`}
                      >
                        <div
                          className={`flex flex-col ${
                            msg.senderId === Cookies.get("id")
                              ? "items-stretch"
                              : "items-stretch"
                          }`}
                        >
                          <div
                            className={`flex items-center ${
                              msg.senderId === Cookies.get("id")
                                ? "flex-row-reverse"
                                : "flex-row"
                            }`}
                          >
                            <div
                              className={`relative text-sm ${
                                msg.senderId === Cookies.get("id")
                                  ? "bg-indigo-100"
                                  : "bg-white"
                              } py-2 px-4 w-full flex-wrap border-solid border-b-2 border-gray-300 break-all`}
                            >
                              <div
                                className={`flex items-center ${
                                  msg.senderId === Cookies.get("id")
                                    ? "flex-row-reverse"
                                    : "flex-row"
                                } gap-2`}
                              >
                                <div
                                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                                    msg.senderId === Cookies.get("id")
                                      ? "bg-indigo-500"
                                      : "bg-gray-500"
                                  } flex-shrink-0 text-white text-sm`}
                                >
                                  {msg.senderId === Cookies.get("id")
                                    ? user.fullname.charAt(0).toUpperCase()
                                    : msg.senderId.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {msg.senderId === Cookies.get("id")
                                    ? msg.senderId
                                    : user.userId}
                                </div>
                              </div>
                              <div className="w-full text-md">
                                {msg.message}
                              </div>
                              {msg.date && (
                                <div className="text-xs text-gray-500 mt-1 w-full">
                                  {formatMessageDate(msg.date)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-16 bg-white border-t px-4 flex items-center shrink-0">
                <Input
                  value={newMessages[userId] || ""}
                  onKeyDown={handleKeyDown}
                  onChange={(e) =>
                    setNewMessages((prev) => ({
                      ...prev,
                      [userId]: e.target.value,
                    }))
                  }
                  placeholder="Type a message..."
                  className="flex-grow border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
                <Button
                  onClick={() => handleSendMessage(userId)}
                  className={`flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0`}
                >
                  <span>Send</span>
                  <Send className="ml-2 w-4 h-4 transform rotate-45 -mt-px" />
                </Button>
              </div>
            </div>
          );
        })}
      {showRequestPopup && selectedUser && (
        <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
          <div ref={popupRef}>
            <UserRequest userData={selectedUser} userCookie={cookieUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
