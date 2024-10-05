"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useDropdown from "@/Hooks/useDropDown";

interface ChildComponentProps {
  title: string; // `title` must be a string
  content: string; // `description` must be an object with a text property
}

const Dropdown: React.FC<ChildComponentProps> = ({ title, content }) => {
  const { isDropdownVisible, toggleDropdown } = useDropdown('dropdown-menu');


  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span className="button-content">
          <span className="text">{title}</span>
        </span>
        {isDropdownVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isDropdownVisible && (
        <div className="dropdown-content">
          {/* Add your price history content here */}
          <p>{content}</p>
        </div>
      )}
      <style jsx>{`
        .dropdown-container {
          font-family: Arial, sans-serif;
          width: 100%;
        }
        .dropdown-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 15px;
          background-color: #1e1e1e;
          color: white;
          border: 1px solid #fff;
          border-radius: 5px 5px 0 0;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .dropdown-button:hover {
          background-color: #2a2a2a;
        }
        .button-content {
          display: flex;
          align-items: center;
        }
        .icon {
          margin-right: 10px;
        }
        .text {
          font-weight: bold;
        }
        .dropdown-content {
          padding: 15px;
          background-color: #2a2a2a;
          border: 1px solid #fff;
          border-radius: 0 0 5px 5px;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
