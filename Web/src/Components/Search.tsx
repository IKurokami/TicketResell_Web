"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const Search: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredImages, setFilteredImages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 12;

  const images = Array.from({ length: 2000 }, (_, index) => ({
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451",
    title: `Movie ${index + 1}`,
    genre: ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"][index % 5],
    price: Math.floor(Math.random() * 1001),
    location: ["New York", "Los Angeles", "Chicago"][index % 3],
    date: `2023-10-${String(index + 1).padStart(2, "0")}`,
    description: "An exciting cinematic experience you won't want to miss!",
  }));

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePriceRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setPriceRange(value);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocation(event.target.value);
  };

  const filterImages = () => {
    let filtered = images;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (image) =>
          image.title.toLowerCase().includes(searchLower) ||
          image.genre.toLowerCase().includes(searchLower) ||
          image.location.toLowerCase().includes(searchLower)
      );
    }
    filtered = filtered.filter((image) => image.price <= priceRange);
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((image) =>
        selectedGenres.includes(image.genre)
      );
    }
    if (selectedLocation) {
      filtered = filtered.filter(
        (image) => image.location === selectedLocation
      );
    }
    setFilteredImages(filtered);
  };

  useEffect(() => {
    filterImages();
    setCurrentPage(1);
  }, [searchTerm, priceRange, selectedGenres, selectedLocation]);

  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full shadow-md transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full shadow-md transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full shadow-md transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <style jsx global>{`
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .movie-card-wrapper {
          position: relative;
          z-index: 1;
          transition: z-index 0s 0.1s;
        }

        .movie-card-wrapper:hover {
          z-index: 2;
          transition: z-index 0s;
        }

        .movie-card {
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .movie-card-wrapper:hover .movie-card {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .movie-card .card-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .movie-card:hover .card-content {
          max-height: 200px;
        }

        .marquee {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        .marquee span {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 15s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-100%, 0);
          }
        }

        .token {
          display: inline-block;
          padding: 4px 8px;
          background-color: #edf2f7;
          border-radius: 20px;
          margin: 2px;
          font-size: 0.875rem;
          color: #4a5568;
          transition: all 0.3s ease;
        }

        .movie-card:hover .token {
          background-color: aqua;
          color: black;
        }

        .tokenize-wrapper {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .add-to-cart-button {
          background-color: aqua;
          color: black;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.3s ease-in-out, transform 0.2s ease-in-out;
          opacity: 0;
        }

        .movie-card:hover .add-to-cart-button {
          opacity: 1;
        }

        .add-to-cart-button:hover {
          transform: scale(1.1);
        }

        .card-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          margin-top: auto;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Movie Tickets
          </h1>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === "search"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("search")}
              >
                Search
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === "filter"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("filter")}
              >
                Filter
              </button>
            </div>
            <div className="p-4">
              {activeTab === "search" && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for movie tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaSearch size={20} />
                  </button>
                </div>
              )}
              {activeTab === "filter" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Action", "Comedy", "Drama", "Sci-Fi", "Horror"].map(
                        (genre) => (
                          <button
                            key={genre}
                            onClick={() => handleGenreChange(genre)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                              selectedGenres.includes(genre)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {genre}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="5"
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">
                      $0 - ${priceRange}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                    >
                      <option value="">All Locations</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie grid */}
        <div className="movie-grid">
          {paginatedImages.length > 0 ? (
            paginatedImages.map((item, index) => (
              <div key={index} className="movie-card-wrapper">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                      ${item.price}
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {item.location}
                    </p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                    <div className="tokenize-wrapper">
                      {item.genre.split(",").map((g: any) => (
                        <span key={g} className="token">
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="card-content mt-2">
                      <p className="text-sm text-gray-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 card-footer">
                    <button
                      className="add-to-cart-button"
                      aria-label="Add to cart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </button>
                    <div className="marquee text-sm text-gray-500">
                      <span>
                        Get your tickets now! Limited availability. Don't miss
                        out!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No results match your search criteria.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center m-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 mx-1 rounded-full shadow-md transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
