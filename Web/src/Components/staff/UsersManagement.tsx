"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
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
  const [activeChats, setActiveChats] = useState<{ user: User; messages: Message[] }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5296/api/User/read")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setUsers(data.data);
        } else {
          console.error("Không thể lấy thông tin người dùng:", data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
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
    // Check if the chat is already open
    const chatExists = activeChats.find(chat => chat.user.userId === user.userId);
    if (!chatExists) {
      setActiveChats([...activeChats, {
        user,
        messages: [
          {
            id: "1",
            senderId: "admin",
            content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
            timestamp: new Date(),
          },
          {
            id: "2",
            senderId: user.userId,
            content: "Chào! Tôi có một câu hỏi về tài khoản của mình.",
            timestamp: new Date(),
          },
        ]
      }]);
    }
  };

  const handleSendMessage = (userId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "admin",
      content: newMessage,
      timestamp: new Date(),
    };

    setActiveChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.user.userId === userId) {
          return { ...chat, messages: [...chat.messages, message] };
        }
        return chat;
      });
    });
    setNewMessage("");
  };

  const handleCloseChat = (userId: string) => {
    setActiveChats(activeChats.filter(chat => chat.user.userId !== userId));
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullname &&
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.gmail && user.gmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      {/* Phần Header và Nội dung không thay đổi */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Người dùng</CardTitle>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              className="px-8 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => { setFormData({}); setIsOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm Người dùng
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Họ tên</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Điện thoại</th>
                <th className="py-3 px-4 text-left">Địa chỉ</th>
                <th className="py-3 px-4 text-left">Hành động</th>
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
                      variant="outline"
                      size="sm"
                      onClick={() => handleChat(user)}
                      className="relative flex items-center justify-center w-10 h-10 rounded-full 
                        bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                        border-none text-white shadow-md
                        hover:shadow-lg hover:scale-105
                        transition-all duration-200 ease-in-out"
                    >
                      <span className="text-xl transition-transform duration-200 group-hover:scale-110 drop-shadow-md">
                        💬
                      </span>
                      <span className="absolute inset-0 rounded-full bg-white opacity-0 
                        hover:opacity-20 transition-opacity duration-200"></span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Hộp thoại Thêm Người dùng không thay đổi */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Thêm Người dùng Mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên</label>
                <Input
                  value={formData.fullname || ""}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.gmail || ""}
                  onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Điện thoại</label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giới tính</label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.sex || ""}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <Button type="submit">Thêm Người dùng</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Render chat windows */}
      <div className="fixed bottom-0 right-0 p-4 flex flex-row-reverse space-x-4 space-x-reverse">
        {activeChats.map((chat) => (
          <div
            key={chat.user.userId}
            className="bg-white shadow-lg rounded-lg p-4 w-90"
          >
            <h3 className="font-bold">{chat.user.fullname}</h3>
            <div className="max-h-60 overflow-y-auto">
              {chat.messages.map((message) => (
                <div key={message.id} className={message.senderId === "admin" ? "text-left" : "text-right"}>
                  <p className={`py-1 px-2 rounded ${message.senderId === "admin" ? "bg-blue-200" : "bg-gray-200"}`}>
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => handleSendMessage(chat.user.userId, e)} className="flex mt-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="submit"><Send /></Button>
              <Button onClick={() => handleCloseChat(chat.user.userId)}>Đóng</Button>
            </form>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UserManagement;