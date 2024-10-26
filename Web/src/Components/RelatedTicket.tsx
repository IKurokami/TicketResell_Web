import React, { useEffect, useState } from "react";
import { fetchImage } from "@/models/FetchImage";
import Link from "next/link";
interface Category {
  categoryId: string;
  name: string;
}

interface Ticket {
  ticketId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  imageUrl: string;
  description: string;
  categories: Category[];
}

interface RelatedTicketsProps {
  categoriesId: string[]; // Pass categoriesId as props
  ticketID: string;
}

const RelatedTicket: React.FC<RelatedTicketsProps> = ({
  categoriesId,
  ticketID,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const DEFAULT_IMAGE =
    "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  // Fetch related tickets based on categoriesId
  useEffect(() => {
    const fetchRelatedTickets = async () => {
      try {
        console.log(ticketID);
        // Fetch data from both APIs
        const [notByCateResponse, byCateResponse] = await Promise.all([
          fetch(`http://localhost:5296/api/Ticket/getnotbyCate/`, {
            // POST request with the category IDs as the body
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriesId), // Sending category IDs in the body
          }), // Assume this is a GET request
          fetch(`http://localhost:5296/api/Ticket/getbyCate/${ticketID}`, {
            // POST request with the category IDs as the body
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriesId), // Sending category IDs in the body
          }),
        ]);

        const notByCateTickets = await notByCateResponse.json();
        const byCateTickets = await byCateResponse.json();
        console.log("DG ngu");
        console.log(byCateTickets);

        // Select at least 2 tickets from each category if possible
        const result = [];

        // Add 2 tickets from getbyCate first
        const byCateSelection = byCateTickets.data.slice(0, 2);
        result.push(...byCateSelection);

        // Add 2 tickets from getnotbyCate
        const notByCateSelection = notByCateTickets.data.slice(0, 2);
        result.push(...notByCateSelection);

        // If result has less than 4 items, fill from the remaining tickets from either API
        if (result.length < 4) {
          const remainingTickets =
            notByCateTickets.length > byCateTickets.length
              ? notByCateTickets.slice(2)
              : byCateTickets.slice(2);

          result.push(...remainingTickets.slice(0, 4 - result.length));
        }
        let updatedTickets = await Promise.all(
          result.map(async (ticket: any) => {
            let imageUrl = DEFAULT_IMAGE; // Default image

            // Check if the ticket has an image and fetch it
            if (ticket.image) {
              const { imageUrl: fetchedImageUrl, error } = await fetchImage(
                ticket.image
              );
              if (fetchedImageUrl) {
                imageUrl = fetchedImageUrl;
              } else {
                console.error(
                  `Error fetching image for ticket ${ticket.ticketId}: ${error}`
                );
              }
            }

            // Return updated ticket object
            return {
              ...ticket,
              imageUrl, // Assign the fetched or default image URL
            };
          })
        );
        setTickets(updatedTickets);

        console.log(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching related tickets:", error);
        setIsLoading(false);
      }
    };

    if (categoriesId.length > 0) {
      fetchRelatedTickets();
    }
  }, [categoriesId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ticket--related">
      <h3 className="text-2xl font-bold text-center">Có thể bạn sẽ thích
      </h3>
      <div className=" mx-auto px-10 py-8 no-underline grid grid-cols-2 lg:grid-cols-4 gap-[1vw] ">
        {tickets.map((ticket) => (
          <Link className="no-underline" href={`/ticket/${ticket.ticketId}`}>
            <div
              key={ticket.ticketId}
              className="movie-card-wrapper cursor-pointer no-underline visited:no-underline transform transition-transform duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    {formatVND(ticket.cost)} 
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {ticket.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {ticket.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list overflow-hidden">
                    {ticket.categories.slice(0, 1).map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {category.name}
                      </li>
                    ))}
                    {ticket.categories.slice(0, 1).map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold hidden xl:block"
                      >
                        {category.name}
                      </li>
                    ))}
                    {ticket.categories.length > 2 && (
                      <li className="bg-gray-300 text-white px-3 rounded-full text-sm font-semibold hidden sm:block">
                        ...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTicket;
