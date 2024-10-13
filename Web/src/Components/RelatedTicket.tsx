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
}

const RelatedTicket: React.FC<RelatedTicketsProps> = ({ categoriesId }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const DEFAULT_IMAGE =
    "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch related tickets based on categoriesId
  useEffect(() => {
    const fetchRelatedTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5296/api/Ticket/getByCate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriesId), // Send categoriesId as JSON body
          }
        );

        const result = await response.json();
        let updatedTickets = await Promise.all(
          result.data.map(async (ticket: any) => {
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
    <div className="ticket--related shadow-md">
      <h2 className="text-2xl font-bold text-center">Related Tickets</h2>
      <div className="movie-grid mx-auto px-10 py-8 no-underline">
        {tickets.map((ticket) => (
          <Link className="no-underline" href={`/ticket/${ticket.ticketId}`}>
          <div
            key={ticket.ticketId}
            className="movie-card-wrapper cursor-pointer no-underline visited:no-underline"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
              <div className="relative">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                  ${ticket.cost}
                </div>
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">
                  {ticket.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{ticket.location}</p>
                <p className="text-sm text-gray-600">
                  {new Date(ticket.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <ul className="flex flex-wrap gap-2 tag--list overflow-hidden">
                  {ticket.categories.map((category) => (
                    <li
                      key={category.categoryId}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold truncate"
                    >
                      {category.name}
                    </li>
                  ))}
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
