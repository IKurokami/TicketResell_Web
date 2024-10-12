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
      <HorizontalCards />
      <Footer />
      {/*     
      <Topticket />
      <Product /> */}
    </div>
  );
};

export default Home;
