// models/TicketCardModel.ts
import { fetchImage } from "./FetchImage";

export interface Categories{
  categoryId:string;
  name:string;
  description:string;
}

export interface TicketCard {
  name: string;
  price: string;
  id: string;
  date: string;
  imageUrl: string;
  categories:Categories[];
  location: string;
}

const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

export const convertToTicketCards = async (response: any[]): Promise<TicketCard[]> => {
  const ticketCards = await Promise.all(
    response.map(async (item) => {
      let imageUrl = DEFAULT_IMAGE;

      if (item.image) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(item.image);

        if (fetchedImageUrl) {
          imageUrl = fetchedImageUrl;
        } else {
          console.error(`Error fetching image for ticket ${item.ticketId}: ${error}`);
        }
      }

      return {
        name: item.name,
        price: item.cost.toString(), // Ensure price is a string
        id: item.ticketId,
        date:  new Date(item.startDate).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour12: true, 
          timeZone: "Asia/Ho_Chi_Minh", 
        }),
        categories: item.categories.map((category: any) => ({
          categoryId: category.categoryId,
          name: category.name,
          description: category.description,
        })),
        location:item.location,
        imageUrl,
      };
    })
  );

  return ticketCards;
};

import Cookies from "js-cookie";


export const fetchTicketItems = async (): Promise<TicketCard[]> => {
  const id = Cookies.get('id');
  if (!id) {
    throw new Error("Seller ID not found");
  }

  const response = await fetch(`http://localhost:5296/api/ticket/readbySellerId/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  const result = await response.json();
  return convertToTicketCards(result.data);
};