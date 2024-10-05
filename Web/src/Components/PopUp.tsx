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
          <h2>Notification</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          You are not a seller!! Please regigter seller!!
        </div>
        <div className="dialog-footer">
          <button className="button primary" onClick={handleClick} >
            Sign up
          </button>
          <button className="button secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;