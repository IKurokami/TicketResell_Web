import React from "react";
import Background from "@/Components/Background";
import StaffDashboard from "@/Components/staff/StaffDashboard";

const staff = () => {
  return (
    <div>
      <Background test={<StaffDashboard />} />
    </div>
  );
};

export default staff;
