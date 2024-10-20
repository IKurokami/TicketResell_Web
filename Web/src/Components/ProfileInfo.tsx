import React from "react";

const ProfileInfo: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="font-bold text-xl mb-4">About</h2>
        <div className="flex items-center mb-4">
          <span className="material-icons">male</span>
          <p className="ml-2">Male</p>
        </div>
        <div className="flex items-center mb-4">
          <span className="material-icons">cake</span>
          <p className="ml-2">Born June 26, 1980</p>
        </div>
        <div className="flex items-center mb-4">
          <span className="material-icons">location_on</span>
          <p className="ml-2">2239 Hog Camp Road, Schaumburg</p>
        </div>
        <div className="flex items-center mb-4">
          <span className="material-icons">email</span>
          <p className="ml-2">charles5182@ummoh.com</p>
        </div>
        <div className="flex items-center">
          <span className="material-icons">phone</span>
          <p className="ml-2">33757005467</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-purple-500">
              Followers
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-500">
              Following
            </a>
            <a
              href="#"
              className="text-purple-500 font-bold border-b-2 border-purple-500"
            >
              Posts
            </a>
          </nav>
        </div>

        {/* Posts */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <img
              src="/avatar.png"
              alt="Charles Deo"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <h4 className="font-bold">Charles Deo</h4>
              <span className="text-gray-400 text-sm">15 mins ago</span>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg mb-2">
            <img
              src="/post-image.png"
              alt="Post Image"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Charles Deo</strong> New Blazer out here... $500!!!!!
          </p>
          <div className="flex space-x-4">
            <span className="text-pink-500">1,498</span>
            <span className="text-gray-500">3,000</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <h3 className="font-bold text-xl">You might know</h3>
          <div className="flex items-center mb-2">
            <img
              src="/avatar.png"
              alt="Eddie Lobanovskiy"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Eddie Lobanovskiy</p>
              <p className="text-gray-500 text-sm">tabaonovskiy@gmail.com</p>
            </div>
          </div>
          {/* More suggested contacts... */}
        </div>

        <div>
          <h3 className="font-bold text-xl">Active</h3>
          <div className="flex items-center mb-2">
            <img
              src="/avatar.png"
              alt="Shelby Goode"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Shelby Goode</p>
              <p className="text-green-500 text-sm">Online</p>
            </div>
          </div>
          {/* More active users... */}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
