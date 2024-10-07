"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import "@/Css/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useScroll } from "@/Hooks/useScroll";
import { checkAccessKey } from "./Cookie";
import { logoutUser } from "./Logout";
import Cookies from "js-cookie";
import { removeAllCookies } from "./Cookie";
import { useRouter } from "next/navigation";
import SellPopup from "./PopUp";

import { CheckSeller } from "./CheckSeller";
interface NavbarProps {
  page: string;
}

const Navbar: React.FC<NavbarProps> = ({ page = "defaultPage" }) => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const adjustedIsScrolled = useScroll();
  const isScrolled = page === "ticket" ? false : adjustedIsScrolled;
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const router = useRouter();
  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };
  console.log(page);

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchTerm);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // const handleMenuItemClick = (e: React.MouseEvent, route: string) => {
  //   e.preventDefault();
  //   console.log("Redirecting to:", route);
  //   // Implement routing logic here
  // };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    event.preventDefault(); // Prevent default navigation behavior

    // Check if accessKey is valid
    const isValid = await checkAccessKey();
    if (isValid) {
      // If valid, navigate to the desired page
      console.log("Access granted, navigating to", path);
      router.push(path);
    } else {
      // If not valid, redirect to login page
      console.log("Access denied, redirecting to login");
      router.push("/login");
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/my-cart");
    // Implement cart handling logic here
  };

  // Handle check cookie
  const handleSignInClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log("handleSignInClick is called");

    const isValid = await checkAccessKey();

    // removeCookie('id');

    if (isValid) {
      setIsLoggedIn(true);
      console.log("login success");
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  const handleSellClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Fetch seller status
    const status = await CheckSeller();
    console.log("Seller Status: ", status); // Log the status
    // Routing or popup logic
    if (status) {
      router.push("/sell");
    } else {
      console.log("User is not a seller, showing popup");
      setIsPopupVisible(true);
    }
  };
  const closeDropdown = () => {
    setIsPopupVisible(false);
  };

  // Handle show icon when login

  useEffect(() => {
    // Function to check if the user is logged in by checking for the 'id' cookie
    const checkUserLoginStatus = () => {
      const id = Cookies.get("id"); // Get the user ID from the cookie
      if (id) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out
      }
    };

    // Set up a function to listen for changes in the cookies or storage
    const handleCookieChange = () => {
      checkUserLoginStatus(); // Re-check the login status when cookies change
    };

    // Check the user status when the component mounts
    checkUserLoginStatus();

    // Set an interval to periodically check login status (every second)
    const interval = setInterval(() => {
      handleCookieChange();
    }, 1000); // Adjust the interval duration as needed

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const isLoggedOut = await logoutUser(Cookies.get("id"));
    if (isLoggedOut) {
      removeAllCookies();
      setDropdownVisible(false);
      setIsLoggedIn(false);
      router.push("/login"); // Redirect to login after successful logout
    } else {
      console.log("Failed to log out. Please try again.");
      // Nếu không hợp lệ, chuyển đến trang login
      router.push("/login");
    }
  };

  return (
    <header
      className={`${isScrolled ? "navbarr scrolled" : "navbarr"}`}
      style={{
        backgroundColor: page === "ticket" ? "white" : undefined,
        boxShadow:
          page === "ticket" ? "0 2px 5px rgba(0, 0, 0, 0.2)" : undefined,
      }}
    >
      <div className="navbarr-brand">
        <Link href="/" className="logo">
          <span className="logo-green">Ticket</span>{" "}
          <span
            className="resell"
            style={{ color: page === "ticket" ? "black" : undefined }}
          >
            Resell
          </span>
        </Link>
      </div>

      {/* Toggle Menu Button */}
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${menuActive ? "active" : ""}`}>
        <ul>
          <li>
            <Link
              href="/"
              style={{ color: page === "ticket" ? "black" : undefined }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#"
              style={{ color: page === "ticket" ? "black" : undefined }}
              onClick={handleSellClick}
            >
              Sell
            </Link>
            <SellPopup isVisible={isPopupVisible} onClose={closeDropdown} />
          </li>
          <li>
            <Link
              href="/contact"
              style={{ color: page === "ticket" ? "black" : undefined }}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>

      <form
        className={`search-form ${isSearchVisible ? "visible" : ""}`}
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          style={{
            backgroundColor: page === "ticket" ? "rgb(0,0,0,0.1)" : undefined,
          }}
        />
        <button
          type="button"
          className="search-button"
          onClick={handleSearchIconClick}
        >
          <i
            className="fas fa-search"
            style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          ></i>
        </button>
      </form>

      <div className="user-section">
        {!isLoggedIn && (
          // <Link href="/login" onClick={handleSignInClick} className="sign-in-btn">
          //   Sign in
          // </Link>
          <button onClick={handleSignInClick} className="sign-in-btn">
            Sign in
          </button>
        )}

        <div className="user-dropdown-wrapper relative">
          {isLoggedIn && (
            <button
              onClick={toggleDropdown}
              aria-label="User"
              className="focus:outline-none"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
            </button>
          )}
          {isDropdownVisible && (
            <div className="user-dropdown visible absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="py-1">
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/profile")}
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    Profile
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/favorites")}
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                    Favorites
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/history")}
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    History
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/myticket")}
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      ></path>
                    </svg>
                    My Ticket
                  </div>
                </a>
                <a
                  href="#"
                  onClick={(e) => handleMenuItemClick(e, "/settings")}
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    Settings
                  </div>
                </a>
                <Link
                  href="/login"
                  onClick={handleLogout}
                  className="block px-3 py-2 text-xs text-red-600 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Logout
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cart and Notifications */}
        <a
          href="#"
          className="icon-link"
          aria-label="Cart"
          onClick={handleCartClick}
        >
          <i
            className="fas fa-shopping-cart"
            style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          ></i>
        </a>

        <a
          href="#"
          className="icon-link noti-icon"
          style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          aria-label="Notifications"
        >
          <i
            className="fas fa-bell"
            style={{ color: page === "ticket" ? "rgb(0,0,0)" : undefined }}
          ></i>
          <span className="noti-badge">3</span> {/* Notification count */}
        </a>
      </div>
    </header>
  );
};

export default Navbar;
