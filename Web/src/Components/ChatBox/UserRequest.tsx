"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import RequestDialog from "./RequestDialog";
import ChatboxTable from "./RequestForm";
import { Chatbox } from "./ChatComponent";

interface Role {
  roleId: string;
  rolename: string;
  description: string;
}
export interface UserData {
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
interface UserRequestProps {
  userData: UserData | undefined;
  userCookie: UserData | undefined;
}


const UserRequest: React.FC<UserRequestProps> = ({ userData, userCookie }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chatboxData, setChatboxData] = useState<Chatbox[]>([]);

  console.log("Fetching data for ID:", userCookie);

  const fetchChatboxData = async () => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/getall/${userData?.userId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chatbox data");
      }
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setChatboxData(data.data);
      } else {
        console.warn("Received data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbox data:", error);
    }
  };

  useEffect(() => {
    fetchChatboxData();
    console.log("fetch:", chatboxData);
  }, [userData]);

  const hasRO3Role =
    userCookie?.roles?.some((role) => role.roleId === "RO3") ||
    userCookie?.roles?.some((role) => role.roleId === "RO4");
  return (
    <div className="bg-white py-12 px-10 rounded-xl ">
      <p
        className={`text-2xl pb-10 text-center font-bold ${
          !hasRO3Role ? "pt-20" : ""
        } `}
      >
        Request table
      </p>
      <div
        className={`container mx-auto px-5 flex flex-col  justify-between  sm:flex-row items-center`}
      >
        {!hasRO3Role && (
          <div className="relative flex items-center bg-gray-100 mb-5 rounded-full px-4 h-12 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search requests"
              className="border-none outline-none items-center bg-transparent w-96 text-gray-700 placeholder-gray-400 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              className="text-gray-500 cursor-pointer"
              icon={faMagnifyingGlass}
            />
          </div>
        )}
        {hasRO3Role && (
          <div className="relative flex  items-center bg-gray-100 mb-5 rounded-full px-4 h-12 w-full sm:w-96">
            <input
              type="text"
              placeholder="Search requests"
              className="border-none outline-none items-center bg-transparent w-96 text-gray-700 placeholder-gray-400 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              className="text-gray-500 cursor-pointer"
              icon={faMagnifyingGlass}
            />
          </div>
        )}
        <div></div>
        {!hasRO3Role && <RequestDialog setChatboxData={setChatboxData} />}
      </div>
      <div className="flex justify-center w-full ">
        <div className="w-full max-w-7xl">
          {/* Set a max-width for the card container */}
          <ChatboxTable
            userData={userData}
            chatboxData={chatboxData}
            userCookie={userCookie}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
