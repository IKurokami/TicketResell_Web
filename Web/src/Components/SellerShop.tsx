`use client`;
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../Css/SellerShop.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";

const SellerShop = () => {
  return (
    <div>
      <main className="bg-seller-shop">
        <div className="profile">
          <div className="profile--image">
            <img
              className="cover-image"
              src="https://images7.alphacoders.com/129/1297416.png"
              alt=""
            />
          </div>
          <div className="avatar-container">
            <img
              src="data:image/jpeg;base64,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"
              alt="Avatar"
              className="avatar"
            />
          </div>
        </div>
        <div className="seller--info container">
          <div className="seller-desc">
            <p className="seller--title">Giap Cao Dinh</p>
          </div>
          <p className="seller--register-time">Join at </p>
          {/* <div className="seller--navbar">
            <Link href="/seller-shop/edit" className="navbar--btn">
              Edit Profile
            </Link>
          </div> */}
          <div className="row navbar--list gap-3">
            <div className="navbar--item col-1">
              <span></span>
              <FontAwesomeIcon icon={faBars} />
              <span className="text">Filter</span>
            </div>
            <div className="navbar--item col-1">
              <span className="text">Status</span>
            </div>
            <div className="navbar--item col-1">
              <span className="text">Category</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerShop;
