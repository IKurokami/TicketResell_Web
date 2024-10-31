import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPencilAlt, FaPhoneAlt, FaFlag } from "react-icons/fa";
import EditProfilePopup from "./EditProfilePopUp";
import { fetchImage } from "@/models/FetchImage";
import uploadImageForTicket from "@/models/UpdateImage";
import Link from "next/link";

const DEFAULT_IMAGE = "https://images7.alphacoders.com/129/1297416.png";

interface FormData {
  userid: string;
  fullName: string | undefined;
  sex: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  birthday: string | undefined;
  bio: string | undefined;
}

interface Props {
  birthday: string | undefined;
  address: string | undefined;
  bio: string | undefined;
  sex: string | undefined;
  gmail: string | undefined;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  avatar: string | undefined;
  isAdjustVisible: boolean;
  userId: string;
  onSave: (data: FormData) => void;
}

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);
  const reportReasons = [
    "Bán vé giả hoặc không hợp lệ",
    "Giá vé quá cao so với thị trường",
    "Gian lận trong giao dịch",
    "Chính sách hoàn tiền không rõ ràng",
    "Dịch vụ khách hàng kém",
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" style={{ zIndex: 500 }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl transform transition-transform duration-300 ease-out scale-95 sm:scale-100 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Báo cáo người dùng</h2>
        <ul>
          {reportReasons.map((reason, index) => (
            <li key={index} className="mb-3">
              <label className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  className="mr-3 text-blue-500 border-gray-300 focus:ring-blue-400 focus:ring-2 rounded transition-all"
                />
                {reason}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-5 rounded-lg mr-3 hover:bg-red-600 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Gửi báo cáo
          </button>
        </div>
        {showAlert && (
          <div className="mt-6 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-center animate-fade-in">
            Bạn đã gửi báo cáo
          </div>
        )}
      </div>
    </div>
  );
};

const SellProfile: React.FC<Props> = ({
  birthday,
  address,
  bio,
  sex,
  gmail,
  avatar,
  fullname,
  phoneNumber,
  isAdjustVisible,
  userId,
  onSave,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_IMAGE);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(DEFAULT_IMAGE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const coverId = `${userId}_cover`;

  const fetchImageAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setAvatarUrl(fetchedImageUrl);
    }
  };

  const fetchImageCoverAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setCoverImageUrl(fetchedImageUrl);
    }
  };

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleReportClick = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const formData: any = {
    userid: userId,
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

  const handleCoverAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    fetchImageAvatar(userId);
    fetchImageCoverAvatar(coverId);
  }, [avatar]);

  return (
    <div className="relative profile">
      <img
        className="w-full object-cover mt-[10vh] max-w-full h-[45vh] bg-gray-100"
        src={coverImageUrl}
        alt=""
      />
      {isAdjustVisible && (
        <>
          <label
            htmlFor="coveravatar"
            className="flex items-center absolute top-[35vh] left-[87vw] px-4 py-2 bg-gray-500 rounded text-gray-600 p-1.5 cursor-pointer"
          >
            <FaPencilAlt className="mr-2 text-white" size={12} />
            <span className="text-white">Thêm ảnh bìa</span>
          </label>
          <input id="coveravatar" type="file" className="hidden" onChange={handleCoverAvatarChange} accept="image/*" />
        </>
      )}
      <div className="absolute w-[20vh] h-[20vh] rounded-full left-[3vw] top-[30vh] border-4 border-white bg-gray-100">
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        {isAdjustVisible && (
          <>
            <label htmlFor="avatar" className="absolute bottom-2 right-2 bg-gray-200 text-gray-600 p-1.5 rounded-full cursor-pointer">
              <FaPencilAlt size={12} />
            </label>
            <input id="avatar" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
          </>
        )}
      </div>
      <div className="px-[3vw] mt-[8vh] mb[5vh]">
        <div className="flex justify-between">
          <div className="seller-desc flex items-center space-x-2">
            <Link href={`/profile/${userId}`} className="no-underline text-black" passHref>
              <p className="text-2xl font-medium">{fullname ? fullname : "Unknown"}</p>
            </Link>
            <button onClick={handleReportClick} className="text-red-500 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center mb-2" aria-label="Report">
              <FaFlag />
            </button>
          </div>
          <div className="flex space-x-2">
            {isAdjustVisible ? (
              <button onClick={handleOpenEditModal} className="bg-gray-600 text-white py-2 px-4 rounded flex items-center hover:bg-gray-700">
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center hover:bg-blue-600">
                Theo dõi
              </button>
            )}
          </div>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <FaPhoneAlt className="text-sm mr-2 text-gray-400" />
            {phoneNumber ? phoneNumber : "No Phone Provided"}
          </p>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <FaEnvelope className="text-sm mr-2 text-gray-400" />
            {gmail ? gmail : "No gmail Provided"}
          </p>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfilePopup isOpen={isEditModalOpen} onClose={handleCloseEditModal} userId={userId} initialData={formData} onSave={onSave} />
      )}

      {/* Render ReportModal */}
      <ReportModal isOpen={isReportModalOpen} onClose={closeReportModal} />
    </div>
  );
};

export default SellProfile;
