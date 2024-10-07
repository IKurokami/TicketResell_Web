import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Css/Sell.css";
import { Search,Plus } from "lucide-react";

const TicketsPage = () => {
  return (
    <div className="tickets-page-wrapper">
      <div className="tickets-page-container">
        <div className="sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Tickets
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Transaction
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Revenue
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Profile
              </a>
            </li>
          </ul>
        </div>

        <div className="content">
         
          <div className="search-nav">
            <div className="search-bar">
              <span className="menu-icon">≡</span>
              <input type="text" placeholder="Search ticket" />
              <Search className="search-icon" />
            </div>
            <button className="btn btn-outline-secondary add-ticket-btn">
              <Plus className="add-button"/> 

            </button>
          </div>

          <div className="tickets-section">
            <div className="row justify-content-center">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="col-lg-3 ticket-card">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Name</h5>
                      <p className="card-text">Description</p>
                      <p className="ticket-price">$100</p>
                      <p>Total: 10</p>
                      <button className="edit-btn">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
