"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchTickets, getCategoryNames } from "../models/TicketFetch";
import TicketGrid from "./TicketGrid";

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  useEffect(() => {
    const loadTickets = async () => {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);

      const allCategories = fetchedTickets.flatMap((ticket) =>
        ticket.categories.map((category) => category.name)
      );
      const uniqueCategories = Array.from(new Set(allCategories));
      setCategories(uniqueCategories);
    };

    let searchData = localStorage.getItem("searchData");
    if (searchData) setSearchTerm(searchData);
    loadTickets();
  }, []);

  useEffect(() => {
    localStorage.setItem("searchData", searchTerm);
    filterTickets();
    setCurrentPage(1);
  }, [searchTerm, priceRange, selectedGenres, selectedLocation, tickets]);

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

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
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
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
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
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="relative mx-auto flex h-full w-full flex-col lg:flex-row mt-24">
      {/* Left Sidebar */}
      <div className="relative w-full bg-surface px-10 py-48 lg:mt-24 lg:w-1/2 lg:rounded-br-lg lg:rounded-tr-lg lg:py-32 xl:w-1/3 2xl:w-1/4">
        <div
          className="h-fit min-w-52 text-xs text-muted-foreground lg:mb-0"
          style={{ position: "sticky", top: "120px" }}
        >
          {/* Search Bar */}
          <div className="mt-10 flex w-full items-center overflow-hidden rounded-full border border-black bg-black/10 p-2 dark:border-muted dark:bg-muted/50">
            <FaSearch className="mx-4 size-6 text-black dark:text-white" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none bg-transparent text-black focus:border-none focus:outline-none focus:ring-0 dark:text-white"
            />
          </div>

          {/* Genre Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 py-4 !h-fit !min-w-24 !rounded-full !py-2 px-5 ${
                  selectedGenres.includes(genre)
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : ""
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Price Range: ${priceRange}
            </h3>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Location Filter */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
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
      {/* Main Content */}
      <div className="w-full px-5">
        <TicketGrid paginatedTickets={paginatedTickets} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-8">
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
              className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
