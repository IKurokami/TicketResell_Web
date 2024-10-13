'use client'
import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Css/Sell.css";
import { Search } from "lucide-react";
import { TicketCard, fetchTicketItems } from "@/models/TicketSellCard";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Popup from './PopupDelete'; // Adjust the path based on your file structure

const TicketsPage = () => {
  const [ticketItems, setTicketItems] = useState<TicketCard[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const items = await fetchTicketItems();
      console.log(items);
      setTicketItems(items);
    } catch (error) {
      console.error('Error fetching ticket items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setPopupVisible(true); // Show the confirmation popup
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
            <Link href={`/addticket`} className="add-ticket-btn">
              <FontAwesomeIcon className="icon-plus" icon={faPlus} />
            </Link>
          </div>

          <div className="tickets-section">
            <div className="row justify-content-left">
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
                        <div className="ticket-bin-btn">
                          <button className="edit-btn">Edit</button>
                          <FontAwesomeIcon
                            className="bin-icon"
                            icon={faTrash}
                            onClick={() => handleDeleteTicket(ticketItem.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Not found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup for delete confirmation */}
      <Popup
        isVisible={isPopupVisible}
        onClose={() => {setPopupVisible(false) ;fetchItems();}}
        ticketId={ticketToDelete || ""}
      />
    </div>
  );
};

export default TicketsPage;
