
interface TicketDetailProps {
    ticketId: string;
    ticketName: string;
    // Các thuộc tính khác của ticket nếu có
  }

const TicketDetail = (props: TicketDetailProps) => {
  console.log("Check", props);
  return (
    <div
      style={{  
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)", // Adjust based on your header/footer height
        textAlign: "center",
        background: "white",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "black" }}>
        Ticket detail 
      </h1>
    </div>
  );
};
export default TicketDetail;
