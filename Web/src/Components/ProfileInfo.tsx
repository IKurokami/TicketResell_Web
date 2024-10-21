import React, { useState } from "react";
import { MdCake, MdCall, MdEmail, MdLocationOn } from "react-icons/md";
import { CiBank } from "react-icons/ci";

interface props {
  birthday: string | undefined;
  bio: string | undefined;
  address: string | undefined;
}

const ProfileInfo: React.FC<props> = ({birthday, bio, address}) => {
  // State to manage post likes and example dynamic data
  const [likes, setLikes] = useState(1498);
  const [following, setFollowing] = useState(3000);

  const handleLikeClick = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleFollowClick = () => {
    setFollowing((prevFollowing) => prevFollowing + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Sidebar */}
      <div className="w-full h-fit md:w-1/4 p-4 bg-white rounded-lg shadow-md flex-shrink-0">
        <h2 className="font-bold text-xl mb-4">About</h2>
        <div className="flex items-center mb-2">
          <span>
            <MdCake />
          </span>
          <p className="ml-2">{birthday ? birthday : "No birthday provided"}</p>
        </div>
        <div className="flex mb-2">
          <span>
            <MdLocationOn />
          </span>
          <p className="ml-2">{address ? address : "No address provided"}</p>
        </div>
        <div className="flex items-center mb-2">
          <p className="ml-2 text-gray-500">{bio ? bio : "No bio provided"}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-fit md:w-2/4 p-4 bg-white rounded-lg shadow-md">
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
              src="https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/460974939_544905574579825_6908176695535299450_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGgBBQe_9GB5Jv7vtc2IonUBAm7Cy_62CgECbsLL_rYKFEszrDUqavBfQ8vmyyi5xPBWgVxXM4Oky5BxMjswQdL&_nc_ohc=TfB8vWYyRnoQ7kNvgGFXD3K&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=AHil3J8C8K8wCwYD7V8N6R1&oh=00_AYA5gRPCzaaG7g16regpLjcee_0iEJVk0tbM3StVy6M10Q&oe=671C1FBD"
              alt="Charles Deo"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <h4 className="font-bold">Thu Thủy</h4>
              <span className="text-gray-400 text-sm">15 mins ago</span>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg mb-2">
            <img
              src="https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/460974939_544905574579825_6908176695535299450_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGgBBQe_9GB5Jv7vtc2IonUBAm7Cy_62CgECbsLL_rYKFEszrDUqavBfQ8vmyyi5xPBWgVxXM4Oky5BxMjswQdL&_nc_ohc=TfB8vWYyRnoQ7kNvgGFXD3K&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=AHil3J8C8K8wCwYD7V8N6R1&oh=00_AYA5gRPCzaaG7g16regpLjcee_0iEJVk0tbM3StVy6M10Q&oe=671C1FBD"
              alt="Post Image"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Cao Giáp</strong> Xinh quá ~~~
          </p>
          <div className="flex space-x-4">
            <span
              className="text-pink-500 cursor-pointer"
              onClick={handleLikeClick}
            >
              {likes} Likes
            </span>
            <span
              className="text-gray-500 cursor-pointer"
              onClick={handleFollowClick}
            >
              {following} Followers
            </span>
          </div>
        </div>

        {/* Add more dynamic posts here */}
      </div>

      {/* Right Sidebar */}
      <div className="w-full h-fit md:w-1/4 p-4 bg-white rounded-lg shadow-md flex-shrink-0">
        <div className="mb-4">
          <h3 className="font-bold text-xl">You might know</h3>
          <div className="flex items-center mb-2">
            <img
              src="https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/461342447_548362320900817_3224557044508314780_n.jpg?stp=dst-jpg_s600x600&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEwMz56fyjK3bomtbIDadizlOfuApAHUUGU5-4CkAdRQa1F2csYJNDKI5FZP_qK_30Do4eXoIo3OjAuH3iva3FO&_nc_ohc=nEzuvW839v8Q7kNvgF-Ji5p&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=AGc1SUkjAexv_ZRFJNsP9IA&oh=00_AYCwM6oV0CkvBhnYAhmcIurRmnxEUrTos_pUvu1YTpp6Rg&oe=671C376D"
              alt="Eddie Lobanovskiy"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Khang Huỳnh</p>
              <p className="text-gray-500 text-sm">vkev@gmail.com</p>
            </div>
          </div>
          {/* More suggested contacts... */}
        </div>

        <div>
          <h3 className="font-bold text-xl">Active</h3>
          <div className="flex items-center mb-2">
            <img
              src="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/463057361_560282243042158_5012112427178700114_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGOk31ma7LQeIVHnv9Lh4FDZ2BBmNLBt7tnYEGY0sG3u0ewJJDS5aGm-QTcYJuBYifn4L0Ka649p7Qe0Qm3OyAy&_nc_ohc=aSs9u_Bs0jgQ7kNvgE0ZiN7&_nc_zt=23&_nc_ht=scontent-hkg4-1.xx&_nc_gid=Ad3myZf3TA7BeSyHaVvrVlP&oh=00_AYAKSLd_jMYLNIwj46rVpnsaFpOzZMT-UOyBAqwnOa94tA&oe=671C246D"
              alt="Shelby Goode"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Chí Cường</p>
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
