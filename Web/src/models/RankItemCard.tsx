import React from "react";
import Image from "next/image";

export interface RankItemCardProps {
  rank: string | number;
  ticketImage: string;
  ticketName: string;
  date: string;
  price: string | number;
  amount: string | number;
}

const convertToRankItemCards = (data: any[]): RankItemCardProps[] => {
  return data.map((ticket: any, index: number) => ({
    rank: index + 1, // Calculate rank based on index
    ticketImage:
      //   ticket.image ||
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517", // Default image if none is provided
    ticketName: ticket.name,
    date: new Date(ticket.startDate).toLocaleDateString(), // Format date
    price: ticket.cost,
    amount: ticket.cost, // Assuming amount is the same as the ticket cost
  }));
};

export const fetchTopTicketData = async (): Promise<RankItemCardProps[]> => {
  try {
    // Fetch data from the given URL
    const response = await fetch("http://localhost:5296/api/ticket/gettop/10");

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Convert the fetched data into RankItemCardProps structure
    const ticketList: RankItemCardProps[] = convertToRankItemCards(data.data);
    console.log(ticketList);
    return ticketList;
  } catch (error) {
    console.error("Failed to fetch ticket data:", error);
    return [];
  }
};

export const RankItemCard: React.FC<RankItemCardProps> = ({
  rank,
  ticketImage,
  ticketName: ticketText,
  date,
  price,
  amount,
}) => {
  return (
    <div className="rank-item-card">
      <div className="left-info">
        <span className="rank">{rank}</span>
        <span className="ticket">
          <img src={ticketImage} alt={ticketText} className="ticket-image" />
          {ticketText}
        </span>
      </div>
      <div className="right-info">
        <span className="date">{date}</span>
        <span className="price">{price}</span>
        <span className="amount">{amount}</span>
      </div>
    </div>
  );
};

interface TicketListProps {
  topTicketList: RankItemCardProps[]; // Accept a list of RankItemCardProps as a prop
}

const TicketList: React.FC<TicketListProps> = ({ topTicketList }) => {
  const renderTicketList = () => {
    return topTicketList.map((ticket) => (
      <RankItemCard
        key={ticket.rank} // Use rank as key; ensure it's unique
        rank={ticket.rank}
        ticketImage={ticket.ticketImage}
        ticketName={ticket.ticketName}
        date={ticket.date}
        price={ticket.price}
        amount={ticket.amount}
      />
    ));
  };

  return renderTicketList();
};

export default TicketList;
