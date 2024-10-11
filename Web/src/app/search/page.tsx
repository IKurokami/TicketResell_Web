import React from "react";
import Ads from "@/Components/Ads";
import Background from "@/Components/Background";
import SearchPage from "@/Components/Search";
import "@/Css/Search.css";

const Search = () => {
  return (
    <div className="home">
      {/* <Background test={<Ads />} /> */}
      <SearchPage />

      <div></div>
    </div>
  );
};

export default Search;
