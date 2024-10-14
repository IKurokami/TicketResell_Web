import React from "react";
import Link from "next/link";
import { getCategoryNames } from "../models/TicketFetch";

interface TicketGridProps {
  paginatedTickets: any[];
  maxTicketInRow: number;
}

const TicketGrid: React.FC<TicketGridProps> = ({
  paginatedTickets,
  maxTicketInRow,
}) => {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const gridColumns = Math.min(maxTicketInRow, 5);

  return (
    <section className="relative">
      <div
        className="absolute h-1 bg-green-500 opacity-0.1"
        style={{ zIndex: 20 }}
      ></div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridColumns} lg:grid-cols-${gridColumns} gap-4`}
      >
        {paginatedTickets.length > 0 ? (
          paginatedTickets.map((ticket, index) => (
            <Link
              key={ticket.ticketId}
              className="no-underline"
              href={`/ticket/${ticket.ticketId}`}
              passHref
            >
              <div
                className="movie-card-wrapper cursor-pointer"
                data-index={index}
              >
                <div className="bg-transparent rounded-2xl border overflow-hidden movie-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative flex-grow">
                    <img
                      src={
                        ticket.imageUrl ||
                        "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                      }
                      alt={ticket.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-sm sm:px-3 sm:py-1 sm:text-base rounded-bl-2xl">
                      {formatVND(ticket.cost)}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex-grow flex flex-col">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 text-gray-900 line-clamp-2">
                      {truncateText(ticket.name, 20)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      {truncateText(ticket.location, 20)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {new Date(ticket.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="tokenize-wrapper mt-2 overflow-hidden">
                      <div className="flex flex-wrap">
                        {getCategoryNames(ticket)
                          .split(",")
                          .filter((category) => category.trim() !== "")
                          .slice(0, 3) // Limit to 3 categories
                          .map((category, catIndex) => (
                            <span
                              key={category}
                              className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 mb-1 text-xs sm:text-sm"
                            >
                              {category.trim()}
                            </span>
                          ))}
                        {getCategoryNames(ticket).trim() === "" && (
                          <span
                            key="No categories"
                            className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 mb-1 text-xs sm:text-sm"
                          >
                            No categories
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="card-content mt-auto">
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
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
