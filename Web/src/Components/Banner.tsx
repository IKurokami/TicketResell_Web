  "use client";
  import { useState, useEffect, useRef } from "react";
  import { BannerItemCard } from "@/models/CategoryCard";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
  import "@/Css/Banner.css";
  import useShowItem from "@/Hooks/useShowItem";
  import Link from "next/link";
  import { fetchBannerItems, CategoriesPage } from "@/models/CategoryCard";

  const Categories = [
    "Tất cả",
    "Thể thao",
    "Trò chơi",
    "Hài hước",
    "Kinh dị",
    "Lãng mạn",
    "Âm nhạc",
  ];

  const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState("");
    const [bannerItems, setBannerItems] = useState<BannerItemCard[]>([]);
    const itemsToShow = useShowItem();

    useEffect(() => {
      console.log("Component mounted");
      const fetchData = async () => {
        const data = await fetchBannerItems();
        setBannerItems(data);
      };

      fetchData();
    }, []);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getNextIndex = (currentIndex: number): number => {
      const remainingItems = bannerItems.length - currentIndex;

      if (remainingItems <= itemsToShow) {
        return 0;
      }
      return currentIndex + itemsToShow;
    };

    const getPrevIndex = (currentIndex: number): number => {
      if (currentIndex === 0) {
        const remainder = bannerItems.length % itemsToShow;
        if (remainder === 0) {
          return bannerItems.length - itemsToShow;
        }
        return bannerItems.length - remainder;
      }
      return Math.max(0, currentIndex - itemsToShow);
    };

    const nextProduct = () => {
      setAnimationClass("slide-out-left");
      setTimeout(() => {
        setCurrentIndex(getNextIndex(currentIndex));
        setAnimationClass("slide-in-right");
      }, 300);
    };

    const prevProduct = () => {
      setAnimationClass("slide-out-right");
      setTimeout(() => {
        setCurrentIndex(getPrevIndex(currentIndex));
        setAnimationClass("slide-in-left");
      }, 300);
    };

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(nextProduct, 5000);
    };

    useEffect(() => {
      resetTimeout();
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [currentIndex]);

    const getVisibleItems = () => {
      const endIndex = currentIndex + itemsToShow;
      const items = bannerItems.slice(currentIndex, endIndex);

      if (items.length < itemsToShow && currentIndex !== 0) {
        setCurrentIndex(0);
        return bannerItems.slice(0, itemsToShow);
      }

      return items;
    };

    const visibleItems = getVisibleItems();

    return (
      <div className="categories">
        <nav className="category-menu" aria-label="Điều hướng danh mục">
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
            <CategoriesPage bannerItems={visibleItems} />
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
