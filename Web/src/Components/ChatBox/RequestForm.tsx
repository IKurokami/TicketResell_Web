import { MessageCircle } from "lucide-react";
import { FaCheck, FaClock, FaLock } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import ChatComponent from "./ChatComponent";
import ConfirmationModal from "@/Components/ChatBox/ConfirmModal";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { UserData } from "./UserRequest";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

interface Chatbox {
  chatboxId: string;
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
  chatId: string;
  date: string;
}

const ChatboxTable: React.FC<ChatboxTableProps> = ({
  userData,
  chatboxData,
  userCookie,
}) => {
  console.log("userData", userData);
  console.log("chatboxData", chatboxData);
  console.log("userCookie", userCookie);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatbox, setSelectedChatbox] = useState<Chatbox | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatboxes, setChatboxes] = useState<Chatbox[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const selectedChatboxRef = useRef<Chatbox | null>(null);

  useEffect(() => {
    setChatboxes(chatboxData);
  }, [chatboxData]);

  useEffect(() => {
    selectedChatboxRef.current = selectedChatbox;
  }, [selectedChatbox]);

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`http://${process.env.NEXT_PUBLIC_API_URL}/chat-hub`, {
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

        connection.on("ReceiveMessage", (senderId: string, message: string) => {
          const newMessage: ChatMessage = {
            senderId,
            receiverId: Cookies.get("id"),
            message,
            chatId: "",
            date: new Date().toISOString(),
          };

          console.log("New message object:", newMessage);
          setChatMessages((prev) => {
            const updated = [...prev, newMessage];
            return updated;
          });
        });

        connection.on("Block", (senderId: string, message: string) => {
          console.log(`Block event received for ${senderId}: ${message}`);

          // Update the chatboxes state
          setChatboxes((prev) =>
            prev.map((chatbox) =>
              chatbox.chatboxId === selectedChatbox?.chatboxId
                ? { ...chatbox, status: 3 }
                : chatbox
            )
          );

          // Also update the selectedChatbox if it's the one being blocked
          if (selectedChatbox) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 3 } : prev
            );
          }
        });

        connection.on("UnblockEvent", (receiverId: string, message: string) => {
          console.log(`Unblock ${receiverId}: ${message}`);

          setChatboxes((prev) =>
            prev.map((chatbox) =>
              chatbox.chatboxId === selectedChatboxRef.current?.chatboxId
                ? { ...chatbox, status: 2 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 2 } : prev
            );
          }
        });

        connection.on("BlockedChatEvent", (chatboxId: string) => {
          console.log(`BlockedChatEvent received for chatboxId: ${chatboxId}`);

          setChatboxes((prev) =>
            prev.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 3 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 3 } : prev
            );
          }
        });

        setHubConnection(connection);
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    // Only create connection if it doesn't exist
    if (!hubConnection) {
      createHubConnection();
    }

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, []); // Empty dependency array since we only want to create the connection once

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (userData?.userId) {
        try {
          const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chat/getValidChats/${userData.userId}`,
            {
              method: "GET", // Specify the method if needed
              credentials: "include", // Include credentials
            }
          );
          const result = await response.json();

          if (result.statusCode === 200 && Array.isArray(result.data)) {
            setChatMessages(result.data);
          } else {
            console.error("Fetched data is not an array:", result.data);
          }
        } catch (error) {
          console.error("Error fetching chat messages:", error);
        }
      }
    };

    fetchChatMessages();
  }, [userData]);

  const handleSendMessage = async (
    message: string,
    userId: string | undefined
  ) => {
    if (!selectedChatbox || !userData || !hubConnection) return;

    try {
      const receiveId =
        userCookie?.userId == chatMessages[0].senderId
          ? chatMessages[0].receiverId
          : chatMessages[0].senderId;

      const newMessage: ChatMessage = {
        senderId: userId,
        receiverId: receiveId,
        message: message,
        chatId: selectedChatbox.chatboxId,
        date: new Date().toISOString(),
      };

      await hubConnection.invoke(
        "SendMessageAsync",
        receiveId,
        message,
        selectedChatbox.chatboxId
      );

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      // Check if the user does NOT have roles RO3 or RO4
      const hasRestrictedRole = userCookie?.roles.some(
        (role) => role.roleId === "RO3" || role.roleId === "RO4"
      );

      if (!hasRestrictedRole) {
        // Update the status of the selected chatbox to 3
        const updatedChatbox: Chatbox = {
          ...selectedChatbox,
          status: 3,
        };
        setSelectedChatbox(updatedChatbox);

        // Update the chatboxes array with the updated chatbox
        setChatboxes((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === updatedChatbox.chatboxId
              ? updatedChatbox
              : chatbox
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const openChat = async (chatbox: Chatbox) => {
    // Fetch chat messages for this specific chatbox
    if (userCookie?.userId) {
      try {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chat/getChatsByBoxchatId/${chatbox.chatboxId}`,
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

  const handleProcessingUpdate = async (chatboxId: string) => {
    try {
      // Call the map request API
      const mapResponse = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chat/maprequest/${userData?.userId}`,
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

  const handleRejectsUpdate = async (chatboxId: string) => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/rejectchat/${chatboxId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChatboxes((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, status: 8 }
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

  const handleCompletesUpdate = async (chatboxId: string) => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/closeboxchat/${chatboxId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChatboxes((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, status: 0 }
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
  const handleUnlockUpdate = async (chatboxId: string) => {
    try {
      const receiverID = userData?.userId;
      console.log("receiverID", receiverID);
      if (hubConnection) {
        await hubConnection.invoke("UnblockChatbox", chatboxId, receiverID);
      } else {
        console.error("Hub connection is not established.");
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

  // Add this function to fetch chatbox data for specific users
  const fetchChatboxData = async () => {
    if (!userCookie?.userId || !userData?.userId) {
      console.log("Missing user IDs for fetch");
      return;
    }

    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chat/get/${userCookie.userId}/${userData.userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const latestData = await response.json();
        if (Array.isArray(latestData)) {
          setChatboxes(latestData);
        } else {
          console.error("Fetched chatbox data is not an array:", latestData);
        }
      } else {
        console.error("Failed to fetch chatbox data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching chatbox data:", error);
    }
  };

  // Add polling effect to check for updates
  useEffect(() => {
    // Initial fetch
    fetchChatboxData();

    // Set up polling interval
    const pollInterval = setInterval(() => {
      fetchChatboxData();
    }, 5000); // Polls every 5 seconds

    // Cleanup on component unmount
    return () => clearInterval(pollInterval);
  }, [userCookie?.userId, userData?.userId]); // Dependencies include both user IDs

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
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          </button>
                          <div className="pl-4">
                            <FaLock className="text-gray-500 hover: text-blue-500" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          </button>
                          <button
                            onClick={() =>
                              handleUnlockUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2  py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaUnlockKeyhole className="text-gray-500 hover:text-blue-500" />
                          </button>
                        </div>
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
            userCookie?.roles.some(
              (roles) => roles.roleId === "RO3" || roles.roleId === "RO4"
            )
              ? "popup"
              : "fullpage"
          }
          disableInput={
            selectedChatbox?.status === 3 &&
            !userCookie?.roles.some(
              (role) => role.roleId === "RO3" || role.roleId === "RO4"
            )
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
