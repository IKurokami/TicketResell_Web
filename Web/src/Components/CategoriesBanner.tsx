"use client";
import React, { useState, useEffect } from "react";

const HorizontalCards = () => {
  const [cardsData, setCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5296/api/Ticket/getByListCate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(["CAT001"]),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCardsData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Featured Events
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cardsData.map((card) => (
            <div
              key={card.ticketId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                  alt={`${card.name} cover`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {card.name}
                </h3>
                <p className="text-xs text-gray-600">
                  By {card.seller.fullname}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(card.startDate).toLocaleDateString()}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {card.categories.slice(0, 3).map((category) => (
                    <span
                      key={category.categoryId}
                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700"
                    >
                      {category.name}
                    </span>
                  ))}
                  {card.categories.length > 3 && (
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                      ...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCards;
