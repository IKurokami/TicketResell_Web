import React, { useEffect } from "react";
import Background from "@/Components/Background";
import Banner from "@/Components/Banner";
import Trend from "@/Components/Trend";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const Home = () => {
  return (
    <div className="home">
      {/* <Announce/> */}
      <Navbar page={""} />
      <Background
        test={
          <div>
            <Banner />
          </div>
        }
      />
      <Trend />
      <Footer />
      {/*     
      <Topticket />
      <Product /> */}
    </div>
  );
};

export default Home;
