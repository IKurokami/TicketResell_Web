import React from "react";

import Background from "@/Components/Background";
import Profile from "@/Components/Profile";
const profile = () => {
  return (
    <div className="Profile">
      <Background test={<Profile />} />
    </div>
  );
};
export default profile;
