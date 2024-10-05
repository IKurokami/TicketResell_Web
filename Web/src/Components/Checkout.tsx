"use client"
import React, { useState, useEffect } from 'react';
import '@/Css/Checkout.css';
import { useRouter } from 'next/navigation';

interface Ticket {
    id: number;
    name: string;
    quantity: number;
    price: number;
    date: string;
    imageUrl: string;
}

interface UserInfo {
    name: string;
    phone: string;
    email: string;
}

const Checkout: React.FC = () => {
    const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', phone: '', email: '' });
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const tickets = JSON.parse(localStorage.getItem('selectedTickets') || '[]');
        const payment = localStorage.getItem('paymentMethod') || '';
        setSelectedTickets(tickets);
        setPaymentMethod(payment);
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = () => {
        if (userInfo.name && userInfo.phone && userInfo.email) {
            alert('Thank you! Your tickets will be sent to your email.');
            handleCloseModal();
            router.push('/confirmation'); // Redirect to confirmation page
        } else {
            alert('Please fill in all the fields.');
        }
    };

    const renderQRCode = () => {
        switch (paymentMethod) {
            case 'momo': return <img src="/images/momo-qr.png" alt="Momo QR" />;
            case 'atm': return <img src="/images/atm-qr.png" alt="ATM QR" />;
            case 'paypal': return <img src="/images/paypal-qr.png" alt="PayPal QR" />;
            default: return null;
        }
    };

    const calculateTotalPrice = () => {
        return selectedTickets.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0);
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            <div className="ticket-summary">
                <h3>Selected Tickets</h3>
                <ul>
                    {selectedTickets.map((ticket, index) => (
                        <li key={index} className="ticket-item">
                            <img src={ticket.imageUrl} alt={ticket.name} className="ticket-image" />
                            <div className="ticket-details">
                                <p>{ticket.name} - {ticket.quantity}x</p>
                                <p>Date: {ticket.date}</p>
                                <p>Price: €{ticket.price.toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <h3>Total Price: €{calculateTotalPrice().toFixed(2)}</h3>
                <h3>Payment Method: {paymentMethod.toUpperCase()}</h3>
                <div className="qr-code">
                    {renderQRCode()}
                </div>
            </div>

            <button onClick={handleOpenModal} className="info-btn">Confirm</button>

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
