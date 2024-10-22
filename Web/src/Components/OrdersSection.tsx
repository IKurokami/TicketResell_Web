// components/OrdersSection.tsx
"use client";

import { FaBoxOpen, FaTrashAlt } from "react-icons/fa";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { useState } from "react";

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  status: string;
}

const initialOrders: Order[] = [
  { id: 1, orderNumber: "ORD123", customer: "John Doe", status: "Completed" },
  { id: 2, orderNumber: "ORD456", customer: "Jane Smith", status: "Pending" },
];

export default function OrdersSection() {
  const [orders, setOrders] = useState(initialOrders);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-500">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDelete(order.id)}
                  >
                    <FaTrashAlt className="inline-block mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
