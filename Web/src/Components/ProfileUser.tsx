"use client";

import {
  fetchUserProfile,
  UserProfileCard,
  UserProfilePage,
} from "@/models/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import "@/Css/UserProfile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const id = Cookies.get("id");
        if (!id) {
          throw new Error("User ID not found in cookies");
        }
        const profile = await fetchUserProfile(id);
        setUserProfile(profile);
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!userProfile) return <div>No user profile found.</div>;

  return (
    <UserProfilePage
      isadjustvisible={true}
      isSellerProfile={false}
      userProfile={userProfile}
    />
  );
};

export default Profile;
