"use client";
import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Css/Sell.css";
import { Search, Plus } from "lucide-react";
import { TicketCard, convertToTicketCards } from "@/models/TicketSellCard";
import AddTicketModal from "@/Components/AddTicketPopup";

const fetchTicketItems = async (): Promise<TicketCard[]> => {
  const response = await fetch("http://localhost:5296/api/ticket/read");
  const result = await response.json();
  return convertToTicketCards(result.data);
};

const TicketsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketItems, setTicketItems] = useState<TicketCard[]>([]);

  const fetchItems = async () => {
    const items = await fetchTicketItems();
    console.log(items);

    setTicketItems(items);
  };
  useEffect(() => {
    // Fetch the ticket items when the component is mounted

    fetchItems();
  }, []);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

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
            <button className=" add-ticket-btn" onClick={handleButtonClick}>
              <Plus className="add-button" />
            </button>
          </div>
          <AddTicketModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

          <div className="tickets-section">
            <div className="row justify-content-center">
              {ticketItems.length > 0 ? (
                ticketItems.map((ticketItem) => (
                  <div key={ticketItem.id} className="col-lg-4 ticket-card">
                    <div className="card">
                      <div className="card-img-container">
                        <img
                          src={ticketItem.imageUrl}
                          alt={ticketItem.name}
                          className="card-img-top"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{ticketItem.name}</h5>
                        <p className="card-location">
                          Location: {ticketItem.location}
                        </p>
                        <p className="card-date">Date: {ticketItem.date}</p>
                        <p className="ticket-price">
                          Cost: ${ticketItem.price}
                        </p>

                        <button className="edit-btn">Edit</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading tickets...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
