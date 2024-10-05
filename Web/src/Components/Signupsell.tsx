"use client";
import React, { useState } from "react";
import "@/Css/SignupSell.css";

interface ProfileData {
  address: string | null;
  avatar: string | null;
  bio: string | null;
  birthday: string | null;
  fullname: string | null;
  gmail: string;
  phone: string | null;
  sex: "male" | "female" | "other" | null;
}

const ProfileForm: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    address: null,
    avatar: null,
    bio: null,
    birthday: null,
    fullname: null,
    gmail: "cuong@gmai.com", // Pre-filled as per your example
    phone: null,
    sex: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data submitted:", profileData);
    // Handle form submission here
  };

  return (
    <div className="body">
      <div className="profile-container">
        <div className="profile-header">
          <h1>
            Ticket<span>Resell</span>
          </h1>
         
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gmail">Email</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              value={profileData.gmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sex">Sex</label>
              <select id="sex" name="sex" onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <button type="submit" className="submit-button">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
