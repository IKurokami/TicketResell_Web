"use client";
import React, { useState, useEffect } from "react";

import { TicketCard, fetchTicketItems } from "@/models/TicketSellCard";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Popup from "./PopupDelete"; // Adjust the path based on your file structure

const TicketsPage = () => {
  const [ticketItems, setTicketItems] = useState<TicketCard[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const items = await fetchTicketItems();
      console.log(items);
      setTicketItems(items);
    } catch (error) {
      console.error("Error fetching ticket items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setPopupVisible(true); // Show the confirmation popup
  };

  return (
    <div className="pt-20 pb-20">
      <div className="flex mx-auto p-2 bg-white  ">
        {/* Sidebar */}
        <div className="w-1/5 p-2 mt-3   bg-white-100 pt-2">
          <ul className="flex  flex-col p-0 ">
            <li className="mb-2">
              <a
                className="block font-bold no-underline rounded-lg text-black p-2 hover:shadow-md transition-shadow duration-300 active:bg-green-500 active:text-white"
                href="#"
              >
                Tickets
              </a>
            </li>
            <li className="mb-2">
              <a
                className="block font-bold no-underline rounded-lg text-black p-2 hover:shadow-md transition-shadow duration-300  active:bg-green-500 active:text-white "
                href="#"
              >
                Transaction
              </a>
            </li>
            <li className="mb-2">
              <a
                className="block font-bold no-underline rounded-lg text-black p-2 hover:shadow-md transition-shadow duration-300  active:bg-green-500 active:text-white "
                href="#"
              >
                Revenue
              </a>
            </li>
            {/* <li className="mb-2">
              <a className="block font-bold no-underline text-black p-2 hover:shadow-md transition-shadow duration-300" href="#">
                Profile
              </a>
            </li> */}
          </ul>
        </div>

        {/* Content */}
        <div className="w-4/5 -mx-8">
          {/* Search Navigation */}
          <div className="flex justify-between items-center p-4  rounded-full w-2/5 ">
            <div className="flex items-center  bg-white rounded-full p-1 border border-gray-300">
              <span className=" p-2 hover:shadow-md  transition-shadow  cursor-pointer">
                ≡
              </span>
              <input
                type="text"
                placeholder="Search ticket"
                className="border-none outline-none p-1 bg-transparent"
              />
              
              <FontAwesomeIcon className="text-lg p-1 cursor-pointer" icon={faMagnifyingGlass} />
            </div>
            <div className=" flex justify-center p-1 mx-16 lg:w-full  rounded-full border border-gray-300  hover:text-gray-600">
            <Link href={`/addticket`} >
              <FontAwesomeIcon
                className="w-full  text-black  text-base "
                icon={faPlus}
              />
            </Link>
            </div > 
          </div>

          {/* Tickets Section */}
          <div className="mt-1">
            <div className="flex flex-wrap mx-1">
              {ticketItems.length > 0 ? (
                ticketItems.map((ticketItem) => (
                  <div
                    key={ticketItem.id}
                    className="w-full sm:w-1/2 lg:w-1/4 p-2 mb-5"
                  >
                    <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                      <div className="relative">
                        <img
                          src={ticketItem.imageUrl}
                          alt={ticketItem.name}
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute no-underline top-0 right-0 hover:bg-gray-400">
                        <Link href={`/updateticket/${ticketItem.id}`} >
                          <FontAwesomeIcon className="no-underline text-gray-100" icon={faPenToSquare} />
                          </Link>
                        </div>
                      </div>
                      <div className=" mt-2 p-1 max-h-60 ">
                        <div className="flex justify-between  ">
                          <p className=" font-bold text-lg ">
                            {ticketItem.name}
                          </p>
                          <p className="text-green-600 font-bold">
                            ${ticketItem.price}
                          </p>
                        </div>
                        <p className="text-gray-600 "> {ticketItem.location}</p>
                        <p className="text-gray-600">{ticketItem.date}</p>
                        <div className="flex flex-wrap space-x-1">
                          {ticketItem.categories.slice(0, 2).map((category) => (
                            <p
                              key={category.categoryId}
                              className="bg-green-400 flex justify-center  px-3 py-0.5 rounded-full text-sm font-semibold"
                            >
                              {category.name}
                            </p>
                          ))}
                          {ticketItem.categories.length > 2 && (
                            <p className="bg-gray-300 text-white px-3 rounded-full text-sm font-semibold">
                              ...
                            </p>
                          )}
                        </div>

                        <div className="flex  p-1 mt-4  justify-end">
                          <FontAwesomeIcon
                            className="text-red-600  cursor-pointer"
                            icon={faTrash}
                            onClick={() => handleDeleteTicket(ticketItem.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Not found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup for delete confirmation */}
      <Popup
        isVisible={isPopupVisible}
        onClose={() => {
          setPopupVisible(false);
          fetchItems();
        }}
        ticketId={ticketToDelete || ""}
      />
    </div>
  );
};

export default TicketsPage;
