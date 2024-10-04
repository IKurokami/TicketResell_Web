"use client"
import React, { useState, useEffect } from 'react';

const Checkout: React.FC = () => {
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' });
    const [showModal, setShowModal] = useState(false);

    // Lấy dữ liệu từ localStorage khi component mount
    useEffect(() => {
        const tickets = JSON.parse(localStorage.getItem('selectedTickets') || '[]');
        const payment = localStorage.getItem('paymentMethod') || '';
        setSelectedTickets(tickets);
        setPaymentMethod(payment);
    }, []);

    // Hàm để mở modal cho nhập thông tin cá nhân
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Hàm để đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm để submit thông tin người dùng
    const handleSubmit = () => {
        if (userInfo.name && userInfo.phone && userInfo.email) {
            alert('Thank you! Your tickets will be sent to your email.');
            handleCloseModal();
        } else {
            alert('Please fill in all the fields.');
        }
    };

    // Render QR Code (Giả lập)
    const renderQRCode = () => {
        if (paymentMethod === 'momo') {
            return <img src="/Images/momo.png" alt="Momo QR" />;
        } else if (paymentMethod === 'atm') {
            return <img src="/images/momo.png" alt="ATM QR" />;
        } else if (paymentMethod === 'paypal') {
            return <img src="/images/momo.png" alt="PayPal QR" />;
        }
        return null;
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            <div className="ticket-summary">
                <h3>Selected Tickets</h3>
                <ul>
                    {selectedTickets.map((ticket: any, index: number) => (
                        <li key={index}>
                            {ticket.name} - {ticket.quantity}x - €{ticket.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h3>Payment Method: {paymentMethod.toUpperCase()}</h3>
                {renderQRCode()}
            </div>

            <button onClick={handleOpenModal}>Enter your information</button>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter your information</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Phone:
                            <input
                                type="text"
                                value={userInfo.phone}
                                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            />
                        </label>
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
