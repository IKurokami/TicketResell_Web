"use client";
import "../Css/TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCashRegister,
  faLocationDot,
  faMinus,
  faPlus,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { fetchImage } from "@/models/FetchImage";

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
  imageId: string;
  imageUrl: string;
  description: string;
  categories: Category[];
};
const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL parameters
  const [title, setTitle] = useState("");
  const DEFAULT_IMAGE =
    "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";
  const [count, setCount] = useState(1);
  const increase = () => {
    setCount(count + 1);
  };
  const decrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
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
        result.data.imageUrl = DEFAULT_IMAGE;
        if (result.data.image) {
          const { imageUrl: fetchedImageUrl, error } = await fetchImage(
            result.data.image
          );
          if (fetchedImageUrl) {
            result.data.imageUrl = fetchedImageUrl;
          } else {
            console.error(
              `Error fetching image for ticket ${result.data.image}: ${error}`
            );
          }
        }
        if (result) {
          const ticketDetail: Ticket = {
            imageUrl: result.data.imageUrl,
            imageId: result.data.image,
            name: result.data.name,
            startDate: new Date(result.data.startDate).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour12: true, // Use true if you want AM/PM format
              timeZone: "Asia/Ho_Chi_Minh", // Vietnam timezone
            }),
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
  console.log(ticketresult.description);

  return (
    <div className="bg-ticket-detail">
      <main className="container">
        <div className="row ticket--detail">
          <div className="col-12 col-lg-5 ticket--intro">
            <img
              className="rounded ticket--img "
              // src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
              src={ticketresult.imageUrl}
              alt={ticketresult.name}
            />
            <div className="dropdown">
              <Dropdown
                title={"Description"}
                content={ticketresult.description}
                dropdownStatus={false}
                iconDropdown="faList"
              />
            </div>
          </div>
          <div className="ticket--info col-12 col-lg-6">
            <h2 className="ticket--name">{ticketresult.name}</h2>
            <p className="ticket--seller">
              <span>
                <FontAwesomeIcon className="Tag" icon={faUser} />
              </span>
              Sold by {}
              <Link
                className="seller--link"
                href={`/sellshop/${ticketresult.author.userId}`}
              >
                <strong>{ticketresult.author.fullname}</strong>
              </Link>
            </p>
            <p>
              <span>
                <FontAwesomeIcon className="Tag" icon={faLocationDot} />
              </span>
              Location: {ticketresult.location}{" "}
            </p>{" "}
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
              <div className="ticket--number mb-3 ml-5">
                <button
                  className="number--btn"
                  onClick={decrease}
                  disabled={count <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <div className="number--block">{count}</div>
                <button className="number--btn" onClick={increase}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="cta">
                <button className="ticket--btn ticket--detail--btn">
                  <FontAwesomeIcon
                    className="cart--icon"
                    icon={faCartShopping}
                  />
                  Add to cart
                </button>
                <button className="ticket--btn ticket--detail--btn">
                  <FontAwesomeIcon className="cart--icon" icon={faCashRegister} />
                  Buy Now
                </button>
              </div>
            </div>
            <div className="dropdown">
              <Dropdown
                title={"Review"}
                content={ticketresult.description}
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
            <div className="card col-12 col-lg-3 ticket--item shadow">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
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
