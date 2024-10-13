import useShowItem from "@/Hooks/useShowItem";
import { promises } from "dns";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { fetchImage } from "./FetchImage";
import Image from "next/image";

export interface BannerItemCard {
  imageUrl: string;
  name: string;
  date: string;
  author: string;
  description: string;
  price: string;
  id: string;
}

const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

const convertToBannerItemCards = async (
  response: any[]
): Promise<BannerItemCard[]> => {
  const bannerItemCards = await Promise.all(
    response.map(async (item) => {
      let imageUrl = DEFAULT_IMAGE;

      if (item.ticketId) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(
          item.ticketId
        );

        if (fetchedImageUrl) {
          imageUrl = fetchedImageUrl;
        } else {
          console.error(
            `Error fetching image for ticket ${item.ticketId}: ${error}`
          );
        }
      }

      return {
        imageUrl,
        name: item.name,
        date: item.createDate,
        author: "",
        description: "",
        price: item.cost.toString(),
        id: item.ticketId,
      };
    })
  );

  return bannerItemCards;
};

interface CategoriesPageProps {
  bannerItems: BannerItemCard[];
}

export const fetchBannerItems = async (): Promise<BannerItemCard[]> => {
  const bannerItemsRes = await fetch("http://localhost:5296/api/ticket/read");
  const response = await bannerItemsRes.json();
  console.log(response.data);

  const bannerItems: Promise<BannerItemCard[]> = convertToBannerItemCards(
    response.data
  );

  return bannerItems;
};

const BannerItemCard = ({ itemCart }: { itemCart: BannerItemCard }) => {
  return (
    <div className="category-card">
      <Image
        src={itemCart.imageUrl}
        alt={itemCart.name}
        width={50}
        height={50}
      />
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
