import React from "react";
import Background from "@/Components/Background";
import TicketDetail from "@/Components/TicketDetail";
const Ticket = () => {
  return (
    <div className="Ticket">
      <Background test={<TicketDetail />} />
    </div>
  );
};

export default Ticket;
