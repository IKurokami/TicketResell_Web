import { fetchImage } from "@/models/FetchImage";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const DEFAULT_IMAGE = "https://images7.alphacoders.com/129/1297416.png";
interface props {
  fullname: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  avatar: string | undefined;
  isAdjustVisible: boolean;
}
const SellProfile: React.FC<props> = ({
  address,
  avatar,
  fullname,
  phoneNumber,
  isAdjustVisible,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_IMAGE);
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
        <div className="seller-desc">
          <p className="text-2xl font-medium">
            {fullname ? fullname : "Unknown"}
          </p>
        </div>
        <div className=" mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaPhoneAlt className="text-sm mr-2 text-gray-400" />
            </span>
            {phoneNumber ? phoneNumber : "No Phone Provided"}
          </p>
          <p className="flex items-center text-md text-gray-500">
            <span>
              <MdLocationOn className="text-sm mr-2 text-gray-400" />
            </span>
            {address ? address : "No Address Provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellProfile;
