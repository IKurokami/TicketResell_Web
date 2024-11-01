import { MessageCircle } from "lucide-react";
import { FaCheck, FaClock } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import ChatComponent from "./ChatComponent";
import ConfirmationModal from "@/Components/ChatBox/ConfirmModal";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { UserData } from "./UserRequest";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface Chatbox {
  chatboxId: number;
  status: number;
  createDate: string;
  title: string;
  description: string;
}

interface ChatboxTableProps {
  userData: UserData | undefined;

  userCookie: UserData | undefined;

  chatboxData: Chatbox[];
}

interface ChatMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string;
  chatId: number;
  chatBoxId: number;
  date: string;
}

const ChatboxTable: React.FC<ChatboxTableProps> = ({
  userData,
  chatboxData,
  userCookie,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatbox, setSelectedChatbox] = useState<Chatbox | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatboxes, setChatboxes] = useState<Chatbox[]>(chatboxData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );

  useEffect(() => {
    setChatboxes(chatboxData);
  }, [chatboxData]);

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5296/chat-hub", {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("SignalR Connected!");

        const userId = Cookies.get("id");
        const accessKey = Cookies.get("accessKey");

        if (userId && accessKey) {
          await connection.invoke("LoginAsync", userId, accessKey);
        }

        // Set up event handlers
        connection.on("Welcome", (message) => {
          console.log("Welcome:", message);
        });

        connection.on("Logged", (message) => {
          console.log("Authenticated:", message);
        });

        connection.on("LoginFail", (message) => {
          console.error("Authentication Failed:", message);
        });

        connection.on("ReceiveMessage", (senderId: string, message: string, chatBoxId: number) => {
          const newMessage: ChatMessage = {
            senderId,
            receiverId: Cookies.get("id") || "",
            message,
            chatId: chatBoxId,
            chatBoxId: chatBoxId,
            date: new Date().toISOString(),
          };
          
          setChatMessages(prevMessages => [...prevMessages, newMessage]);
          console.log("New message received:", newMessage);
        });

        connection.on("Blocked", (senderId: string, message: string) => {
          console.log(`Block event received for ${senderId}: ${message}`);
          // Handle blocking logic if needed
        });

        connection.on("Unblock", (senderId: string, message: string) => {
          console.log(`Unblock event received for ${senderId}: ${message}`);
          // Handle unblocking logic if needed
        });

        setHubConnection(connection);
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    createHubConnection();

    return () => {
      hubConnection?.stop();
    };
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (userData?.userId) {
        try {
          const response = await fetch(
            `http://localhost:5296/api/Chat/getValidChats/${userData.userId}`
          );
          const result = await response.json();
          console.log(result.data);

          if (result.statusCode === 200) {
            setChatMessages(result.data);
          }
        } catch (error) {
          console.error("Error fetching chat messages:", error);
        }
      }
    };

    fetchChatMessages();
  }, [userData]);

  const handleSendMessage = async (message: string, userId: string | undefined) => {
    if (!selectedChatbox || !userData || !hubConnection) return;

    try {
      const  receiveId= userCookie?.userId == chatMessages[0].senderId?chatMessages[0].receiverId:chatMessages[0].senderId;
      
      const newMessage: ChatMessage = {
        senderId: userId,
        receiverId: receiveId,
        message: message,
        chatId: selectedChatbox.chatboxId,
        chatBoxId: selectedChatbox.chatboxId,
        date: new Date().toISOString(),
      };

      await hubConnection.invoke(
        "SendMessageAsync",
        receiveId,
        message,
        selectedChatbox.chatboxId
      );

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const isRO3 = userData?.roles.some((role) => role.roleId === "RO3");
  console.log(isRO3);

  const openChat = async (chatbox: Chatbox) => {
    // Fetch chat messages for this specific chatbox
    if (userCookie?.userId) {
      try {
        const response = await fetch(
          `http://localhost:5296/api/Chat/getValidChats/${userCookie?.userId}`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (result.statusCode === 200) {
          setChatMessages(result.data);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    }

    const accessKey = Cookies.get("confirm");
    const isRO1 = userCookie?.roles.some((role) => role.roleId === "RO1");
    const isRO2 = userCookie?.roles.some((role) => role.roleId === "RO2");

    // Determine if modal should be shown
    if (chatbox.status === 2 && !accessKey && (isRO1 || isRO2)) {
      setSelectedChatbox(chatbox);
      setIsModalOpen(true);
    } else {
      setSelectedChatbox(chatbox);
      setIsChatOpen(true);
    }
  };

  const confirmChatOpen = () => {
    Cookies.set("confirm", "true");
    setIsChatOpen(true);
    setIsModalOpen(false);
  };

  const handleProcessingUpdate = async (chatboxId: number) => {
    try {
      // Call the map request API
      const mapResponse = await fetch(
        `http://localhost:5296/api/Chat/maprequest/${userData?.userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!mapResponse.ok) {
        throw new Error("Failed to map request");
      }

      // Update the local state
      setChatboxes((prevChatboxes) =>
        prevChatboxes.map((chatbox) =>
          chatbox.chatboxId === chatboxId ? { ...chatbox, status: 2 } : chatbox
        )
      );
    } catch (error) {
      console.error("Error updating chatbox status:", error);
    }
  };

  const handleRejectsUpdate = async (chatboxId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Chatbox/rejectchat/${chatboxId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChatboxes((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, Status: 8 }
              : chatbox
          )
        );
      } else {
        console.error("Failed to reject chatbox");
      }
    } catch (error) {
      console.error("Error rejecting chatbox:", error);
    }
  };

  const handleCompletesUpdate = async (chatboxId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Chatbox/closeboxchat/${chatboxId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChatboxes((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, Status: 0 }
              : chatbox
          )
        );
      } else {
        console.error("Failed to update chatbox status");
      }
    } catch (error) {
      console.error("Error updating chatbox status:", error);
    }
  };
  const handleUnlockUpdate = async (chatboxId: number) => {
    try {
      // Call the map request API
      const mapResponse = await fetch(
        `http://localhost:5296/api/Chat/processing/${chatboxId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!mapResponse.ok) {
        throw new Error("Failed to map request");
      }

      // Update the local state
      setChatboxes((prevChatboxes) =>
        prevChatboxes.map((chatbox) =>
          chatbox.chatboxId === chatboxId ? { ...chatbox, status: 2 } : chatbox
        )
      );
    } catch (error) {
      console.error("Error updating chatbox status:", error);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 2:
        return { text: "Processing", color: "bg-blue-100 text-blue-800" };
      case 0:
        return { text: "Complete", color: "bg-green-100 text-green-800" };
      case 3:
        return {
          text: "Blocking",
          color: "bg-gray-300 text-gray-500 font-bold",
        };
      case 8:
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Report", color: "bg-red-500 text-white font-bold" };
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
            const { text, color } = getStatusLabel(chatbox.status);
            return (
              <tr
                key={chatbox.chatboxId}
                className="border-b hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-3 px-4 text-gray-700">{chatbox.title}</td>
                <td className="py-3 px-4 text-gray-700">
                  {chatbox.description}
                </td>
                <td className="py-3 px-4 text-center">
                  <div
                    className={`rounded-full ${color} py-1 px-4 inline-block`}
                  >
                    {text}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700 text-center">
                  {new Date(chatbox.createDate).toLocaleDateString()}
                </td>
                <td className="items-center py-3 px-4 text-gray-700 text-center">
                  {chatbox.status === 2 ? (
                    <div className="flex justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <button
                          onClick={() => openChat(chatbox)}
                          className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                          </button>

                          <button
                            onClick={() =>
                              handleCompletesUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : chatbox.status === 1 ? (
                    <div className="flex items-center justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <div className="flex justify-center">
                          <FaClock className=" text-yellow-500 " />
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pl-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : chatbox.status === 8 ? (
                    <div className="flex justify-center">
                      <IoMdClose className="fa-solid fa-x text-red-600 text-xl" />
                    </div>
                  ) : chatbox.status === 0 ? (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                      </button>
                      <div className="pl-4">
                        <FaCheck className="text-green-500" />
                      </div>
                    </div>
                  ) : chatbox.status === 3 ? (
                    <div className="flex justify-center items-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <button
                          onClick={() => openChat(chatbox)}
                          className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockUpdate(chatbox.chatboxId)}
                          className="group relative flex items-center gap-2  py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <FaUnlockKeyhole className="text-gray-500 hover:text-blue-500" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <FaClock className=" text-yellow-500" />
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pl-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
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
          user={userCookie}
          chatMessages={chatMessages}
          chatbox={selectedChatbox}
          onSendMessage={handleSendMessage}
          mode={
            userCookie?.roles.some((roles) => roles.roleId === "RO3" || roles.roleId === "RO4")
              ? "popup"
              : "fullpage"
          }
        />
      )}

      <ConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={confirmChatOpen}
      />
    </div>
  );
};

export default ChatboxTable;
