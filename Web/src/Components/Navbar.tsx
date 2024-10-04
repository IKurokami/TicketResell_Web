"use client";
import Link from "next/link";
// import Link from "next/link";
import React, { useState } from "react";
import "@/Css/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useScroll from "@/Hooks/useScroll";
import { checkAccessKey } from "./Cookie";
// import { removeAllCookies } from "./Cookie";
// import { removeCookie  } from "./Cookie";
import { useRouter } from "next/navigation";
const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [isLoggedIn] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const isScrolled = useScroll();
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const router = useRouter();
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
    console.log("Tìm kiếm:", searchTerm);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleMenuItemClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    console.log("Redirecting to:", route);
    // Implement routing logic here
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
    // Implement cart handling logic here
  };

  const handleSignInClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Ngăn chặn việc chuyển hướng mặc định
    console.log("handleSignInClick is called");
    // Kiểm tra accessKey
    const isValid = await checkAccessKey();

    // removeAllCookies();
    // removeCookie('id');

    if (isValid) {
      // Nếu accessKey hợp lệ, chỉ chuyển hướng nếu không ở trang login
      console.log("login success");
      router.push("/");
    } else {
      // Nếu không hợp lệ, chuyển đến trang login
      router.push("/login");
    }
  };

  return (
    <header className={`navbarr ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbarr-brand">
        <Link href="/" className="logo">
          <span className="logo-green">Ticket</span>{" "}
          <span className="resell">Resell</span>
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
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/sell">Sell</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
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
        />
        <button
          type="button"
          className="search-button"
          onClick={handleSearchIconClick}
        >
          <i className="fas fa-search"></i>
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
          <span className="noti-badge">3</span> {/* Notification count */}
        </a>
      </div>
    </header>
  );
};

export default Navbar;
