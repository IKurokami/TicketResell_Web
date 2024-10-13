import React from "react";
import Link from "next/link";
import { getCategoryNames } from "../models/TicketFetch";

interface TicketGridProps {
  paginatedTickets: any[];
}

const TicketGrid: React.FC<TicketGridProps> = ({ paginatedTickets }) => {
  return (
    <section>
      {/* Ticket Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedTickets.length > 0 ? (
          paginatedTickets.map((ticket, index) => (
            <Link
              className="no-underline"
              href={`/ticket/${ticket.ticketId}`}
              key={index}
              passHref
            >
              <div className="movie-card-wrapper cursor-pointer">
                <div className="bg-transparent rounded-2xl shadow overflow-hidden movie-card flex flex-col h-full transition-transform duration-300 ease-in-out transform hover:scale-105 hover:z-10">
                  <div className="relative flex-grow">
                    <img
                      src={
                        ticket.imageUrl ||
                        "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                      }
                      alt={ticket.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-2xl">
                      ${ticket.cost}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
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
                      })}
                    </p>
                    <div className="tokenize-wrapper mt-2">
                      {/* Ensure the categories section is present, even if empty */}
                      <div className="flex flex-wrap">
                        {getCategoryNames(ticket)
                          .split(",")
                          .filter((category) => category.trim() !== "")
                          .map((category) => (
                            <span
                              key={category}
                              className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 text-sm"
                            >
                              {category.trim()}
                            </span>
                          ))}
                      </div>
                      {/* Fallback for empty categories */}
                      {getCategoryNames(ticket).trim() === "" && (
                        <span
                          key="No categories"
                          className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 text-sm"
                        >
                          No categories
                        </span>
                      )}
                    </div>
                    <div className="card-content mt-auto">
                      <p className="text-sm text-gray-700">
                        An exciting event you won't want to miss!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No results match your search criteria.
          </p>
        )}
      </div>
    </section>
  );
};

export default TicketGrid;
