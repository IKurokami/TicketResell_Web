import React from "react";
import "@/Css/Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-subscribe">
          <h3>Stay Updated</h3>
          <p>
            Join our mailing list to stay informed about the latest ticket
            releases, updates, and tips for buying or selling tickets securely
            on TicketResell.
          </p>
          <form className="subscribe-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Sign up</button>
          </form>
        </div>
        <div className="footer-community">
          <h3>Join the community</h3>
          <div className="social-icons">
            {/* Add your social media icons with links */}
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-discord"></i>
            </a>
            <a href="#">
              <i className="fab fa-github"></i>
            </a>
            <a href="#">
              <i className="fab fa-reddit"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-help">
          <h3>Need help?</h3>
          <a href="#" className="contact-support-button">
            Contact Support
          </a>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-section">
          <h4>TicketResell</h4>
          <p>
            Your trusted marketplace for buying, selling, and discovering
            tickets to exclusive events. Secure and easy ticket transactions.
          </p>
        </div>
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li>
              <a href="#">Concerts</a>
            </li>
            <li>
              <a href="#">Sports</a>
            </li>
            <li>
              <a href="#">Theatre</a>
            </li>
            <li>
              <a href="#">Festivals</a>
            </li>
            <li>
              <a href="#">Exhibitions</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>My Account</h4>
          <ul>
            <li>
              <a href="#">Profile</a>
            </li>
            <li>
              <a href="#">Favorites</a>
            </li>
            <li>
              <a href="#">Purchase History</a>
            </li>
            <li>
              <a href="#">My Cart</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Community Guidelines</a>
            </li>
            <li>
              <a href="#">Partners</a>
            </li>
            <li>
              <a href="#">Taxes</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Learn</h4>
          <ul>
            <li>
              <a href="#">How to buy a ticket</a>
            </li>
            <li>
              <a href="#">How to sell a ticket</a>
            </li>
            <li>
              <a href="#">Ticket policies</a>
            </li>
            <li>
              <a href="#">Payment options</a>
            </li>
            <li>
              <a href="#">Safe transactions</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 TicketResell. Web designed by Quang.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
