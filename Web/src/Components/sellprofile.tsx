import { fetchImage } from "@/models/FetchImage";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPencilAlt, FaPhoneAlt } from "react-icons/fa";
import EditProfilePopup from "./EditProfilePopUp";
import uploadImageForTicket from "@/models/UpdateImage";
import { Image } from "lucide-react";

const DEFAULT_IMAGE = "https://images7.alphacoders.com/129/1297416.png";

interface FormData {
  fullName: string | undefined;
  sex: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  birthday: string | undefined;
  bio: string | undefined;
}
interface props {
  birthday: string | undefined;
  address: string | undefined;
  bio: string | undefined;
  sex: string | undefined;
  gmail: string | undefined;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  avatar: string | undefined;
  isAdjustVisible: boolean;
  userId: string; // Add userId prop to pass to EditProfilePopup
}

const SellProfile: React.FC<props> = ({
  birthday,
  address,
  bio,
  sex,
  gmail,
  avatar,
  fullname,
  phoneNumber,
  isAdjustVisible,
  userId, // Pass userId to EditProfilePopup
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_IMAGE);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(DEFAULT_IMAGE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control EditProfilePopup visibility
  const coverId = `${userId}_cover`;

  const fetchImageAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setAvatarUrl(fetchedImageUrl); // Set the fetched image URL if available
    }
  };
  const fetchImageCoverAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setCoverImageUrl(fetchedImageUrl); // Set the fetched image URL if available
    }
  };
  const handleOpenEditModal = () => setIsEditModalOpen(true); // Open the popup
  const handleCloseEditModal = () => setIsEditModalOpen(false); // Close the popup
  const formData: FormData = {
    fullName: fullname,
    sex: sex,
    phone: phoneNumber,
    address: address,
    birthday: birthday,
    bio: bio,
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      uploadImageForTicket(userId, file);
      reader.readAsDataURL(file);
    }
  };
  const handleCoverAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      uploadImageForTicket(coverId, file);
      reader.readAsDataURL(file);
    }
  };

  // Fetch the avatar when the component mounts or the avatar prop changes
  useEffect(() => {
    fetchImageAvatar(userId);
    fetchImageCoverAvatar(coverId);
  }, [avatar]); // Dependency array includes avatar

  return (
    <div className="relative profile">
      <img
        className="w-full object-cover mt-[10vh] max-w-full h-[50vh] bg-gray-100"
        src={coverImageUrl}
        alt=""
      />
      {isAdjustVisible && (
        <>
          <label
            htmlFor="coveravatar"
            className="flex items-center absolute top-[40vh] left-[87vw] px-4 py-2 bg-gray-500 rounded text-gray-600 p-1.5 cursor-pointer"
          >
            <FaPencilAlt className="mr-2 text-white" size={12} />
            <span className="text-white">Thêm ảnh bìa</span>
          </label>
          <input
            id="coveravatar"
            type="file"
            className="hidden"
            onChange={handleCoverAvatarChange}
            accept="image/*"
          />
        </>
      )}
      <div className="absolute w-[20vh] h-[20vh] rounded-full left-[3vw] top-[35vh] border-4 border-white bg-gray-100">
        <img
          src={avatarUrl} // Use the fetched avatarUrl or fallback to default
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
        {isAdjustVisible && (
          <>
            <label
              htmlFor="avatar"
              className="absolute bottom-2 right-2 bg-gray-200 text-gray-600 p-1.5 rounded-full cursor-pointer"
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
          </>
        )}
      </div>
      <div className="px-[3vw] mt-[8vh] mb[5vh]">
        <div className="flex justify-between">
          <div className="seller-desc">
            <p className="text-2xl font-medium">
              {fullname ? fullname : "Unknown"}
            </p>
          </div>
          <div className="flex space-x-2">
            {isAdjustVisible ? (
              // "Chỉnh sửa trang cá nhân" Button
              <button
                onClick={handleOpenEditModal} // Open the edit popup on click
                className="bg-gray-600 text-white py-2 px-4 rounded flex items-center hover:bg-gray-700"
              >
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              // "Theo dõi" Button
              <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center hover:bg-blue-600">
                Theo dõi
              </button>
            )}
          </div>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaPhoneAlt className="text-sm mr-2 text-gray-400" />
            </span>
            {phoneNumber ? phoneNumber : "No Phone Provided"}
          </p>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaEnvelope className="text-sm mr-2 text-gray-400" />
            </span>
            {gmail ? gmail : "No gmail Provided"}
          </p>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {isEditModalOpen && (
        <EditProfilePopup
          isOpen={isEditModalOpen} // Ensure the isOpen prop is passed
          onClose={handleCloseEditModal} // Close the popup
          userId={userId} // Pass the userId as required
          initialData={formData}
        />
      )}
    </div>
  );
};

export default SellProfile;
