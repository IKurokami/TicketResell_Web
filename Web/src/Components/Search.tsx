"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchTickets, getCategoryNames } from "../models/TicketFetch";
import Link from "next/link";

const Search: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");

  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);

  const itemsPerPage = 9;
  useEffect(() => {
    let searchData = localStorage.getItem("searchData");
    if (searchData) setSearchTerm(searchData);

    const loadTickets = async () => {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);

      // Extract unique categories from all tickets
      const allCategories = fetchedTickets.flatMap((ticket) =>
        ticket.categories.map((category) => category.name)
      );
      const uniqueCategories = Array.from(new Set(allCategories));
      setCategories(uniqueCategories);
    };
    loadTickets();
  }, []);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

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

  const filterTickets = () => {
    let filtered = tickets;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchLower) ||
          getCategoryNames(ticket).toLowerCase().includes(searchLower) ||
          ticket.location.toLowerCase().includes(searchLower)
      );
    }
    filtered = filtered.filter((ticket) => ticket.cost <= priceRange);
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedGenres.every((genre) =>
          getCategoryNames(ticket).toLowerCase().includes(genre.toLowerCase())
        )
      );
    }
    if (selectedLocation) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }
    setFilteredTickets(filtered);
  };

  useEffect(() => {
    localStorage.setItem("searchData", searchTerm);
    filterTickets();
    setCurrentPage(1);
  }, [searchTerm, priceRange, selectedGenres, selectedLocation, tickets]);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>

                {/* Genre Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreChange(genre)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                          selectedGenres.includes(genre)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Price Range: ${priceRange}
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    className="w-full"
                  />
                </div>

                {/* Location Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                  >
                    <option value="">All Locations</option>
                    {Array.from(
                      new Set(tickets.map((ticket) => ticket.location))
                    ).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for event tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-3 px-4 pr-10 rounded-full border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaSearch size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*Movie Grid*/}
            <div className="movie-grid">
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket, index) => (
                  <Link
                    className="no-underline"
                    href={`/ticket/${ticket.ticketId}`}
                    key={index}
                    passHref
                  >
                    <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline">
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
                          <p className="text-sm text-gray-600 mb-1">
                            {ticket.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(ticket.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          <div className="tokenize-wrapper">
                            {getCategoryNames(ticket)
                              .split(",")
                              .map((category) => (
                                <span key={category} className="token">
                                  {category.trim()}
                                </span>
                              ))}
                          </div>
                          <div className="card-content mt-2">
                            <p className="text-sm text-gray-700">
                              An exciting event you won't want to miss!
                            </p>
                          </div>
                        </div>
                        {/* ... (card footer remains the same) */}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
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

        {/* Promotional Banner */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 text-white mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Exclusive Deals!</h2>
            <p>Get the best deals on top events. Limited time only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
