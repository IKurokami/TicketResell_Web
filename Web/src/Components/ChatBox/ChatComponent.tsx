import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import "@/Css/Chatbox.css";
import * as signalR from "@microsoft/signalr";
import { UserData } from "./UserRequest";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  chatId: number;
  date: string | null;
  chatBoxId: number;
}

interface Chatbox {
  chatboxId: number;
  status: number;
  createDate: string;
  title: string;
  description: string;
}

interface ChatProps {
  user: UserData | undefined;
  chatMessages: any[];
  onSendMessage: (message: string, userId: string, chatboxId: number) => void;
  onCloseChat: () => void;
  chatbox: Chatbox | null;
  mode?: "popup" | "fullpage";
}

const Chat: React.FC<ChatProps> = ({
  user,
  chatMessages,
  onSendMessage,
  onCloseChat,
  chatbox,
  mode,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [localChatMessages, setLocalChatMessages] = useState<ChatMessage[]>(chatMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);

  const isRO3 = user?.roles.some((role) => role.roleId === "RO3");
  const isRO4 = user?.roles.some((role) => role.roleId === "RO4");
  const isInputDisabled = !(isRO3 || isRO4) && (chatbox?.status === 3 || chatbox?.status === 0);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    setLocalChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5296/chat-hub", {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        connection.on("ReceiveMessage", (message: ChatMessage) => {
          if (message.chatBoxId === chatbox?.chatboxId) {
            setLocalChatMessages((prev) => [...prev, message]);
            onSendMessage(message.message, message.senderId, message.chatBoxId);
          }
        });
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    createHubConnection();
    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, [chatbox?.chatboxId, onSendMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user?.userId && chatbox) {
      try {
        onSendMessage(newMessage, user.userId, chatbox.chatboxId);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const containerClassName = mode === "popup"
    ? "fixed bottom-0 right-0 w-full max-w-md h-[70vh] bg-white shadow-lg border-t border-l border-gray-200 z-[999]"
    : "fixed inset-0 w-full h-screen bg-white z-[9999]";

  useEffect(() => {
    if (mode === "fullpage") {
      document.body.style.overflow = "hidden";
      document.body.classList.add("chat-fullpage-mode");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("chat-fullpage-mode");
    };
  }, [mode]);

  return (
    <div className={`${containerClassName} flex flex-col`}>
      {/* Header */}
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
          <div className="font-bold text-lg">{chatbox ? chatbox.title : "Chat"}</div>
        </div>
        <button
          onClick={onCloseChat}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-grow overflow-hidden bg-gray-50">
        <div ref={chatContainerRef} className="h-full overflow-y-auto p-4">
          <div className="grid grid-cols-12 gap-y-2">
            {localChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`${
                  msg.senderId === user?.userId
                    ? "col-start-1 col-end-13"
                    : "col-start-1 col-end-13"
                } p-3 rounded-lg`}
              >
                <div
                  className={`flex flex-col ${
                    msg.senderId === user?.userId ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {msg.senderId === user?.userId ? user.fullname : msg.senderId}
                  </span>

                  <div
                    className={`flex ${
                      msg.senderId === user?.userId ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full 
                      ${msg.senderId === user?.userId ? "ml-3" : "mr-3"}
                      ${msg.senderId === user?.userId ? "bg-indigo-500" : "bg-gray-500"}
                      flex-shrink-0 text-white text-sm`}
                    >
                      {msg.senderId === user?.userId ? user.fullname.charAt(0) : "U"}
                    </div>

                    <div
                      className={`relative text-sm
                      ${msg.senderId === user?.userId ? "bg-indigo-100" : "bg-white"}
                      py-2 px-4 shadow rounded-xl w-full max-w-[80%] flex-wrap
                      break-all`}
                    >
                      <div>{msg.message}</div>
                      {msg.date && (
                        <div className="text-xs text-gray-500 mt-1">
                          {msg.date}
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

      {/* Input Area */}
      <div className="h-16 bg-white border-t px-4 flex items-center shrink-0">
        <div className="flex-grow mx-1">
          <div className="relative w-full">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              disabled={isInputDisabled}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          className={`flex items-center justify-center ${
            isInputDisabled
              ? "bg-gray-300"
              : "bg-indigo-500 hover:bg-indigo-600"
          } rounded-xl text-white px-4 py-1 flex-shrink-0`}
          disabled={isInputDisabled}
        >
          <span>Send</span>
          <Send className="ml-2 w-4 h-4 transform rotate-45 -mt-px" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;