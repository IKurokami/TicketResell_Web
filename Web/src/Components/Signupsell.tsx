"use client";
import React, { useState } from "react";
import "@/Css/SignupSell.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProfileData {
  gmail: string | null;
  fullname: string | null;
  sex: "male" | "female" | "other" | null;
  phone: string | null;
  address: string | null;
  birthday: string | null;
}


const ProfileForm: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    gmail: null,
    fullname: null,
    sex: null,
    phone: null,
    address: null,
    birthday: null,
  });
  const route = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    const id = Cookies.get('id');
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5296/api/user/updateseller/${id}`, {
        method: "PUT", // Assuming you're updating the seller, hence using PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated successfully:", data);
        route.push("/sell");
      } else {
        console.error("Error updating profile:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors
    }
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
            <label htmlFor="gmail">Gmail</label>
            <input
              type="gmail"
              id="gmail"
              name="gmail"
              onChange={handleChange}
              placeholder="Enter your gmail"
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
