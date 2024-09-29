import TicketDetail from "@/Components/Banner";

interface TicketDetailProps {
  ticketId: string;
  ticketName: string;
  // Các thuộc tính khác của ticket nếu có
}

const Ticket = (props: TicketDetailProps) => {
  console.log("Check", props);
  return (
    <div className="ticket--detail">
      <TicketDetail />
    </div>
  );
};
export default Ticket;
