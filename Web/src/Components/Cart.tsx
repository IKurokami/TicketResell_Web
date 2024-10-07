import React, { useState, useEffect } from 'react';
import '@/Css/MyCart.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import Cookies from "js-cookie";

export interface Ticket {
  ticketId: string;
  sellerId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  createDate: string;
  modifyDate: string;
  status: number;
  seller: null | any;
  image: string;
  categories: any[];
  category: null | any;
};
export interface CartItem {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: Ticket;
};
interface CartItemWithSelection extends CartItem {
  isSelected: boolean;
}

const MyCart: React.FC = () => {
  const [items, setItems] = useState<CartItemWithSelection[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const id = Cookies.get('id');
        const response = await fetch(`http://localhost:5296/api/cart/items/${id}`);
        const data = await response.json();
        console.log("cart data: ", data.data);
        const itemsWithSelection = data.data.map((item: CartItem) => ({
          ...item,
          isSelected: false
        }));
        setItems(itemsWithSelection);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, []);
  useEffect(() => {
    console.log("Cart items updated: ", items);
  }, [items]);

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
  const handleSelect = (id: string) => {
    const updatedItems = items.map(item =>
      item.orderDetailId === id ? { ...item, isSelected: !item.isSelected } : item
    );
    setItems(updatedItems);
  };

  // Chọn phương thức thanh toán
  const handleSelectPayment = (id: string) => {
    setSelectedPayment(prev => (prev === id ? null : id));
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (id: string, increment: boolean) => {
    const updatedItems = items.map(item => {
      if (item.orderDetailId === id) {
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
              <React.Fragment key={item.orderDetailId}>
                <tr>
                  <td>{index + 1}</td>
                  <td className='Item-image'>
                    <img
                      src="https://picsum.photos/200"
                      alt={item.ticket.name}
                      className="ticket-image"
                    />
                    {item.ticket.name}
                  </td>
                  <td>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.orderDetailId, false)}>-</button>
                    <span className="quantity-input">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.orderDetailId, true)}>+</button>
                  </td>

                  <td>{item.ticket.startDate}</td>
                  <td>€ {item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => handleSelect(item.orderDetailId)}
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
