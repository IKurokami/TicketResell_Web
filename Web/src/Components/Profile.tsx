'use client'
import { fetchUserProfile, UserProfileCard, UserProfilePage } from "@/models/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Profile = () => {
    const [userProfile, setUserProfile] = useState<UserProfileCard>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const id = Cookies.get('id');
                if (!id) {
                    throw new Error('User ID not found in cookies');
                }
                const profile = await fetchUserProfile(id);
                setUserProfile(profile);
            } catch (err) {
                setError('Failed to load user profile. Please try again later.');
                console.error(err);
            }
        };
        loadUserProfile();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!userProfile) return <div>Loading...</div>;
    return <UserProfilePage userProfile={userProfile} />;
}

export default Profile;