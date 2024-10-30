import { MessageCircle } from "lucide-react";
import { FaCheck, FaClock } from "react-icons/fa";
import React, { useState } from "react";
import ChatComponent from "./ChatComponent";
import ConfirmationModal from "@/Components/ChatBox/ConfirmModal";
import Cookies from "js-cookie";

interface Chatbox {
  ChatboxId: number;
  Status: number;
  CreateDate: string;
  Title: string;
  Description: string;
}

interface ChatboxTableProps {
  chatboxData: Chatbox[];
}

const ChatboxTable: React.FC<ChatboxTableProps> = ({ chatboxData }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatbox, setSelectedChatbox] = useState<Chatbox | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialMessages = [
    {
      senderId: "123",
      receiverId: "456",
      message: "Hello! Is this item still available?",
      chatId: "1",
      date: new Date().toLocaleTimeString(),
      chatboxId: "1",
    },
    {
      senderId: "456",
      receiverId: "123",
      message: "Yes, it's available. Are you interested?",
      chatId: "1",
      date: new Date().toLocaleTimeString(),
      chatboxId: "1",
    },
  ];

  const sampleUser = {
    userId: "user123",
    fullname: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: "https://example.com/avatar.jpg",
    userole: "RO1",
  };

  const [chatMessages, setChatMessages] = useState(initialMessages);

  const handleSendMessage = (message: string, userId: string) => {
    const newMessage = {
      senderId: userId,
      receiverId: "456",
      message,
      chatId: "1",
      date: new Date().toLocaleTimeString(),
      chatboxId: "1",
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const openChat = (chatbox: Chatbox) => {
    const accessKey = Cookies.get("confirm");
    if (chatbox.Status === 1 && !accessKey) {
      setSelectedChatbox(chatbox);
      setIsModalOpen(true);
    } else if (chatbox.Status === 1 && accessKey) {
      setSelectedChatbox(chatbox);
      setIsChatOpen(true);
    } else {
      setSelectedChatbox(chatbox)
      setIsChatOpen(true);
    }
  };

  const confirmChatOpen = () => {
    Cookies.set("confirm", "true"); // Set cookie with 1-day expiry
    setIsChatOpen(true); // Open the chat after confirmation
    setIsModalOpen(false); // Close the modal
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 1:
        return { text: "Processing", color: "bg-blue-100 text-blue-800" };
      case 2:
        return { text: "Complete", color: "bg-green-100 text-green-800" };
      case -1:
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Unknown", color: "bg-gray-400 text-white" };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 rounded-t-lg">
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Title
            </th>
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Description
            </th>
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Status
            </th>
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Created Date
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {chatboxData.map((chatbox) => {
            const { text, color } = getStatusLabel(chatbox.Status);
            return (
              <tr
                key={chatbox.ChatboxId}
                className="border-b hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-3 px-4 text-gray-700">{chatbox.Title}</td>
                <td className="py-3 px-4 text-gray-700">
                  {chatbox.Description}
                </td>
                <td className="py-3 px-4 text-center">
                  <div
                    className={`rounded-full ${color} py-1 px-4 inline-block`}
                  >
                    {text}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700 text-center">
                  {new Date(chatbox.CreateDate).toLocaleDateString()}
                </td>
                <td className="items-center py-3 px-4 text-gray-700 text-center">
                  {chatbox.Status === 1 ? (
                    <div className="px-4">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </button>
                    </div>
                  ) : chatbox.Status === 0 ? (
                    <div className="px-5">
                      <FaClock className="text-yellow-500" />
                    </div>
                  ) : chatbox.Status === -1 ? (
                    <div className="pr-14">
                      <i className="fa-solid fa-x text-red-600"></i>
                    </div>
                  ) : (
                    <div className="flex px-4 items-center gap-2">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full p-4 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </button>
                      <FaCheck className="text-green-500" />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isChatOpen && (
        <ChatComponent
          onCloseChat={() => {
            setIsChatOpen(false);
          }}
          user={sampleUser}
          chatMessages={chatMessages}
          chatbox={selectedChatbox}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={confirmChatOpen}
      />
    </div>
  );
};

export default ChatboxTable;
