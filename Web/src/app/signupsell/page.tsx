import React from "react";
import Background from "@/Components/Background";
import Signupsell from "@/Components/Signupsell";
import "@/Css/SignupSell.css"

const profile = () => {
  return (
    <div className="profile">
      <Background test={<Signupsell/>} />
    </div>
  );
};
export default profile;
