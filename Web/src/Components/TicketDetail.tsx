"use client";
import "../Css/TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Dropdown from "./Dropdown";
import Link from "next/link";

type Category = {
  categoryId: string;
  name: string;
  description: string;
};
type seller = {
  userId: string;
  username: string;
  fullname: string;
};
type Ticket = {
  name: string;
  cost: number;
  location: string;
  startDate: string;
  author: seller;
  imageUrl: string;
  description: string;
  categories: Category[];
};

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL parameters
  const [title, setTitle] = useState("");

  // Function to fetch ticket by ID
  const fetchTicketById = async (id: string | null) => {
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
            author: result.data.seller,
            location: `Event at ${result.data.location}`,
            cost: result.data.cost,
            description: result.data.description,
            categories: result.data.categories.map((category: any) => ({
              categoryId: category.categoryId,
              name: category.name,
              description: category.description,
            })),
          };
          setTicketresult(ticketDetail); // Set the fetched ticket result
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
          <div className="col-12 col-lg-5 ticket--intro">
            <img
              className="rounded ticket--img "
              style={{ width: "100%" }}
              src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
              // src={ticketresult.imageUrl}
              alt={ticketresult.name}
            />
            <div className="dropdown">
              <Dropdown
                title={"Description"}
                content=""
                dropdownStatus={false}
                iconDropdown="faList"
              />
            </div>
          </div>
          <div className="ticket--info col-12 col-lg-6">
            <h2 className="ticket--name">{ticketresult.name}</h2>
            <p className="ticket--seller">
              Sold by {}
              <Link
                className="seller--link"
                href={`/sellshop/${ticketresult.author.userId}`}
              >
                <strong>{ticketresult.author.fullname}</strong>
              </Link>
            </p>
            <p>Location: {ticketresult.location} </p>{" "}
            <ul className="tag--list">
              {ticketresult.categories.map((category) => (
                <li className="tag--list--item" key={category.categoryId}>
                  <strong># {category.name}</strong>
                </li>
              ))}
            </ul>
            {/* Replace with actual sold result if available */}
            <div className="tag--list row">
              <p className="">Date: {ticketresult.startDate}</p>
            </div>
            <div className="ticket--price--block rounded">
              <p className="ticket--price">
                <FontAwesomeIcon className="Tag" icon={faTag} />{" "}
                <strong>{ticketresult.cost} VND</strong> {/* Format cost */}
              </p>
              <div className="cta">
                <button className="ticket--btn ticket--detail--btn">
                  <i className="fas fa-shopping-cart cart--icon"></i>
                  Add to cart
                </button>
                <button className="ticket--btn ticket--detail--btn">
                  <i className="fa-solid fa-cash-register cart--icon"></i>
                  Buy Now
                </button>
              </div>
            </div>
            <div className="dropdown">
              <Dropdown
                title={"Review"}
                content=""
                dropdownStatus={true}
                iconDropdown="faShop"
              />
            </div>
          </div>
        </div>

        <div className="ticket--related">
          <h2 className="ticket--title row justify-content-center">
            Related Tickets
          </h2>
          <div className="col-12 ticket--list justify-content-center">
            <div className="card ticket--item col-3 shadow">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket--btn ticket--related--btn">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-12 col-lg-3 ticket--item shadow">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-dark">Card title</h5>
                <p className="card-text text-dark">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className=" ticket--btn ticket--related--btn">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-12 col-lg-3 ticket--item shadow">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-dark">Card title</h5>
                <p className="card-text text-dark">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket--btn ticket--related--btn">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-12 col-lg-3 ticket--item shadow">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title text-dark">Card title</h5>
                <p className="card-text text-dark">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket--btn ticket--related--btn">
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
