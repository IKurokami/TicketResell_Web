import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PaymentStatus from "@/Components/PaymentStatus";
const PaymentReturn = () => {
  return (
    <div className="home">
      {/* <Announce/> */}
      <Navbar page={"ticket"} />
      <PaymentStatus />
      <Footer />
      {/*     
      <Topticket />
      <Product /> */}
    </div>
  );
};

export default PaymentReturn;
