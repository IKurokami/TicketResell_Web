import React, { useEffect } from "react";
import Navbar from "@/Components/Navbar";
import Background from "@/Components/Background";
import Footer from "@/Components/Footer";

import Announce from "@/Components/Announcement";
import Banner from "@/Components/Banner";
import Topticket from "@/Components/Topticket";
import Product from "@/Components/Product";

const Home = () => {
  return (
    <div className="home">
      
      {/* <Announce/> */}

      <Background test={<Banner />} />
      {/*     
      <Topticket />
      <Product /> */}

  
      <div></div>
    </div>
  );
};

export default Home;
