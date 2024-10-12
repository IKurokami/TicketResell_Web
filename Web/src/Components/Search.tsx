"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFilterList, MdKeyboardArrowDown } from "react-icons/md";
import { fetchTickets, getCategoryNames } from "../models/TicketFetch";
import TicketGrid from "./TicketGrid";
import TabNavigation from "./TabNavigation";

const Search: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Price low to high");

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    "Price low to high",
    "Price high to low",
    "Recently listed",
  ];

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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortOptionClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const sortTickets = (tickets: any[]) => {
    switch (sortOption) {
      case "Price low to high":
        return tickets.sort((a, b) => a.cost - b.cost);
      case "Price high to low":
        return tickets.sort((a, b) => b.cost - a.cost);
      case "Recently listed":
        return tickets.sort(
          (a, b) =>
            new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
        );
      default:
        return tickets;
    }
  };

  useEffect(() => {
    localStorage.setItem("searchData", searchTerm);
    filterTickets();
    setCurrentPage(1);
  }, [
    searchTerm,
    priceRange,
    selectedGenres,
    selectedLocation,
    tickets,
    sortOption,
  ]);

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

    setFilteredTickets(sortTickets(filtered)); // Sort tickets after filtering
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

  const [activeTab, setActiveTab] = useState("upcoming");

  const tabs = [
    { id: "upcoming", label: "Active & upcoming", href: "/drops?tab=upcoming" },
    { id: "past", label: "Past", href: "/drops?tab=past" },
  ];

  return (
    <div className="relative lg:mx-24 md:mx-auto pt-24">
      {/* Header with TabNavigation, Search Bar, and Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4">
        {/* Left: Filter button and Live results */}
        <div className="flex items-center space-x-4 mb-2">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar visibility
            className="inline-flex items-center justify-center whitespace-nowrap transition duration-200 text-md leading-md font-semibold bg-component-gray-1 text-primary hover:bg-component-gray-2 gap-3 rounded-xl py-3 px-3 disabled:pointer-events-none disabled:opacity-40"
            aria-expanded={isSidebarOpen}
            aria-label="Filter"
          >
            <MdFilterList
              className="text-primary"
              style={{ fontSize: "24px" }}
            />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-md leading-md font-semibold">Live</span>
            <span className="text-md leading-md text-gray-600">
              {filteredTickets.length} results
            </span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="relative flex-grow mx-2 max-w-xl mb-2">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Right: Sort dropdown */}
        <div className="flex items-center space-x-4 mb-2">
          {/* Tab Navigation */}
          <TabNavigation />
          <div className="relative mr-3" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-12 w-64 pl-4 pr-10 rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:outline-none flex items-center justify-between transition duration-200"
            >
              <span className="w-64">{sortOption}</span>
              <MdKeyboardArrowDown className="text-2xl text-gray-600" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
                <ul className="py-1">
                  {sortOptions.map((option) => (
                    <li key={option}>
                      <button
                        onClick={() => handleSortOptionClick(option)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none transition duration-200"
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div
          className={`w-full lg:w-1/4 p-4 bg-white shadow-md transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Genre Filter */}
          <h3 className="font-semibold text-lg mb-2">Genres</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)} // Assuming this function is defined
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedGenres.includes(genre)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4 p-4">
          <TicketGrid paginatedTickets={paginatedTickets} />{" "}
          {/* Assuming this component is defined */}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
              >
                &lt;
              </button>
              {renderPaginationButtons()}{" "}
              {/* Assuming this function is defined */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
