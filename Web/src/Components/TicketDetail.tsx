"use client";
import Cookies from "js-cookie";
import "@/Css/TicketDetail.css";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCartShopping,
  faCashRegister,
  faLocationDot,
  faMinus,
  faPlus,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { checkLogin } from "./checkLogin";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { fetchImage } from "@/models/FetchImage";
import addToCart from "@/Hooks/addToCart";
import { useRouter } from "next/navigation";

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
  const { id } = useParams<{ id: string }>();
  const [remainingItems, setRemainingItems] = useState(0);
  const router = useRouter();
  const userId = Cookies.get("id");

  const splitId = () => {
    if (id) {
      return id.split("_")[0];
    } else {
      console.error("id.fullTicketId is undefined or null");
    }
  };

  const [count, setCount] = useState(1);

  const fetchRemainingByID = async (id: string | null) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/count/${id}`,
        {
          method: "GET",
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null;
    }
  };

  const checkRemainingItem = async () => {
    const idOrigin = splitId();
    if (idOrigin) {
      const temp = await fetchRemainingByID(idOrigin);
      return temp.data;
    }
    return 0;
  };

  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const fetchTicketById = async (id: string | null) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/readbyid/${id}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null;
    }
  };

  const { addItem } = addToCart();

  const handleAddToCart = async () => {
    const check = await checkLogin();
    if (check == "False") {
      router.push("/login");
    } else {
      const result = await addItem({
        UserId: userId,
        TicketId: id,
        Quantity: count,
      });
      if (result) {
        console.log("Item added to cart successfully:", result);
      } else {
        console.error("Failed to add item to cart");
      }
    }
  };

  useEffect(() => {
    const loadresult = async () => {
      console.log("Fetched ID:", id);
      if (id) {
        const result = await fetchTicketById(id);
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
              day: "2-digit",
              month: "2-digit",
              hour12: true,
              timeZone: "Asia/Ho_Chi_Minh",
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
          setTicketresult(ticketDetail);
        }
      } else {
        console.error("ID is undefined or invalid.");
      }
    };
    const getRemainingItems = async () => {
      const remaining = await checkRemainingItem();
      setRemainingItems(parseInt(remaining, 10));
    };

    getRemainingItems();
    loadresult();
  }, [id]);

  if (!ticketresult) {
    return (
      <p className="text-center text-xl mt-8 text-red-600">
        Ticket details could not be loaded. Please try again later.
      </p>
    );
  }
  console.log(ticketresult.description);

  return (
    <div className="bg-white min-h-screen pt-20">
      <main className="containerr mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
          <div className="w-full lg:w-5/12 space-y-4">
            <img
              className="rounded-lg ticket--img"
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
          <div className="w-full lg:w-6/12 space-y-4">
            <h2 className="text-3xl font-bold">{ticketresult.name}</h2>
            <p className="text-gray-600">Remaining {remainingItems} item</p>
            <p className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              <span>Sold by</span>
              <Link
                className="text-600 hover:underline seller--link"
                href={`/sellshop/${ticketresult.author.userId}`}
              >
                <strong>{ticketresult.author.fullname}</strong>
              </Link>
            </p>
            <p className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
              <span>
                Location: <strong>{ticketresult.location}</strong>
              </span>
            </p>
            <ul className="flex flex-wrap gap-2 tag--list">
              {ticketresult.categories.map((category) => (
                <li
                  key={category.categoryId}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                >
                  {category.name}
                </li>
              ))}
            </ul>
            <p className="text-gray-600 flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
              <span>
                Date: <strong>{ticketresult.startDate}</strong>
              </span>
            </p>
            <div className="bg-white rounded-lg p-4 shadow-md ticket--price--block">
              <p className="flex items-center space-x-2 text-3xl font-bold text-green-600 ">
                <FontAwesomeIcon icon={faTag} />
                <span>{ticketresult.cost} VND</span>
              </p>
              <div className="flex items-center space-x-4 my-4">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                  onClick={decrease}
                  disabled={count <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="text-xl font-semibold py-2 px-4">{count}</span>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                  onClick={increase}
                  disabled={count >= remainingItems}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                  onClick={handleAddToCart}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                  Add to cart
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                  <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                  Buy Now
                </button>
              </div>
            </div>
            <div className="p-4">
              <Dropdown
                title={"Review"}
                content={ticketresult.description}
                dropdownStatus={true}
                iconDropdown="faShop"
              />
            </div>
          </div>
        </div>
        <div className="ticket--related shadow-md ">
          <h2 className="text-2xl font-bold text-center ">Related Tickets</h2>
          <div className=" movie-grid mx-auto px-10 py-8">
            <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticketresult.imageUrl}
                    alt={ticketresult.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    ${ticketresult.cost}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {ticketresult.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {ticketresult.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticketresult.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list">
                    {ticketresult.categories.map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                  <div className="card-content mt-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ticketresult.description),
                      }}
                      className="text-sm text-gray-700"
                    ></p>
                  </div>
                </div>
                {/* ... (card footer remains the same) */}
              </div>
            </div>
            <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticketresult.imageUrl}
                    alt={ticketresult.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    ${ticketresult.cost}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {ticketresult.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {ticketresult.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticketresult.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list">
                    {ticketresult.categories.map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                  <div className="card-content mt-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ticketresult.description),
                      }}
                      className="text-sm text-gray-700"
                    ></p>
                  </div>
                </div>
                {/* ... (card footer remains the same) */}
              </div>
            </div>
            <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticketresult.imageUrl}
                    alt={ticketresult.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    ${ticketresult.cost}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {ticketresult.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {ticketresult.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticketresult.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list">
                    {ticketresult.categories.map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                  <div className="card-content mt-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ticketresult.description),
                      }}
                      className="text-sm text-gray-700"
                    ></p>
                  </div>
                </div>
                {/* ... (card footer remains the same) */}
              </div>
            </div>
            <div className="movie-card-wrapper cursor-pointer no-underline visited:no-underline">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden movie-card">
                <div className="relative">
                  <img
                    src={ticketresult.imageUrl}
                    alt={ticketresult.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-2xl">
                    ${ticketresult.cost}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    {ticketresult.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {ticketresult.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticketresult.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <ul className="flex flex-wrap gap-2 tag--list">
                    {ticketresult.categories.map((category) => (
                      <li
                        key={category.categoryId}
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                  <div className="card-content mt-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ticketresult.description),
                      }}
                      className="text-sm text-gray-700"
                    ></p>
                  </div>
                </div>
                {/* ... (card footer remains the same) */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                  className="w-full h-90 object-cover"
                  alt="Related ticket"
                />
                <div className="p-4">
                  <h5 className="text-xl font-semibold mb-2">Card title</h5>
                  <p className="text-gray-700 font-bold mb-4">100.000 VND</p>
                  <a
                    href="#"
                    className="block text-center bg-green-500 no-underline hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Add to cart
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </main>
    </div>
  );
};

const RelatedTicketCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
    <img
      src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
      className="w-full h-48 object-cover"
      alt="Related Ticket"
      loading="lazy"
    />
    <div className="p-6">
      <h5 className="text-xl font-semibold mb-3">Related Ticket</h5>
      <p className="text-gray-700 font-bold mb-4">100.000 VND</p>
      <a
        href="#"
        className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        aria-label="Add related ticket to cart"
      >
        Add to cart
      </a>
    </div>
  </div>
);

export default TicketDetail;
