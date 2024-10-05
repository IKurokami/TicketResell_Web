import React from "react";
import Background from "@/Components/Background";
import TicketDetail from "@/Components/TicketDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const Ticket = () => {
  return (
    <div>
      <Background test={<TicketDetail />} />
    </div>
  );
};

export default Ticket;
