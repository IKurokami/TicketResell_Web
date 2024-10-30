import React from "react";
import Background from "@/Components/Background";
import UserRequest from "@/Components/ChatBox/UserRequest";

const requestchat = () => {
  return (
    <Background test={<UserRequest  />} />
  );
};
export default requestchat;
