import React from "react";
import Footer from "@/Components/Footer"; // Import your Footer component
import Login from "@/Components/Login";
import Navbar from "@/Components/Navbar";
import Background from "@/Components/Background";
import Announce from "@/Components/Announcement";
import TicketDetail from "@/Components/TicketDetail";
const Ticket = () => {
  return (
    <div className="Ticket">
      <Background test={<TicketDetail />} />
    </div>
  );
};

export default Ticket;
