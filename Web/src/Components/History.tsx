import React, { useState, useEffect } from 'react';
import { Receipt, Calendar, Film } from 'lucide-react';

interface Ticket {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Purchase {
  id: string;
  date: string;
  totalAmount: number;
  tickets: Ticket[];
}

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setIsLoading(true);
        // Simulating API call to fetch purchase history
        // Replace this with actual API call in production
        const mockPurchases: Purchase[] = [
          {
            id: '1',
            date: '2024-10-05',
            totalAmount: 45.00,
            tickets: [
              { name: 'Inception', quantity: 2, price: 15.00, imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451' },
              { name: 'The Matrix', quantity: 1, price: 15.00, imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451' },
            ],
          },
          {
            id: '2',
            date: '2024-09-28',
            totalAmount: 30.00,
            tickets: [
              { name: 'Interstellar', quantity: 2, price: 15.00, imageUrl: 'https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451' },
            ],
          },
        ];
        setPurchases(mockPurchases);
      } catch (err) {
        setError('Failed to fetch purchase history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 my-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Transaction History</h1>
        {purchases.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-center">No purchase history available.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold flex items-center space-x-2 text-gray-800">
                      <Receipt className="h-6 w-6 text-blue-500" />
                      <span>Ticket #{purchase.id}</span>
                    </h2>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{new Date(purchase.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchase.tickets.map((ticket, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                        <img src={ticket.imageUrl} alt={ticket.name} className="w-full h-64 object-cover rounded-md mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{ticket.name}</h3>
                        <div className="flex justify-between w-full text-gray-600">
                          <span>Quantity: {ticket.quantity}</span>
                          <span>€ {(ticket.price * ticket.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="bg-blue-50 px-6 py-3 rounded-lg">
                      <span className="text-xl font-semibold text-blue-700">
                        Total: € {purchase.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;