import React from "react";

export interface BannerItemCard {
  imageUrl: string;
  name: string;
  date: string;
  author: string;
  description: string;
  price: string;
  id:string;
}

const BannerItemCard = ({ itemCart }: { itemCart: BannerItemCard }) => {
  return (
    <div className="category-card">
      <img src={itemCart.imageUrl} alt={itemCart.name} />
      <div className="overlay">
        <div className="description">
          <div>
            <h4>{itemCart.name}</h4>
            <p>{itemCart.date}</p>
            <p>By {itemCart.author}</p>
            <p>{itemCart.description}</p>
          </div>
          <p>{itemCart.price}</p>
        </div>
      </div>
    </div>
  );
};

export default BannerItemCard;
