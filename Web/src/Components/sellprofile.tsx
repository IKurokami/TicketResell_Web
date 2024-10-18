import React from "react";

const SellProfile = () => {
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
          <p className="text-2xl font-medium">Giap Cao Dinh</p>
        </div>
        <p className="text-lg font-300">Join at </p>
      </div>
    </div>
  );
};

export default SellProfile;
