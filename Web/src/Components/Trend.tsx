"use client";
import "@/Css/Trend.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import TicketList, {
  fetchTopTicketData,
  RankItemCardProps,
} from "@/models/RankItemCard";

const Trend = () => {
  const [buttonLeftActive, setButtonLeftActive] = useState(1);
  const [buttonRightActive, setButtonRightActive] = useState(2);
  const [TopticketList, setTopTicketList] = useState<RankItemCardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await fetchTopTicketData();
      setTopTicketList(ticketData);
    };

    fetchData().catch((error) => {
      console.error("Failed to fetch top ticket data:", error);
    });
  }, []);

  const splitTicketList = (list: RankItemCardProps[]) => {
    let newList = [...list];
    if (newList.length % 2 !== 0) {
      newList.pop();
    }

    const midpoint = newList.length / 2;

    return [newList.slice(0, midpoint), newList.slice(midpoint)];
  };
  const [firstHalf, secondHalf] = splitTicketList(TopticketList);

  const handleLeftButtonClick = (index: any) => {
    setButtonLeftActive(index);
  };
  const handleRightButtonClick = (index: any) => {
    setButtonRightActive(index);
  };
  return (
    <div>
      <div className="top-bar">
        <nav className="navbar" aria-label="Category Navigation">
          <div className="navbar-left" style={{ display: "flex", gap: "10px" }}>
            <div>
              <button
                className={
                  buttonLeftActive === 0 ? "trend isactivate" : "trend"
                }
                onClick={() => handleLeftButtonClick(0)}
              >
                Trending
              </button>
              <button
                className={buttonLeftActive === 1 ? "soon isactivate" : "soon"}
                onClick={() => handleLeftButtonClick(1)}
              >
                Starting Soon
              </button>
            </div>
          </div>
          <div
            className="navbar-right"
            style={{ display: "flex", gap: "10px" }}
          >
            <button
              className={buttonRightActive === 2 ? "isactivate" : ""}
              onClick={() => handleRightButtonClick(2)}
            >
              1h
            </button>
            <button
              className={buttonRightActive === 3 ? "isactivate" : ""}
              onClick={() => handleRightButtonClick(3)}
            >
              12h
            </button>
            <button
              className={buttonRightActive === 4 ? "isactivate" : ""}
              onClick={() => handleRightButtonClick(4)}
            >
              1d
            </button>
            <button
              className={buttonRightActive === 5 ? "isactivate" : ""}
              onClick={() => handleRightButtonClick(5)}
            >
              1w
            </button>
          </div>
        </nav>
      </div>
      <div className="ranking">
        <div className="left-rank">
          <div className="rank-bar-container">
            <div className="rank-bar">
              <div className="left-info">
                <span className="rank">Rank</span>
                <span className="ticket">Ticket</span>
              </div>
              <div className="right-info">
                <span className="date">Date</span>
                <span className="price">Price</span>
                <span className="amount">Amount</span>
              </div>
            </div>
            <div className="rank-item">
              <TicketList topTicketList={firstHalf} />
            </div>
          </div>
        </div>
        <div className="right-rank">
          <div className="rank-bar-container">
            <div className="rank-bar">
              <div className="left-info">
                <span className="rank">Rank</span>
                <span className="ticket">Ticket</span>
              </div>
              <div className="right-info">
                <span className="date">Date</span>
                <span className="price">Price</span>
                <span className="amount">Amount</span>
              </div>
            </div>
            <div className="rank-item">
              <TicketList topTicketList={secondHalf} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trend;
