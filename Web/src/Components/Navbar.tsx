"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import "@/Css/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useScroll from "@/Hooks/useScroll";
import { checkAccessKey } from "./Cookie";
import { logoutUser } from "./Logout";
import Cookies from "js-cookie";
// import { removeAllCookies } from "./Cookie";
// import { removeCookie  } from "./Cookie";
import { useRouter } from "next/navigation";
const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
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

  const handleCartClick = () => {
    console.log("Cart clicked");
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

  // Handle show icon when login

  useEffect(() => {
    // Function to check if the user is logged in by checking for the 'id' cookie
    const checkUserLoginStatus = () => {
      const id = Cookies.get('id'); // Get the user ID from the cookie
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
     setIsLoggedIn(false);
      router.push("/login"); // Redirect to login after successful logout
    } else {
      console.log("Failed to log out. Please try again.");
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
          {isLoggedIn && (
            <a href="#" onClick={toggleDropdown} aria-label="User">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User"
                className="user-icon"
              />
            </a>
          )}
          {isDropdownVisible && isLoggedIn && (
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
                  <Link href="/login"  onClick={handleLogout}>
                    Logout
                  </Link>
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
