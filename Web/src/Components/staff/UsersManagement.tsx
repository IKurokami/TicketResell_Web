"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";

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
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [openChats, setOpenChats] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("http://localhost:5296/api/User/read")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setUsers(data.data);
        } else {
          console.error("Lấy danh sách người dùng không thành công:", data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      userId: `USER${(users.length + 1).toString().padStart(3, "0")}`,
      status: 1,
    } as User;
    setUsers([...users, newUser]);
    setIsOpen(false);
    setFormData({});
  };

  const handleChat = (user: User) => {
    setOpenChats((prev) => ({ ...prev, [user.userId]: true }));
    if (!messages[user.userId]) {
      setMessages((prev) => ({
        ...prev,
        [user.userId]: [
          {
            id: "1",
            senderId: "admin",
            content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
            timestamp: new Date(),
          },
        ],
      }));
    }
    setNewMessage((prev) => ({ ...prev, [user.userId]: "" })); // Reset new message for the specific user
  };

  const handleSendMessage = (userId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage[userId]?.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "admin",
      content: newMessage[userId],
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), message],
    }));
    setNewMessage((prev) => ({ ...prev, [userId]: "" })); // Clear the input field for the specific user
  };

  const closeChat = (userId: string) => {
    setOpenChats((prev) => ({ ...prev, [userId]: false }));
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullname &&
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.gmail && user.gmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Card className="bg-white shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-700">Quản lý người dùng</CardTitle>
          <div className="flex space-x-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Tìm người dùng..."
                className="pl-10 py-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-80"
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
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b">
                  <th className="py-3 px-4 font-medium">Họ tên</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Số điện thoại</th>
                  <th className="py-3 px-4 font-medium">Địa chỉ</th>
                  <th className="py-3 px-4 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.fullname}</td>
                    <td className="py-3 px-4">{user.gmail}</td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">{user.address}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChat(user)}
                        className="flex items-center justify-center text-blue-500 hover:text-blue-700"
                      >
                        💬 Chat
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cửa sổ chat mở */}
      <div className="fixed bottom-0 right-0 flex space-x-4 m-4">
        {Object.keys(openChats).map((userId) => {
          if (openChats[userId]) {
            const userChat = users.find(user => user.userId === userId);
            return (
              <div key={userId} className="bg-white shadow-lg rounded-lg w-80">
                <div className="flex justify-between p-3 border-b">
                  <h2 className="font-semibold">{userChat?.fullname}</h2>
                  <button onClick={() => closeChat(userId)} className="text-gray-500 hover:text-gray-700">
                    X
                  </button>
                </div>
                <div className="h-64 overflow-y-auto p-4 flex flex-col space-y-2">
                  {messages[userId]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-2 rounded-lg ${message.senderId === "admin" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                      >
                        <p>{message.content}</p>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => handleSendMessage(userId, e)} className="flex gap-2 p-2 border-t">
                  <Input
                    value={newMessage[userId] || ""}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, [userId]: e.target.value }))}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                  />
                  <Button type="submit" className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

export default UserManagement;
