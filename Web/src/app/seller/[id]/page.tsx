import React from "react";
import Background from "@/Components/Background";
import "bootstrap/dist/css/bootstrap.min.css";
import SellerShop from "@/Components/SellerShop";

const Shop = () => {
  return (
    <div>
        <Background test={<SellerShop />} />
    </div>
  );
};

export default Shop;
