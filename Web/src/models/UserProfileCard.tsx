import React, { useState } from "react";
import {
  FaPencilAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaVenusMars,
  FaBirthdayCake,
  FaSave,
} from "react-icons/fa";

export interface UserProfileCard {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  fullname: string | null;
  sex: string | null;
  createDate: string;
  sellConfigId: string | null;
  bio: string | null;
  birthday: string | null;
  roles: string[];
}

const convertToUserProfileCard = (
  response: any | undefined
): UserProfileCard => {
  return {
    id: response.userId,
    username: response.username,
    email: response.gmail,
    avatar: response.avatar ?? "https://via.placeholder.com/120",
    phone: response.phone ?? "",
    address: response.address ?? "",
    status: response.status,
    fullname: response.fullname ?? "Anonymous",
    sex: response.sex ?? "Not Specified",
    createDate: response.createDate,
    sellConfigId: response.sellConfigId ?? null,
    bio: response.bio ?? "No bio provided",
    birthday: response.birthday ?? "Not Provided",
    roles: response.roles ?? [],
  };
};

export const fetchUserProfile = async (
  id: string | undefined
): Promise<UserProfileCard> => {
  const response = await fetch(`http://localhost:5296/api/user/read/${id}`);
  const responseModel = await response.json();
  const userProfile: UserProfileCard = convertToUserProfileCard(
    responseModel.data
  );
  return userProfile;
};

export const UserProfilePage: React.FC<{ userProfile: UserProfileCard }> = ({
  userProfile,
}) => {
  const [profile, setProfile] = useState(userProfile);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatar || "https://via.placeholder.com/120"
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const userUpdateDto = {
      UserId: profile.id,
      SellConfigId: profile.sellConfigId,
      Username: profile.username,
      Password: null,
      Gmail: profile.email,
      Fullname: profile.fullname,
      Sex: profile.sex,
      Phone: profile.phone,
      Address: profile.address,
      Avatar: profile.avatar,
      Birthday: profile.birthday,
      Bio: profile.bio,
    };

    try {
      const response = await fetch(
        `http://localhost:5296/api/user/update/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userUpdateDto), // Send the DTO
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(convertToUserProfileCard(updatedProfile.data));
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        alert(`Error: ${errorData.title || "Error updating profile"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="profile-container py-5">
      <div className="row">
        <div className="col-lg-4">
          <div className="fluent-card mb-4 mb-lg-0">
            <div className="fluent-card-body text-center">
              <div className="avatar-wrapper mb-4 position-relative">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="fluent-avatar"
                />
                <label htmlFor="avatar" className="avatar-edit-icon">
                  <FaPencilAlt />
                </label>
                <input
                  id="avatar"
                  type="file"
                  className="d-none"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <h4 className="mb-1 fluent-text-title">{profile.username}</h4>
              <p className="text-muted mb-3 fluent-text-secondary">
                {profile.bio}
              </p>
              <p className="fluent-text-secondary small">
                <i className="bi bi-calendar-event me-2"></i>
                Joined: {new Date(profile.createDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="fluent-card">
            <div className="fluent-card-body">
              <h5 className="card-title mb-4 fluent-text-title">
                Profile Information
              </h5>
              <form>
                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="fullname" className="form-label">
                      <FaUser className="me-2" />
                      Full Name
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control fluent-input"
                      id="fullname"
                      name="fullname"
                      value={profile.fullname || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="me-2" />
                      Email
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="email"
                      className="form-control fluent-input"
                      id="email"
                      name="email"
                      value={profile.email || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="phone" className="form-label">
                      <FaPhoneAlt className="me-2" />
                      Phone
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="tel"
                      className="form-control fluent-input"
                      id="phone"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="sex" className="form-label">
                      <FaVenusMars className="me-2" />
                      Sex
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <select
                      className="form-select fluent-select"
                      id="sex"
                      name="sex"
                      value={profile.sex || ""}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Specified">Not Specified</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="bio" className="form-label">
                      <FaPencilAlt className="me-2" />
                      Bio
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control fluent-input"
                      id="bio"
                      name="bio"
                      value={profile.bio || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-sm-3">
                    <label htmlFor="birthday" className="form-label">
                      <FaBirthdayCake className="me-2" />
                      Birthday
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <input
                      type="date"
                      className="form-control fluent-input"
                      id="birthday"
                      name="birthday"
                      value={profile.birthday || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn fluent-btn"
                    onClick={handleSave}
                  >
                    <FaSave className="me-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
