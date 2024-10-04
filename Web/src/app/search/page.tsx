import React, { useEffect } from "react";
import Navbar from "@/Components/Navbar";
import Ads from "@/Components/Ads";
import Footer from "@/Components/Footer";
import Background from "@/Components/Background";
import SearchPage from "@/Components/Search";

const Search = () => {
  return (
    <div className="home">
      <Background test={<Ads />} />
      <SearchPage />

      <div></div>
    </div>
  );
};

export default Search;
