// pages/index.tsx

import OrdersSection from '@/Components/OrdersSection';
import UsersSection from '@/Components/UsersSection';

export default function StaffDetail() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-500">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Each section is a client component */}
          <OrdersSection />
          <UsersSection />
        </div>
      </div>
    </div>
  );
}
