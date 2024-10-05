"use client";
import "../Css/TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "react-bootstrap";
import Dropdown from "./Dropdown";
import Link from "next/link";

type Ticket = {
  name: string;
  cost: number;
  location: string;
  startDate: string;
  author: string;
  imageUrl: string;
  description: string;
};

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const { id } = useParams(); // Get the ID from the URL parameters
  const [title, setTitle] = useState("");

  // Function to fetch ticket by ID
  const fetchTicketById = async (id: string | string[]) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/readbyid/${id}`,
        {
          method: "GET",
        }
      );
      return await response.json(); // Parse and return JSON result
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    const loadresult = async () => {
      console.log("Fetched ID:", id); // Log the ID to check if it's defined
      if (id) {
        // Ensure id is defined
        const result = await fetchTicketById(id); // Use id directly
        console.log(result);

        if (result) {
          const ticketDetail: Ticket = {
            imageUrl: result.data.image,
            name: result.data.name,
            startDate: new Date(result.data.startDate).toLocaleDateString(),
            author:
              result.data.seller && result.data.seller.username
                ? result.data.seller.username
                : "Unknown Seller",
            location: `Event at ${result.data.location}`,
            cost: result.data.cost,
            description: result.data.description,
          };
          setTicketresult(ticketDetail); // Set the fetched ticket result
          console.log(ticketresult?.author);
        }
      } else {
        console.error("ID is undefined or invalid.");
      }
    };

    loadresult(); // Call the loadresult function
  }, [id]);

  // Render loading or ticket details
  if (!ticketresult) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-ticket-detail">
      <main className="container">
        <div className="row ticket--detail">
          <div className="col-12 col-lg-4 ticket--intro">
            <img
              className="rounded ticket--img img-thumbnail bg-dark"
              style={{ width: "100%" }}
              src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
              // src={ticketresult.imageUrl}
              alt={ticketresult.name}
            />
            <div className="dropdown">
              <Dropdown title={"Description"} content="" />
            </div>
          </div>
          <div className="ticket--info col-12 col-lg-7">
            <h2 className="ticket--name">{ticketresult.name}</h2>
            <p className="ticket--seller">
              Sold by {}
              <Link
                className="seller--link"
                href={`/seller/${ticketresult.author}`}
              >
                <strong>{ticketresult.author}</strong>
              </Link>
            </p>
            <p>Location: {ticketresult.location} </p>{" "}
            {/* Replace with actual sold result if available */}
            <div className="tag--list row">
              <p className="">Date: {ticketresult.startDate}</p>
            </div>
            <div className="ticket--price--block border border-secondary rounded">
              <p className="ticket--price">
                <FontAwesomeIcon className="Tag" icon={faTag} />{" "}
                <strong>{ticketresult.cost} VND</strong> {/* Format cost */}
              </p>
              <div className="cta">
                <button className="ticket--btn">
                  <i className="fas fa-shopping-cart cart--icon"></i>
                  Add to cart
                </button>
                <button className="ticket--btn">
                  <i className="fa-solid fa-cash-register cart--icon"></i>
                  Buy Now
                </button>
              </div>
            </div>
            <div className="dropdown">
              <Dropdown title={"Seller"} content="" />
            </div>
          </div>
        </div>

        <div className="ticket--related">
          <h2 className="ticket--title row justify-content-center">
            Related Tickets
          </h2>
          <div className="ticket--list">
            <div className="card bg-dark col-12 col-lg-3 border-white ticket--item">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-white">Card title</h5>
                <p className="card-text text-white">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket-btn btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card bg-dark col-12 col-lg-3 border-white ticket--item">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-white">Card title</h5>
                <p className="card-text text-white">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className=" btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card bg-dark col-12 col-lg-3 border-white ticket--item">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-white">Card title</h5>
                <p className="card-text text-white">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
