import React from "react";

interface props {
  userId: string | undefined;
  username: string | undefined;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  avatar: string | undefined;
}
const SellProfile: React.FC<props> = ({
  userId,
  address,
  avatar,
  fullname,
  phoneNumber,
  username,
}) => {
  return (
    <div className=" relative profile">
      <img
        className=" w-full object-cover mt-[10vh] max-w-full h-[30vh] bg-gray-100"
        src="https://images7.alphacoders.com/129/1297416.png"
        alt=""
      />
      <div className="absolute w-[12vw] h-[12vw] rounded-full left-[3vw] top-20 border-4 border-white bg-gray-100">
        <img
          src="https://images7.alphacoders.com/129/1297416.png"
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="px-[3vw] mt-[10vh]">
        <div className="seller-desc">
          <p className="text-2xl font-medium">{fullname}</p>
        </div>
        <div className="flex gap-x-2 mt-2">
          <p className="text-md text-gray-500">Phone: {phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default SellProfile;
