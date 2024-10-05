import React, { useState } from 'react';
import '@/Css/MyCart.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

const MyCart: React.FC = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Concert Ticket',
      price: 44.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-10-10',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Football Match',
      price: 60.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-10-15',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Theater Play',
      price: 30.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-10-20',
      isSelected: false,
    },
    {
      id: 4,
      name: 'Movie Ticket',
      price: 12.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-10-25',
      isSelected: false,
    },
    {
      id: 5,
      name: 'Festival Ticket',
      price: 100.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-10-30',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Opera Ticket',
      price: 85.00,
      quantity: 1,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451',
      date: '2024-11-05',
      isSelected: false,
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'atm', name: 'ATM-Banking', icon: faUniversity },
    { id: 'momo', name: 'Momo', icon: faMobileAlt },
    { id: 'paypal', name: 'Paypal', icon: faPaypal },
  ];

  const router = useRouter();

  // Tính tổng giá tiền của các sản phẩm được chọn
  const selectedItems = items.filter(item => item.isSelected);
  const totalItemsPrice = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalPrice = totalItemsPrice > 0 ? totalItemsPrice : 0;

  // Chọn sản phẩm
  const handleSelect = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    );
    setItems(updatedItems);
  };

  // Chọn phương thức thanh toán
  const handleSelectPayment = (id: string) => {
    setSelectedPayment(prev => (prev === id ? null : id));
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (id: number, increment: boolean) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const newQuantity = increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Tiến hành thanh toán
  const handleCheckout = () => {
    const selectedTickets = items.filter(item => item.isSelected);
    const productsForCheckout = items.filter(item => item.isSelected);
    if (productsForCheckout.length === 0) {
      alert('Please select at least one product to checkout.');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method.');
      return;
    }
    localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
    localStorage.setItem('paymentMethod', selectedPayment);
    router.push('/checkout');
  };

  return (
    <div className="cart-container">
      <h2>Payment Cart</h2>

      {/* Tickets Table */}
      <div className="cart-table-container">

        <table className="cart-table">
          <thead className="Nav">
            <tr>
              <th>No</th>
              <th>Ticket Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Price</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td className='Item-image'>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="ticket-image"
                    />
                    {item.name}
                  </td>
                  <td>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, false)}>-</button>
                    <span className="quantity-input">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, true)}>+</button>
                  </td>

                  <td>{item.date}</td>
                  <td>€ {item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

     
      </div>

      {/* Payment Method and Summary */}
      <div className="cart-summary">
        <h3>Summary</h3>
        <div className="summary-details">
          <p>Selected Items {selectedItems.length} <span>€ {totalItemsPrice.toFixed(2)}</span></p>

          <p>Payment Method:</p>
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                onClick={() => handleSelectPayment(method.id)}
              >
                <FontAwesomeIcon icon={method.icon} size="2x" />
                <span>{method.name}</span>
              </div>
            ))}
          </div>

          <h4>Total Price <span>€ {totalPrice.toFixed(2)}</span></h4>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
