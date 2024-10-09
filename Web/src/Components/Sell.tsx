"use client";
import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/Css/Sell.css";
import { Search } from "lucide-react";
import { TicketCard, fetchTicketItems } from "@/models/TicketSellCard";
import AddTicketModal from "@/Components/AddTicketPopup";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {deleteImage} from "@/models/Deleteimage";

const TicketsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketItems, setTicketItems] = useState<TicketCard[]>([]);
  

  const fetchItems = async () => {
    const items = await fetchTicketItems();
    console.log(items);
    setTicketItems(items);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
       
        const response = await fetch(
            `http://localhost:5296/api/Ticket/delete/${ticketId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
           
            setTicketItems((prevItems) =>
                prevItems.filter((ticket) => ticket.id !== ticketId)
            );
            console.log(`Ticket with ID ${ticketId} deleted successfully.`);

            
            const imageDeleteResult = await deleteImage(ticketId);
            if (imageDeleteResult.success) {
                console.log(`Image with Ticket ID ${ticketId} deleted successfully.`);
            } else {
                console.error(`Failed to delete image: ${imageDeleteResult.error}`);
            }
        } else {
            console.error("Failed to delete the ticket.");
        }
        fetchItems();
    } catch (error) {
        console.error("Error deleting ticket:", error);
    }
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
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <AddTicketModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

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
