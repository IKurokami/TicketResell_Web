"use client";
import {
  faBars,
  faClock,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import "../Css/SellerShop.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdFilterList, MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

const SellerShop = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState("Price low to high");
  const sortOptions = [
    { text: "Price low to high", icon: faSortAmountUp },
    { text: "Price high to low", icon: faSortAmountDown },
    { text: "Recently listed", icon: faClock },
  ];
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
  }, []);
  return (
    <div>
      <main className="bg-white text-black pb-[5vh]">
        <div className=" relative profile">
          <img
            className=" w-full object-cover mt-[10vh] max-w-full h-[30vh] bg-gray-100"
            src="https://images7.alphacoders.com/129/1297416.png"
            alt=""
          />
          <div className="absolute w-[12vw] h-[12vw] rounded-full left-[7vw] top-20 border-4 border-white bg-gray-100">
            <img
              src="https://images7.alphacoders.com/129/1297416.png"
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="container mt-[10vh]">
          <div className="seller-desc">
            <p className="text-2xl font-medium">Giap Cao Dinh</p>
          </div>
          <p className="text-lg font-300">Join at </p>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex ">
                <button
                  type="button"
                  // onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={` bg-gray-100 inline-flex items-center justify-center whitespace-nowrap transition duration-200 text-md leading-md font-semiboldg text-primary hover:bg-gray-200 gap-3 rounded-xl py-3 px-3 disabled:pointer-events-none disabled:opacity-40 
                    // isSidebarOpen ? "shadow-sm" : ""
                  }`}
                  // aria-expanded={isSidebarOpen}
                  aria-label="Filter"
                >
                  <MdFilterList
                    className="text-black"
                    style={{ fontSize: "24px" }}
                  />
                </button>
                <div className="flex items-center space-x-2 px-5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-md leading-md font-semibold">Live</span>
                  <span className="text-md leading-md text-gray-600 text-nowrap">
                    3 results
                  </span>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative mr-3 w-full" ref={dropdownRef}>
                    <button className=" font-semibold h-12 w-full pl-4 pr-2 rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:outline-none flex items-center justify-between transition duration-200">
                      <span>
                        Status
                      </span>
                      <MdKeyboardArrowDown className="ml-2 text-2xl text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center flex-grow mx-2 max-w-xl md:mb-0 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name"
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-[50vw] pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative mr-3 w-full md:w-64" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="h-12 w-full pl-4 pr-10 rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:outline-none flex items-center justify-between transition duration-200"
                  >
                    <span className="truncate">{sortOption}</span>
                    <MdKeyboardArrowDown className="text-2xl text-gray-600" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
                      <ul className="">
                        {sortOptions.map((option) => (
                          <li key={option.text}>
                            <button
                              onClick={() => handleSortOptionClick(option.text)}
                              className="w-full text-left  pt-3 hover:bg-gray-100 focus:outline-none transition duration-200 flex items-center"
                            >
                              <FontAwesomeIcon
                                icon={option.icon}
                                className="mr-3"
                              />
                              {option.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerShop;
