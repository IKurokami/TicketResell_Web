import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Search,
  Send,
  X,
  MessageCircle,
  Mail,
  Cookie,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/Components/ui/input";
import Cookies from "js-cookie";
import * as signalR from "@microsoft/signalr";
import UserRequest from "../ChatBox/UserRequest";

export interface Role {
  roleId: string;
  rolename: string;
  description: string;
}

interface User {
  userId: string;
  username: string;
  fullname: string;
  gmail: string;
  phone: string;
  address: string;
  sex: string;
  status: number;
  birthday: string;
  bio: string;
  roles: Role[];
}
interface UserData {
  userId: string;
  sellConfigId: string | null;
  username: string;
  status: number;
  createDate: string;
  gmail: string;
  fullname: string;
  sex: string;
  phone: string;
  address: string;
  avatar: string | null;
  birthday: string;
  bio: string;
  roles: Role[];
}

interface UsersManagementProps {
  userDetails: UserData | null;
}

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  chatId: string;
  date: string | null;
}
interface BlockStatus {
  [userId: string]: boolean;
}
const UserManagement: React.FC<UsersManagementProps> = ({ userDetails }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const fetchAllUsers = async () => {
    try {
      const usersResponse = await fetch("http://localhost:5296/api/User/read");

      if (!usersResponse.ok) {
        throw new Error(`HTTP error! status: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      console.log("API Response:", usersData); // Debug log

      if (usersData.statusCode === 200 && Array.isArray(usersData.data)) {
        const userData: UserData[] = usersData.data;
        setUsers(userData);
        console.log("Users data set successfully:", userData); // Debug log
      } else {
        console.error("Invalid data format or status code:", usersData);
        setUsers([]); // Set empty array if data is invalid
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      setUsers([]); // Set empty array on error
    }
  };

  const fetchSpecificUser = async () => {
    if (!userId) return;

    try {
      const userResponse = await fetch(
        `http://localhost:5296/api/User/read/${userId}`
      );
      const userCookie = await userResponse.json();
      console.log("API Response:", userCookie);
      if (userCookie.statusCode === 200 && userCookie.data) {
        const userData: UserData = userCookie.data;
        setCookieUser(userData);
        console.log("Setting cookieUser:", userData);
      }
    } catch (error) {
      console.error("Error fetching specific user:", error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchAllUsers();
    console.log("Fetching all users", users);
    fetchSpecificUser();
    console.log("Fetching  users", cookieUser);

    // Setup SignalR
    setupSignalRConnection();

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop();
      }
    };
  }, []); // Empty dependency array for initial load only

  // Add a separate effect to monitor cookieUser changes if needed
  useEffect(() => {
    console.log("cookieUser state updated:", cookieUser);
  }, [cookieUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowRequestPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const setupSignalRConnection = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5296/chat-hub", {
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

  const fetchChatMessages = async (receiverId: string) => {
    try {
      const senderID = Cookies.get("id");
      const response = await fetch(
        `http://localhost:5296/api/Chat/get/${senderID}/${receiverId}`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      userId: `USER${(users.length + 1).toString().padStart(3, "0")}`,
      status: 1,
    } as UserData;
    setUsers([...users, newUser]);
    setIsOpen(false);
    setFormData({});
  };

  const handleChat = (user: User) => {
    setSelectedUser(user);
    setIsChatOpen((prev) => ({ ...prev, [user.userId]: true }));
    fetchChatMessages(user.userId);
    // Initialize new message for this user
    setNewMessages((prev) => ({ ...prev, [user.userId]: "" }));
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
  const handleOrder = (userEmail: any) => {
    // Mở một trang mới với đường dẫn hiển thị đơn hàng
    const orderPageUrl = `/order?email=${encodeURIComponent(userEmail)}`;
    window.open(orderPageUrl, "_blank"); // Mở trang mới
  };
  const loggedInUserId = Cookies.get("id");
  const filteredUsers = users.filter(
    (user) =>
      user.userId !== loggedInUserId && // Loại bỏ người dùng có ID trùng với ID người đăng nhập
      ((user.fullname && user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.userId && user.userId.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const formatMessageDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Add an effect to monitor users state changes
  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <CardTitle>Trạng thái:</CardTitle>
          <span
            className={`text-sm ${
              connectionStatus === "Authenticated"
                ? "text-green-500"
                : connectionStatus === "Connected"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {connectionStatus}
          </span>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              className="px-10 py-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setFormData({});
              setIsOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full py-3 px-6 shadow-md"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Thêm người dùng
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-xl overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b">
              <tr className="border-b">
                <th className="py-3 px-4  text-left whitespace-nowrap">
                  Tên người dùng
                </th>
                <th className="py-3 px-4  text-left whitespace-nowrap">
                  Email
                </th>
                <th className="py-3 px-4  text-left whitespace-nowrap">
                  Số điện thoại
                </th>
                <th className="py-3 px-4 text-left">Địa chỉ</th>
                <th className="px-3 py-4 text-left">Vai trò</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Liên hệ
                </th>
                <th className="py-3 px-4  text-left whitespace-nowrap">
                  Lịch sử đơn hàng
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{user.fullname}</td>
                  <td className="py-3 px-4">{user.userId}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.address}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        user.roles.some(
                          (role) =>
                            role.roleId === "RO1" || role.roleId === "RO2"
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
                  <td className="py-3 px-4 text-center">
                    <Button
                      onClick={() => handleOrder(user.gmail)}
                      variant="default"
                      color="success"
                      className=" font-bold py-2 px-4 rounded shadow-none"
                    >
                      <VisibilityIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {Object.keys(isChatOpen)
          .filter((userId) => isChatOpen[userId])
          .map((userId, index) => {
            const user = users.find((u) => u.userId === userId);
            if (!user) return null;

            return (
              <div
                key={userId}
                className="fixed bottom-4 w-80 bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-200 ease-in-out"
                style={{
                  right: `${index * 330 + 30}px`,
                }}
              >
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600">
                  <h4 className="text-white">{user.fullname}</h4>
                  <button
                    className="text-white"
                    onClick={() =>
                      setIsChatOpen((prev) => ({ ...prev, [userId]: false }))
                    }
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div
                  ref={chatContainerRef}
                  className="p-4 h-80 overflow-y-auto bg-gray-50"
                >
                  {chatMessages[userId]?.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.senderId === Cookies.get("id")
                          ? "items-end"
                          : "items-start"
                      } mb-4`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.senderId === Cookies.get("id")
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {formatMessageDate(msg.date)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t p-3 bg-white">
                  <Input
                    value={newMessages[userId] || ""}
                    onChange={(e) =>
                      setNewMessages((prev) => ({
                        ...prev,
                        [userId]: e.target.value,
                      }))
                    }
                    placeholder="Type a message..."
                    className="flex-grow"
                  />
                  <Button onClick={() => handleSendMessage(userId)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
          <DialogHeader className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.fullname || ""}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={formData.gmail || ""}
              onChange={(e) =>
                setFormData({ ...formData, gmail: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              placeholder="Address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <div className="flex justify-end">
              <Button type="submit">Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {showRequestPopup && selectedUser && (
        <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
          <div ref={popupRef}>
            <UserRequest userData={selectedUser} userCookie={cookieUser} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserManagement;