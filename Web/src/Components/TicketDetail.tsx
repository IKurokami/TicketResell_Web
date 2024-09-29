import React from "react";
import "./TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// Thêm file CSS cho styling nếu cần

const TicketDetail = () => {
  return (
    <main className="container">
      <div className="ticket--image col-12 col-lg-4"></div>
      <div className="ticket--info col-12 col-lg-8">
        <h2 className="ticket--name">Gratian</h2>
        <p className="ticket--seller">Owned by 9E72D9</p>
      </div>
    </main>
  );
};

export default TicketDetail;
