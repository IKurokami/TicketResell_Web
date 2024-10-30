import { MessageCircle } from "lucide-react";
import { FaCheck, FaClock } from "react-icons/fa";
import React, { useState } from "react";
import ChatComponent from "./ChatComponent";
import { IoMdClose } from "react-icons/io";

interface Chatbox {
  ChatboxId: number;
  Status: number;
  CreateDate: string;
  Title: string;
  Description: string;
  chatboxId: string;
}

interface ChatboxTableProps {
  chatboxData: Chatbox[];
}

const ChatboxTable: React.FC<ChatboxTableProps> = ({ chatboxData }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatbox, setSelectedChatbox] = useState<Chatbox | null>(null);
  // Add state to manage the chatboxes
  const [chatboxes, setChatboxes] = useState<Chatbox[]>(chatboxData);

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
    userole: "RO3",
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

  // Add handler for status update
  const handleProcessingUpdate = (chatboxId: number) => {
    setChatboxes((prevChatboxes) =>
      prevChatboxes.map((chatbox) =>
        chatbox.ChatboxId === chatboxId ? { ...chatbox, Status: 1 } : chatbox
      )
    );
  };

  const handleRejectsUpdate = (chatboxId: number) => {
    setChatboxes((prevChatboxes) =>
      prevChatboxes.map((chatbox) =>
        chatbox.ChatboxId === chatboxId ? { ...chatbox, Status: -1 } : chatbox
      )
    );
  };

  const handleCompletesUpdate = (chatboxId: number) => {
    setChatboxes((prevChatboxes) =>
      prevChatboxes.map((chatbox) =>
        chatbox.ChatboxId === chatboxId ? { ...chatbox, Status: 2 } : chatbox
      )
    );
  };

  const openChat = (chatbox: Chatbox) => {
    setSelectedChatbox(chatbox);
    setIsChatOpen(true);
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 1:
        return { text: "Processing", color: "bg-blue-100 text-blue-800" };
      case 2:
        return { text: "Complete", color: "bg-green-100 text-green-800" };
      case 3:
        return { text: "Report", color: "bg-red-500 text-white font-bold" };
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
          {chatboxes.map((chatbox) => {
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </button>
                      <button
                        onClick={() => handleCompletesUpdate(chatbox.ChatboxId)}
                        className="group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <FaCheck className="text-gray-500 hover:text-green-500" />
                      </button>
                    </div>
                  ) : chatbox.Status === 0 ? (
                    <div className="flex items-center gap-2">
                      {sampleUser.userole === "RO2" ||
                      sampleUser.userole === "RO1" ? (
                        <FaClock className="pl-10 text-yellow-500" />
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.ChatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.ChatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : chatbox.Status === -1 ? (
                    <div className="pl-12">
                      <IoMdClose className="fa-solid fa-x text-red-600 text-xl" />
                    </div>
                  ) : chatbox.Status === 3 ? (
                    <div className="flex items-center gap-2">
                      {sampleUser.userole === "RO2" ||
                      sampleUser.userole === "RO1" ? (
                        <FaClock className="pl-10 text-yellow-500" />
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.ChatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.ChatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex pl-5 items-center gap-2">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                      </button>
                      <div className="pl-7">
                        <FaCheck className="text-green-500" />
                      </div>
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
    </div>
  );
};

export default ChatboxTable;
