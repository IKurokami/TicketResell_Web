import useShowItem from "@/Hooks/useShowItem";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export interface BannerItemCard {
  imageUrl: string;
  name: string;
  date: string;
  author: string;
  description: string;
  price: string;
  id: string;
}

const convertToBannerItemCards = (response: any[]): BannerItemCard[] => {
  return response.map((item) => ({
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
    name: item.name,
    date: item.createDate,
    author: "", // or some default value if author information is available
    description: "", // or some default value if description information is available
    price: item.cost.toString(), // Convert cost to string
    id: item.ticketId,
  }));
};

interface CategoriesPageProps {
  bannerItems: BannerItemCard[];
}

export const fetchBannerItems = async (): Promise<BannerItemCard[]> => {
  const bannerItemsRes = await fetch("http://localhost:5296/api/ticket/read");
  const response = await bannerItemsRes.json();
  console.log(response.data);

  const bannerItems: BannerItemCard[] = convertToBannerItemCards(response.data);

  return bannerItems;
};

const BannerItemCard = ({ itemCart }: { itemCart: BannerItemCard }) => {
  return (
    <div className="category-card">
      <img src={itemCart.imageUrl} alt={itemCart.name} />
      <div className="overlay">
        <div className="description">
          <div>
            <h4>{itemCart.name}</h4>
            <p>{itemCart.date}</p>
            <p>By {itemCart.author}</p>
            <p>{itemCart.description}</p>
          </div>
          <p>{itemCart.price}</p>
        </div>
      </div>
    </div>
  );
};

const renderBannerItems = (
  BannerItemCards: BannerItemCard[],
  currentIndex: number,
  itemsToShow: number
) => {
  return BannerItemCards.slice(currentIndex, currentIndex + itemsToShow).map(
    (item, index) => (
      <Link href={`/ticket/${item.id}`} key={index}>
        <BannerItemCard itemCart={item} />
      </Link>
    )
  );
};

export const CategoriesPage = ({
  bannerItems,
}: {
  bannerItems: BannerItemCard[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = useShowItem();
  const animationClass = "fade-in"; // Example animation class

  return (
    <div className={`category-items ${animationClass}`}>
      {renderBannerItems(bannerItems, currentIndex, itemsToShow)}
    </div>
  );
};
