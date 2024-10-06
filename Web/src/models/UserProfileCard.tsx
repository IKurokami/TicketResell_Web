import React, { useState } from "react";
import {
    FaPencilAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaUser,
    FaChevronRight,
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

export interface UserUpdateDto {
    UserId: string;
    SellConfigId: string | null;
    Username: string;
    Password: string | null;
    Gmail: string;
    Fullname: string | null;
    Sex: string | null;
    Phone: string | null;
    Address: string | null;
    Avatar: string | null;
    Birthday: string | null;
    Bio: string | null;
}

const convertToUserProfileCard = (
    response: undefined | any
): UserProfileCard => {
    return {
        id: response.userId,
        username: response.username,
        email: response.gmail,
        avatar: response.avatar ?? "https://picsum.photos/200",
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
        profile.avatar || "https://picsum.photos/200"
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setProfile({ ...profile, avatar: reader.result as string });
                setShowSaveButton(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (avatarOnly: boolean = false) => {
        const userUpdateDto: UserUpdateDto = {
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

        if (avatarOnly) {
            // Only update the avatar if saving from the quick save button
            userUpdateDto.Avatar = profile.avatar;
        }

        setIsEditModalOpen(false);
        setShowSaveButton(false);

        try {
            const response = await fetch(
                `http://localhost:5296/api/user/update/${profile.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userUpdateDto),
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

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    return (
        <div className="bg-transparent min-h-screen font-sans mt-16">
            <div className="max-w-md mx-auto pt-16 px-4">
                {/* Header */}
                <div className="bg-white rounded-t-xl shadow-sm">
                    <div className="relative pt-8 pb-4 px-4 text-center">
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover"
                                />
                                <label
                                    htmlFor="avatar"
                                    className="absolute bottom-0 right-0 bg-gray-200 text-gray-600 p-1.5 rounded-full cursor-pointer"
                                >
                                    <FaPencilAlt size={12} />
                                </label>
                                <input
                                    id="avatar"
                                    type="file"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 mt-12">
                            {profile.username}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>
                        {showSaveButton && (
                            <button
                                onClick={() => handleSaveProfile(true)}
                                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                            >
                                <FaSave className="mr-2" /> Save Avatar
                            </button>
                        )}
                    </div>
                </div>

                {/* User Information */}
                <div className="bg-white shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-600 flex items-center">
                            <FaPhoneAlt className="mr-3 text-gray-400" />
                            {profile.phone ? profile.phone : "No Phone Provided"}
                        </p>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-600 flex items-center">
                            <FaEnvelope className="mr-3 text-gray-400" />
                            {profile.email}
                        </p>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-sm text-gray-600 flex items-center">
                            <FaUser className="mr-3 text-gray-400" />
                            {profile.sellConfigId ? "Bank Info Added" : "No Bank Info"}
                        </p>
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                        onClick={() => handleOpenEditModal()}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between"
                    >
                        <span>Edit Profile</span>
                        <FaChevronRight className="text-gray-400" />
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between">
                        <span>Change Password</span>
                        <FaChevronRight className="text-gray-400" />
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between">
                        <span>Add Bank Info</span>
                        <FaChevronRight className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center sm:items-center p-4">
                    <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <button
                                onClick={handleCloseEditModal}
                                className="text-blue-500 font-semibold"
                            >
                                Cancel
                            </button>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Edit Profile
                            </h2>
                            <button
                                onClick={() => handleSaveProfile()}
                                className="text-blue-500 font-semibold"
                            >
                                Save
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={profile.username}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <input
                                    type="text"
                                    name="bio"
                                    value={profile.bio ?? ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={profile.email}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={profile.phone ?? ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};