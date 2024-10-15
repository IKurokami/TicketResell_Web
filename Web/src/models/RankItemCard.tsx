import React from "react";
import Image from "next/image";
import { fetchImage } from "./FetchImage";
import { log } from "console";
import Link from "next/link";

export interface RankItemCardProps {
  id: string;
  rank: string | number;
  ticketImage: string;
  ticketName: string;
  date: string;
  time: string;
  price: string | number;
  amount: string | number;
}
const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

export interface FetchOptions {
  headers?: HeadersInit;
  body?: BodyInit;
  method?: string;
}
const convertToRankItemCards = async (
  data: any[]
): Promise<RankItemCardProps[]> => {
  const rankItemCards = await Promise.all(
    data.map(async (ticket: any, index: number) => {
      let ticketImage = DEFAULT_IMAGE;

      if (ticket.ticketId) {
        ticket.ticketId;
        const { imageUrl, error } = await fetchImage(ticket.ticketId);

        if (imageUrl) {
          ticketImage = imageUrl;
          console.log(imageUrl);
        } else {
          console.error(
            `Error fetching image for ticket ${index + 1}: ${error}`
          );
        }
      }

      return {
        id: ticket.ticketId,
        rank: index + 1, // Calculate rank based on index
        ticketImage, // Dynamically fetched image or default image
        ticketName: ticket.name,
        date: new Date(ticket.startDate).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }), // Format date
        time: new Date(ticket.startDate).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }), // Format time
        price: ticket.cost,
        amount: ticket.cost, // Assuming amount is the same as the ticket cost
      };
    })
  );

  return rankItemCards;
};

export const fetchTopTicketData = async (
  endpoint: string,
  options?: FetchOptions
): Promise<RankItemCardProps[]> => {
  const fetchOptions: RequestInit = {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: options?.body,
  };

  const response = await fetch(endpoint, fetchOptions);

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  const ticketList: RankItemCardProps[] = await convertToRankItemCards(
    data.data
  );
  console.log(ticketList);
  return ticketList;
};

export const RankItemCard: React.FC<RankItemCardProps> = ({
  id,
  rank,
  ticketImage,
  ticketName: ticketText,
  date,
  time,
  price,
  amount,
}) => {
  return (
    <Link href={"ticket/" + id}>
      <div className="rank-item-card">
        <div className="left-info">
          <span className="rank">{rank}</span>
          <span className="ticket" style={{ width: "22rem" }}>
            <Image
              src={ticketImage}
              alt={ticketText}
              className="ticket-image"
              width={50}
              height={50}
            />
            <div>
              <span>{ticketText}</span>
              <span style={{ fontSize: "0.8rem" }}>{date}</span>
              <span style={{ fontSize: "0.8rem" }}>{time}</span>
            </div>
          </span>
        </div>
        <div className="right-info">
          <span className="price">{price}</span>
        </div>
      </div>
    </Link>
  );
};

interface TicketListProps {
  topTicketList: RankItemCardProps[]; // Accept a list of RankItemCardProps as a prop
}

const TicketList: React.FC<TicketListProps> = ({ topTicketList }) => {
  const renderTicketList = () => {
    return topTicketList.map((ticket) => (
      <RankItemCard
        id={ticket.id}
        key={ticket.rank} // Use rank as key; ensure it's unique
        rank={ticket.rank}
        ticketImage={ticket.ticketImage}
        ticketName={ticket.ticketName}
        date={ticket.date}
        time={ticket.time}
        price={ticket.price}
        amount={ticket.amount}
      />
    ));
  };

  return renderTicketList();
};

export default TicketList;
