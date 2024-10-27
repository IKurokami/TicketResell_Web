import React, { useEffect, useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { fetchImage } from "@/models/FetchImage";

const DEFAULT_IMAGE =
  "https://th.bing.com/th?id=OIP.lcY5HRpW-xdbGVrC1DsbcAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2";
const RatingsList = ({ ratings }: any) => {
  const [userImages, setUserImages] = useState<any>({});
  
  const fetchUserAvatarImage = async () => {
    try {
      const imageFetchPromises = ratings.map((rating: any) =>
        fetchImage(rating.userId)
      );
      const results = await Promise.all(imageFetchPromises);
      const images = results.map(({ imageUrl, error }, index) => {
        if (error) {
          console.error(
            `Error fetching image for item ${ratings[index].userId}:`,
            error
          );
          return null; // Return null or handle the error as needed
        }
        return imageUrl; // Return the imageUrl if no error
      });
      setUserImages(images);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      throw err; // Handle errors in a way that suits your app
    }
  };

  useEffect(() => {
    fetchUserAvatarImage();
  }, [ratings]);

  // Function to format date

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    // Extract the day, month, and year manually
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // Function to render stars
  const renderStars = (starCount: any) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i < starCount
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full max-w-4xl ">
      <div className="bg-white rounded-lg ">
        <h2 className="text-2xl font-bold mb-6 text-center">Đánh giá khách hàng</h2>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {ratings.map((rating: any, index: number) => (
            <Card key={rating.ratingId}>
              <CardContent className="pt-6">
                <div className="flex pb-3">
                  <div className="flex items-center gap-3 pr-3">
                    <img
                      src={userImages[index] || DEFAULT_IMAGE}
                      alt={`User ${rating.userId}`}
                      className="w-7 h-7 rounded-full"
                    />
                  </div>
                  <p className="text-md text-gray-500">{rating.userId}</p>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(rating.stars)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(rating.createDate)}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{rating.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsList;
