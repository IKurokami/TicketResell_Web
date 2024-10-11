import React, { useState, useEffect } from 'react';
import { Receipt, Calendar } from 'lucide-react';
import { Ticket } from '@/models/TicketFetch';




interface Purchase {
  id: string; // Corresponds to OrderId in your Dto
  date: string; // The date of the order
  totalAmount: number; // Total amount (you can calculate this)
  orderDetails: OrderDetail[]; // Details of tickets in the order
}

interface OrderDetail {
  orderDetailId: string; // Corresponds to OrderDetailId
  ticketId: string; // TicketId
  price: number; // Price of the ticket
  quantity: number; // Quantity purchased
  ticket: Ticket; // Associated ticket information
}

const TAX_RATE = 0.05; // 5% tax rate

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buyerId = 'USER001'; // Replace with the actual buyer ID.

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setIsLoading(true);

        // Replace the URL with your actual API endpoint.
        const response = await fetch(`http://localhost:5296/api/Order/buyer/${buyerId}`);
        const data = await response.json();
        console.log("Order History", data);

        // Assuming the API response directly matches the Purchase model
        setPurchases(data.data);
      } catch (err) {
        setError('Failed to fetch purchase history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [buyerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 my-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">Transaction History</h1>
        {purchases.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-center">No purchase history available.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {purchases.map((purchase) => {
              const subtotal = purchase.orderDetails.reduce(
                (acc, detail) => acc + detail.price * detail.quantity,
                0
              );
              const tax = subtotal * TAX_RATE;
              const totalWithTax = subtotal + tax;

              return (
                <div key={purchase.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold flex items-center space-x-2 text-gray-800">
                        <Receipt className="h-6 w-6 text-blue-500" />
                        <span>Order #{purchase.id}</span>
                      </h2>
                      <div className="flex items-center text-gray-500 whitespace-nowrap">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>
                          {new Date(purchase.date).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>


                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {purchase.orderDetails.map((detail, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition-shadow">
                          <img
                            src={detail.ticket.imageUrl || detail.ticket.image}
                            alt={detail.ticket.name}
                            className="w-full h-64 object-cover rounded-md mb-4"
                          />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{detail.ticket.name}</h3>
                          <div className="flex justify-between w-full text-gray-600">
                            <span>Quantity: {detail.quantity}</span>
                            <span>€ {(detail.price * detail.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <div className="flex flex-col items-end">
                        <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-md shadow-md mb-2">
                          <span className="text-lg font-medium">Tax ( 5% ): € {tax.toFixed(2)}</span>
                        </div>
                        <div className="bg-green-100 text-green-800 px-6 py-3 rounded-md shadow-md">
                          <span className="text-xl font-bold">Total with Tax: € {totalWithTax.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
