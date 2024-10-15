"use client"
import React from "react";
import Login from "@/Components/Login";
import { SessionProvider } from "next-auth/react";

const Signin = () => {
  return (
    <div className="Signin">
      <SessionProvider>{<Login />}</SessionProvider>
    </div>
  );
};

export default Signin;
