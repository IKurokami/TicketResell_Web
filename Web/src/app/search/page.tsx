import React, { useEffect } from "react";
import Navbar from "@/Components/Navbar";
import Ads from "@/Components/Ads";
import Footer from "@/Components/Footer";
import Background from "@/Components/Background";

import SearchPage from "@/Components/Search";


const Search = () => {
    return (
        <div className="home">
            <Navbar />

            <Background test={<Ads />} />
            <SearchPage />


            <Footer />
            <div></div>
        </div>
    );
};

export default Search;
