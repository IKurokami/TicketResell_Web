import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  chatId: string;
  date: string | null;
  chatboxId: string;
}

interface Chatbox {
  ChatboxId: number;
  Status: number;
  CreateDate: string;
  Title: string;
  Description: string;
}

interface ChatProps {
  user: { userId: string; fullname: string; userole: string };
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, userId: string) => void;
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isInputDisabled = chatbox?.Status === 2;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, user.userId);
      setNewMessage("");
    }
  };

  const containerClassName =
    mode === "popup"
      ? "fixed bottom-0 right-0 w-full max-w-md h-[70vh] bg-white shadow-lg border-t border-l border-gray-200"
      : "w-full h-full bg-white";

  return (
    <div className={containerClassName}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center px-2 border-b bg-white">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-8 w-8 ml-2">
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
        <div className="ml-2 font-bold text-lg">
          {chatbox ? chatbox.Title : "Chat"}
        </div>
        {mode === "popup" ? (
          <button
            onClick={onCloseChat}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onCloseChat}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div className="absolute top-12 bottom-16 left-0 right-0 bg-gray-50 overflow-hidden">
        <div ref={chatContainerRef} className="h-full overflow-y-auto p-4">
          <div className="grid grid-cols-12 gap-y-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`${
                  msg.senderId === user.userId
                    ? "col-start-6 col-end-13"
                    : "col-start-1 col-end-10"
                } p-3 rounded-lg`}
              >
                <div
                  className={`flex ${
                    msg.senderId === user.userId
                      ? "items-center justify-end"
                      : "items-center justify-start"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      msg.senderId === user.userId
                        ? "bg-indigo-500"
                        : "bg-gray-500"
                    } flex-shrink-0 text-white text-sm`}
                  >
                    {msg.senderId === user.userId
                      ? user.fullname.charAt(0)
                      : "U"}
                  </div>
                  <div
                    className={`relative ml-3 text-sm ${
                      msg.senderId === user.userId
                        ? "bg-indigo-100"
                        : "bg-white"
                    } py-2 px-4 shadow rounded-xl min-w-[120px] max-w-[100%] overflow-hidden break-words`}
                  >
                    <div>{msg.message}</div>
                    {msg.date && (
                      <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                        {msg.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t px-4 flex items-center">
        <div className="flex-grow mx-1">
          <div className="relative w-full">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              disabled={isInputDisabled}
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
