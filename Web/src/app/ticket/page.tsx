import {useRouter} from "next/router";
const TicketDetail = () => {
  const router = useRouter();
  const { name } = router.query;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)", // Adjust based on your header/footer height
        textAlign: "center",
        background: "green"
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", color:"white" }}>Ticket detail : {name}</h1>
    </div>
  );
};

export default TicketDetail;
