"use client";
import { useState, useEffect, useRef } from "react";
import { BannerItemCard as ItemCard } from "@/models/CategoryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import "@/Css/Banner.css";
import useShowItem from "@/Hooks/useShowItem";
import Link from "next/link";
import {
  fetchBannerItems,
  CategoriesPage,
  BannerItemCard,
} from "@/models/CategoryCard";

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
  const [bannerItems, setBannerItems] = useState<BannerItemCard[]>([]);
  const itemsToShow = useShowItem();

  // Fetch banner items when the component mounts
  useEffect(() => {
    console.log("Component mounted");
    const fetchData = async () => {
      const data = await fetchBannerItems();
      setBannerItems(data);
    };

    fetchData();
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout reference
  // Function to move to the next product
  const nextProduct = () => {
    setAnimationClass("slide-out-left");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsToShow < bannerItems.length
          ? prevIndex + itemsToShow
          : 0
      );
      setAnimationClass("slide-in-right");
    }, 300); // Match the duration of the animation
  };

  const prevProduct = () => {
    setAnimationClass("slide-out-right");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsToShow >= 0
          ? prevIndex - itemsToShow
          : bannerItems.length -
            (bannerItems.length % itemsToShow || itemsToShow)
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
          <CategoriesPage bannerItems={bannerItems} />
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
