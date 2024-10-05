"use client";
import "@/Css/Trend.css";
import { useState } from "react";

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
    </div>
  );
};

export default Trend;
