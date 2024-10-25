"use client";
import Cookies from "js-cookie";
import "@/Css/TicketDetail.css";
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
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { fetchImage } from "@/models/FetchImage";
import addToCart from "@/Hooks/addToCart";
import { useRouter } from "next/navigation";
import RelatedTicket from "./RelatedTicket";
import Notification_Popup from "./Notification_PopUp";
import { fetchRemainingByID } from "@/models/TicketFetch";
import { NumberContext } from "./NumberContext";

interface TicketDetail {
  id: string;
}

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
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [categoriesId, setCategories] = useState<string[]>([]);
  const [remainingItems, setRemainingItems] = useState(0);
  const router = useRouter();
  const userId = Cookies.get("id");
  const [checkOwner, setCheckOwner] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const splitId = () => {
    if (id) {
      return id.split("_")[0];
    } else {
      console.error("id.fullTicketId is undefined or null");
      return null;
    }
  };
  const baseId = splitId();
  const context = useContext(NumberContext);

  const [count, setCount] = useState(1);
  const handleClosePopup = () => {
    setShowPopup(false);
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
  const checkRemaining = async () => {
    try {
      const response = await fetchRemainingByID(baseId);
      setRemainingItems(response);
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
        setShowPopup(true);

        const increaseNumber = () => {
          if (context) {
            const { number, setNumber } = context;

            let num = Number(number) || 0;
            num += 1;
            setNumber(num);
            console.log("change cart count to ", num);
          }
        };
        increaseNumber();
        console.log("Item added to cart successfully:", result);
      } else {
        console.error("Failed to add item to cart");
      }
    }
  };
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
              hour12: false,
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            author: result.data.seller,
            location: `${result.data.location}`,
            cost: result.data.cost,
            description: result.data.description,
            categories: result.data.categories.map((category: any) => ({
              categoryId: category.categoryId,
              name: category.name,
              description: category.description,
            })),
          };
          setTicketresult(ticketDetail);
          if (result.data.seller.userId == userId) {
            setCheckOwner(true);
          }
          const categoryIds = ticketDetail.categories.map(
            (category: any) => category.categoryId
          );
          setCategories(categoryIds);
          console.log(categoryIds);
        }
      } else {
        console.error("ID is undefined or invalid.");
      }
    };
    checkRemaining();
    loadresult();
  }, [id]);

  if (!ticketresult) {
    return (
      <p className="text-center text-xl mt-8 text-red-600">
        Ticket details could not be loaded. Please try again later.
      </p>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      <main className="containerr mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
          <div className="w-full lg:w-5/12 space-y-4 items-stretch ">
            <img
              className="rounded-lg object-cover w-full ticket--img h:full lg:h-[35vw] xl:h-[30.6vw] 2xl:h-[29vw] "
              src={ticketresult.imageUrl}
              alt={ticketresult.name}
            />
            <div className="dropdown pt-4">
              <Dropdown
                title={"Description"}
                content={ticketresult.description}
                dropdownStatus={false}
                iconDropdown="faList"
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 space-y-[1vw] ">
            <div className="lg:text-[1.125vw] space-y-[0.5vw]">
              <h2 className="lg:text-[2.5vw] font-bold">{ticketresult.name}</h2>
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
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-500"
                />
                <span>
                  Location: <strong>{ticketresult.location}</strong>
                </span>
              </p>
              <ul className="flex flex-wrap gap-2 tag--list">
                {ticketresult.categories.slice(0, 5).map((category) => (
                  <Link
                  key={category.categoryId}
                    className="no-underline "
                    href={{
                      pathname: `/search`,
                      query: {
                        cateName: category.name,
                      },
                    }}
                  >
                    <li
                      
                      className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-full text-sm font-semibold  {"
                    >
                      {category.name}
                    </li>
                  </Link>
                ))}
                {ticketresult.categories.length > 5 && (
                  <li className="bg-gray-300 text-white px-3 rounded-full text-sm font-semibold">
                    ...
                  </li>
                )}
              </ul>
            </div>
            <p className="text-gray-600 flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-500" />
              <span>
                Date: <strong>{ticketresult.startDate}</strong>
              </span>
            </p>
            <div className="bg-white rounded-lg px-4 py-[3vh] ticket--price--block ">
              <p className="flex items-center space-x-2 text-2xl lg:text-[2.5vw] font-bold text-green-600 ">
                <FontAwesomeIcon icon={faTag} />
                <span>{formatVND(ticketresult.cost)}</span>
              </p>
              <div className="flex items-center space-x-[1vw] my-[1.5vw] lg:text-[1.5vw]">
                <button
                  className="bg-white-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-[0.75vw] rounded ticket--detail--btn 	"
                  onClick={decrease}
                  disabled={count <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className=" font-semibold py-2 px-[3vw] rounded ticket--detail--btn">
                  {count}
                </span>
                <button
                  className="bg-white-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-[0.75vw] rounded ticket--detail--btn"
                  onClick={increase}
                  disabled={count >= remainingItems}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              {!checkOwner && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="bg-green-500 hover:bg-green-400 grow text-white font-bold py-2 rounded flex items-center justify-center transform transition-transform duration-300 hover:scale-105"
                    onClick={handleAddToCart}
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                    Add to cart
                  </button>
                  {/* Show the Success Popup */}
                  <Notification_Popup
                    message="Ticket added to cart successfully!"
                    show={showPopup}
                    onClose={handleClosePopup}
                  />
                  <button className="bg-green-500 hover:bg-green-400 grow text-white font-bold py-2 rounded flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                    <FontAwesomeIcon icon={faCashRegister} className="mr-2" />
                    Buy Now
                  </button>
                </div>
              )}
            </div>
            <div className="pt-4">
              <Dropdown
                title={"Review"}
                content={ticketresult.description}
                dropdownStatus={true}
                iconDropdown="faShop"
              />
            </div>
          </div>
        </div>
        <RelatedTicket categoriesId={categoriesId} ticketID={baseId} />
      </main>
    </div>
  );
};

export default TicketDetail;
