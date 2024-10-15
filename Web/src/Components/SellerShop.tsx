`use client`;
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../Css/SellerShop.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

const SellerShop = () => {
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
              <div className="flex space-x-2">
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
                <select className="border rounded px-2 py-1">
                  <option>Status</option>
                </select>
                <select className="border rounded px-2 py-1">
                  <option>Chains</option>
                </select>
                <div className="relative flex-grow mx-2 max-w-xl md:mb-0 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name"
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <select className="border rounded px-2 py-1">
                <option>Recently received</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerShop;
