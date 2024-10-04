import React from "react";

import Checkoutt from "@/Components/Checkout";
import Background from "@/Components/Background";

const Checkout = () => {
  return (
    <div className="Checkout">
      <Background test={<Checkoutt />} />

    </div>
  );
};

export default Checkout;
