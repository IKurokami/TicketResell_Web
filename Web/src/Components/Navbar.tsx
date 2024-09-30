"use client";
import { useRouter } from "next/navigation";  // Import useRouter from next/router
import React, { useState } from "react";
import "@/Css/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useScroll from "@/Hooks/useScroll";

const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const isScrolled = useScroll();
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const router = useRouter();  // Initialize useRouter

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);  // Use router.push to navigate programmatically
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleMenuItemClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    console.log("Redirecting to:", route);
    router.push(route);  // Handle menu item click with router.push
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-brand">
        <a href="/" className="logo">
          <span className="logo-green">Ticket</span> 
          <span className="resell">Resell</span>
        </a>
      </div>

      {/* Toggle Menu Button */}
      <button className="menu-toggle" onClick={handleMenuToggle}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${menuActive ? "active" : ""}`}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/sell">Sell</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
        </ul>
      </nav>

      {/* Search Form */}
      <form className={`search-form ${isSearchVisible ? "visible" : ""}`} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>

      <div className="user-section">
        {!isLoggedIn && (
          <a href="/login" className="sign-in-btn">
            Sign in
          </a>
        )}

        <div className="user-dropdown-wrapper">
          <a href="#" onClick={toggleDropdown} aria-label="User">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User"
              className="user-icon"
            />
          </a>
          {isDropdownVisible && (
            <div className="user-dropdown visible">
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleMenuItemClick(e, "/profile")}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleMenuItemClick(e, "/favorites")}
                  >
                    Favorites
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleMenuItemClick(e, "/history")}
                  >
                    Purchase History
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleMenuItemClick(e, "/myticket")}
                  >
                    My Ticket
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleMenuItemClick(e, "/settings")}
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
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
          <i className="fas fa-shopping-cart"></i>
        </a>

        <a href="#" className="icon-link noti-icon" aria-label="Notifications">
          <i className="fas fa-bell"></i>
          <span className="noti-badge">3</span>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
