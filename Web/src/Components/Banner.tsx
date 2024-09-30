"use client";
import { useState, useEffect, useRef } from "react";
import BannerItemCard, {
  BannerItemCard as ItemCard,
} from "@/models/CategoryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import "@/Css/Banner.css";
import Link from "next/link";
type Ticket = {
  ticketId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  image: string;
  seller: {
    username: string;
  };
};


const Categories = [
  "All",
  "Sport",
  "Gaming",
  "Comedy",
  "Horror",
  "Romance",
  "Musical",
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(""); // For sliding effect
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout reference
  const [BannerItemCards, setBannerItemCards] = useState<ItemCard[]>([]);
  const apiUrl = 'http://localhost:5296/api/Ticket/read';
  
// Function to fetch data from the API
  async function fetchTickets() {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      
      if (result.statusCode === 200 && result.data) {
        // Map API response data to your BannerItemCards structure
        const BannerItemCards = result.data.map((ticket: Ticket) => ({
          imageUrl: ticket.image,
          name: ticket.name,
          date: new Date(ticket.startDate).toLocaleDateString(), // Format date as needed
          author: ticket.seller.username,
          description: `Event at ${ticket.location}`,
          price: `${ticket.cost}k`,
          id: ticket.ticketId
        }));

        setBannerItemCards(BannerItemCards);
        // Here you can use BannerItemCards to render the items on the page
      } else {
        console.error('Failed to fetch tickets:', result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Call the function to fetch and process the data
  fetchTickets();


  // Function to move to the next product
  const nextProduct = () => {
    setAnimationClass("slide-out-left");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 4 < BannerItemCards.length ? prevIndex + 4 : 0
      );
      setAnimationClass("slide-in-right");
    }, 300); // Match the duration of the animation
  };

  // Function to move to the previous product
  const prevProduct = () => {
    setAnimationClass("slide-out-right");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - 4 >= 0
          ? prevIndex - 4
          : BannerItemCards.length - (BannerItemCards.length % 4 || 4)
      );
      setAnimationClass("slide-in-left");
    }, 300); // Match the duration of the animation
  };

  // Function to reset the timer whenever user clicks on prev/next
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(nextProduct, 5000); // Reset to 5 seconds
  };

  useEffect(() => {
    // Initialize the timeout for the first time
    resetTimeout();
    return () => {
      // Clean up timeout when component unmounts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]); // Whenever currentIndex changes, reset the timer

  return (
    <div className="categories">
      <nav className="category-menu" aria-label="Category Navigation">
        {Categories.map((category, index) => (
          <button key={index}>{category}</button>
        ))}
      </nav>

      <div className="category-items-container">
        <FontAwesomeIcon
          className="caret"
          icon={faCaretLeft}
          onClick={() => {
            prevProduct();
            resetTimeout();
          }}
        />
        <div className={`category-items ${animationClass}`}>
          {/* Display four items based on the currentIndex */}
          {BannerItemCards.slice(currentIndex, currentIndex + 4).map(
            (item, index) => (
              <Link href={`/ticket/${item.id}`} key={index}>
              <BannerItemCard itemCart={item} />
          </Link>
            )
          )}
        </div>
        <FontAwesomeIcon
          className="caret"
          icon={faCaretRight}
          onClick={() => {
            nextProduct();
            resetTimeout();
          }}
        />
      </div>
    </div>
  );
};

export default Banner;
