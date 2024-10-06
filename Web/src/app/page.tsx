import React, { useEffect } from "react";
import Background from "@/Components/Background";
import Banner from "@/Components/Banner";
import Trend from "@/Components/Trend";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import mongoose, { Document, Model } from "mongoose";
import fs from "fs"; // Import the file system module
import path from "path"; // Import path module for working with file paths

const Home = () => {
  (async () => {
    const isConnected = await connectDB();
    if (isConnected) {
      const imagePath = path.join(__dirname, "your_image_file.jpg"); // Path to your local image
      const imageId = "your_image_id"; // Set a unique ID for the image

      // Read the image file as a Buffer
      fs.readFile(imagePath, async (err, imageData) => {
        if (err) {
          console.error("Error reading the image file:", err);
          return;
        }
        // Insert the image into the database
        await insertTicketImage(imageId, imageData);
      });
    }
  })();

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
