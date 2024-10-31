"use client";
import React, { useState,useEffect } from "react";
import UserRequest from "./UserRequest";
import Cookies from "js-cookie";

interface Role {
  roleId: string;
  rolename: string;
  description: string;
}

interface UserData {
  userId: string;
  sellConfigId: string | null;
  username: string;
  status: number;
  createDate: string;
  gmail: string;
  fullname: string;
  sex: string;
  phone: string;
  address: string;
  avatar: string | null;
  birthday: string;
  bio: string | null;
  roles: Role[];
}

const Chatpage = () => {
    const [user, setUser] = useState<UserData | null>(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userId = Cookies.get('id');
          if (!userId) {
            console.error('User ID not found in cookies');
            return;
          }
  
          const response = await fetch(`http://localhost:5296/api/User/read/${userId}`);
          const data= await response.json();
          
          if (data.statusCode === 200) {
            console.log(data.data);
            
            setUser(data.data);
          } else {
            console.error('Failed to fetch user data:', data.message);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, []);
    
    return( <UserRequest userData={user} />);
  };

export default Chatpage;
