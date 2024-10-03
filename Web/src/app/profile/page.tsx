import React from "react";

import Background from "@/Components/Background";
import Profile from "@/Components/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/Css/UserProfile.css'
const profile = () => {
  return (
    <div className="Profile">
      <Background test={<Profile />} />
    </div>
  );
};
export default profile;
