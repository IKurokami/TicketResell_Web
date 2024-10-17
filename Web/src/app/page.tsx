import React from "react";
import Background from "@/Components/Background";
import Banner from "@/Components/Banner";
import Trend from "@/Components/Trend";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import mongoose, { Document, Model } from "mongoose";
import fs from "fs"; // Import the file system module
import path from "path"; // Import path module for working with file paths
import CategoriesBanner from "@/Components/CategoriesBanner";
import HorizontalCards from "@/Components/CategoriesBanner";
// import PaymentStatus from "@/Components/PaymentStatus";
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
      {/* <HorizontalCards categoryId={"CAT001"} title={"Music for the day"} />
      <HorizontalCards categoryId={"CAT003"} title={"Enjoying theater"} />
      <HorizontalCards
        categoryId={"CAT004"}
        title={"Exploding with festival"}
      /> */}
      <div style={{ marginBottom: "3vh" }}></div>
      {/* <PaymentStatus success={true} /> */}
      <Footer />
      {/*     
      <Topticket />
      <Product /> */}
    </div>
  );
};

export default Home;
