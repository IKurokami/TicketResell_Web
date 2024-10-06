"use client";
import "@/Css/Trend.css";
import { useState } from "react";
import Image from "next/image";
const Trend = () => {
  const [buttonLeftActive, setButtonLeftActive] = useState(1);
  const [buttonRightActive, setButtonRightActive] = useState(2);
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
              <div className="rank-item-card">
                <div className="left-info">
                  <span className="rank">1</span>
                  <span className="ticket">
                    <img
                      src={
                        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517"
                      }
                      alt="Picture of the author"
                    />
                    Concert ticket
                  </span>
                </div>
                <div className="right-info">
                  <span className="date">12/9/2024</span>
                  <span className="price">15$</span>
                  <span className="amount">50</span>
                </div>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trend;
