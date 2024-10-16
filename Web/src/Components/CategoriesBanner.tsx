"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
const HorizontalCards = ({ categoryId, title }) => {
  const [cardsData, setCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(5);
  const sliderRef = useRef(null);
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards]);

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
            body: JSON.stringify([categoryId]),
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 768) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(4);
      } else {
        setVisibleCards(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideLeft = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cardsData.length - visibleCards : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const slideRight = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === cardsData.length - visibleCards ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getVisibleCards = () => {
    if (cardsData.length <= visibleCards) return cardsData;

    const visibleCardsArray = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (currentIndex + i) % cardsData.length;
      visibleCardsArray.push(cardsData[index]);
    }
    return visibleCardsArray;
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const visibleCardsData = getVisibleCards();

  return (
    <div className="w-full h-[70vh] bg-white-50 py-8">
      <div className="container pd-5">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {title}
        </h1>

        <div className="relative overflow-hidden h-[calc(100%+4rem)] py-8">
          <button
            onClick={slideLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 z-10 transition-colors"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-white text-2xl"
            />
          </button>
          <button
            onClick={slideRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 z-10 transition-colors"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-white text-2xl"
            />
          </button>
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-in-out pt-2"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
            }}
          >
            {cardsData.map((card, index) => (
              <Link
                href={"/ticket/" + card.ticketId}
                style={{ textDecoration: "none", color: "black" }}
                key={`${card.ticketId}-${index}`}
                className={`flex-shrink-0 px-2 hover:scale-105 transition-transform duration-300 ${
                  visibleCards === 1
                    ? "w-full"
                    : visibleCards === 2
                    ? "w-1/2"
                    : visibleCards === 3
                    ? "w-1/3"
                    : visibleCards === 4
                    ? "w-1/4"
                    : "w-1/5"
                }`}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={`/api/images/${card.ticketId}`}
                      alt={`${card.name} cover`}
                      layout="fill"
                      objectFit="cover"
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCards;
