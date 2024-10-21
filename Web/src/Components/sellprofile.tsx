import { fetchImage } from "@/models/FetchImage";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPencilAlt, FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const DEFAULT_IMAGE = "https://images7.alphacoders.com/129/1297416.png";
interface props {
  gmail: string | undefined;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  avatar: string | undefined;
  isAdjustVisible: boolean;
}
const SellProfile: React.FC<props> = ({
  gmail,
  avatar,
  fullname,
  phoneNumber,
  isAdjustVisible,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_IMAGE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [imageFileSelected, setImageFile] = useState<File | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const fetchImageAvatar = async (avatar: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(avatar);
    if (fetchedImageUrl && !error) {
      setAvatarUrl(fetchedImageUrl); // Set the fetched image URL if available
    } else {
      setAvatarUrl(DEFAULT_IMAGE); // Fallback to default image if there's an error
    }
  };
  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setShowSaveButton(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch the avatar when the component mounts or the avatar prop changes
  useEffect(() => {
    if (avatar) {
      fetchImageAvatar(avatar);
    }
  }, [avatar]); // Dependency array includes avatar
  return (
    <div className=" relative profile">
      <img
        className=" w-full object-cover mt-[10vh] max-w-full h-[30vh] bg-gray-100"
        src={DEFAULT_IMAGE}
        alt=""
      />
      <div className="absolute w-[20vh] h-[20vh]  rounded-full left-[3vw] top-[15vh] border-4 border-white bg-gray-100">
        <img
          // src={avatarUrl} // Use the fetched avatarUrl or fallback to default\
          src="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/460954883_544905964579786_8172899952422167802_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHzwcBI_RuFwig6ySbYFB4o_ufYWbVhyiz-59hZtWHKLMEgjb1TnXoccYN07T6KOtbDQ8V35IDwYKs6Gr3r45oO&_nc_ohc=kEx41UCPm-cQ7kNvgG3qBgK&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=AUDVL88Rx0kdLVtWxVHQlM9&oh=00_AYC9DXCKiyOhu_NkB7orhpTi-Q-E0CbQ9RaCLzEiG83_Kg&oe=671C2BEA"
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
                onClick={() => handleOpenEditModal()}
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
        <div className=" mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaPhoneAlt className="text-sm mr-2 text-gray-400" />
            </span>
            {phoneNumber ? phoneNumber : "No Phone Provided"}
          </p>
        </div>
        <div className=" mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaEnvelope className="text-sm mr-2 text-gray-400" />
            </span>
            {gmail ? gmail : "No gmail Provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellProfile;
