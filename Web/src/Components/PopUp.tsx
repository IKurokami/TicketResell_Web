'use client'
import React from 'react';
import "@/Css/SellBox.css"
import { useRouter } from "next/navigation";


interface PopupProps {
    isVisible: boolean;
  onClose: () => void;
}



const Popup: React.FC<PopupProps> = ({isVisible, onClose }) => {
  const route = useRouter();
    if (!isVisible) return null;

    const handleClick = () => {
      onClose();
      route.push('/signupsell')
    }
  return (
    <div className="dialog-background" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Thông báo</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          Bạn chưa đăng ký làm người bán!! Vui lòng đăng ký làm người bán!!
        </div>
        <div className="dialog-footer">
          <button className="button primary" onClick={handleClick}>
            Đăng ký
          </button>
          <button className="button secondary" onClick={onClose}>
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;