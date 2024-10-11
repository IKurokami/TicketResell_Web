"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";

type Ticket = {
  name: string;
  cost: number;
  location: string;
  startDate: string;
  author: string;
  imageUrl: string;
  description: string;
};

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchTicketById = async (id: string | string[]) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/readbyid/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ticket details");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadresult = async () => {
      if (id) {
        const result = await fetchTicketById(id);
        if (result && result.data) {
          const ticketDetail: Ticket = {
            imageUrl:
              // result.data.image ||
              "https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Use default image if missing
            name: result.data.name || "Unnamed Event",
            startDate: new Date(result.data.startDate).toLocaleDateString(),
            author: result.data.seller?.username || "Unknown Seller",
            location: `Event at ${result.data.location || "Unknown Location"}`,
            cost: result.data.cost || 0,
            description: result.data.description || "No description available",
          };
          setTicketresult(ticketDetail);
        }
        setLoading(false);
      } else {
        console.error("ID is undefined or invalid.");
      }
    };

    loadresult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!ticketresult) {
    return (
      <p className="text-center text-xl mt-8 text-red-600">
        Ticket details could not be loaded. Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-16 bg-gray-50 min-h-screen">
      <main className="container mx-auto px-6 py-10">
        <article className="flex flex-col lg:flex-row gap-8 p-6 rounded-lg">
          <div className="lg:w-5/12">
            <img
              className="w-full rounded-lg shadow-lg mb-6 transform transition duration-300 hover:scale-105"
              src={ticketresult.imageUrl}
              alt={`Image for ${ticketresult.name}`}
              loading="lazy"
            />
            <Dropdown
              title="Description"
              content={ticketresult.description}
              dropdownStatus={false}
              iconDropdown="faList"
            />
          </div>
          <div className="lg:w-7/12">
            <header className="mb-4">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {ticketresult.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Sold by{" "}
                <Link
                  href={`/seller/${ticketresult.author}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {ticketresult.author}
                </Link>
              </p>
              <p className="mb-2 text-gray-500">
                Location: {ticketresult.location}
              </p>
              <p className="mb-4 text-gray-500">
                Date: {ticketresult.startDate}
              </p>
            </header>
            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                {ticketresult.cost.toLocaleString()} VND
              </p>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                  aria-label="Add ticket to cart"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to cart
                </button>
                <button
                  className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                  aria-label="Buy ticket now"
                >
                  <i className="fa-solid fa-cash-register mr-2"></i>
                  Buy Now
                </button>
              </div>
            </div>
            <div className="p-4">
              <Dropdown
                title="Review"
                content="Reviews coming soon."
                dropdownStatus={true}
                iconDropdown="faShop"
              />
            </div>
          </div>
        </article>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Related Tickets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <RelatedTicketCard key={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const RelatedTicketCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
    <img
      src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
      className="w-full h-48 object-cover"
      alt="Related Ticket"
      loading="lazy"
    />
    <div className="p-6">
      <h5 className="text-xl font-semibold mb-3">Related Ticket</h5>
      <p className="text-gray-700 font-bold mb-4">100.000 VND</p>
      <a
        href="#"
        className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        aria-label="Add related ticket to cart"
      >
        Add to cart
      </a>
    </div>
  </div>
);

export default TicketDetail;
