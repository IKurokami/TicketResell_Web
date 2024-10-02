import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/Css/MyCart.css';

const MyCart = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Product 1',
      description: 'High-quality and trusted product',
      price: 20000,
      quantity: 1,
      total: 20000,
      imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517',
    },
    // Add more products here if necessary
  ]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    );
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.total, 0);
  };

  const handleCheckout = () => {
    router.push('/my-cart-confirm');
  };

  return (
    <div className="mycart-container">
      <h1>Your Shopping Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.imageUrl} alt={item.name} className="product-image" />
                <div>
                  <strong>{item.name}</strong>
                  <p className="item-description">{item.description}</p>
                </div>
              </td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="quantity-input"
                />
              </td>
              <td>{item.total.toLocaleString()}₫</td>
              <td>
                <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-footer">
        <div className="select-all">
          <input type="checkbox" id="select-all" />
          <label htmlFor="select-all">Select All</label>
        </div>
        <button className="delete-selected">Delete Selected</button>
        <div className="total">
          <strong>Total Payment: {calculateTotalPrice().toLocaleString()}₫</strong>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
      </div>

      {/* Recommendation section */}
      <div className="recommend-section">
        <h2>Recommended Products</h2>
        <div className="recommend-items">
          {/* Recommended items with placeholder images */}
          {[...Array(3)].map((_, index) => (
            <div className="recommend-item" key={index}>
              <img src="  https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517
" alt={`Recommended Product ${index + 1}`} className="recommend-image" />
              <div>
                <strong>Product {index + 1}</strong>
                <p>Short description here.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCart;
