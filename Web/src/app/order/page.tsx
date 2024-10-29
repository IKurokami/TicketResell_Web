// src/app/order/page.tsx
import Order from '@/Components/Order';

interface OrderPageProps {
  searchParams: { email?: string };
}

const OrderPage = ({ searchParams }: OrderPageProps) => {
  const email = searchParams.email;

  return (
    <div>
      {email ? (
        <Order email={email} />
      ) : (
        <p>Email parameter is missing.</p>
      )}
    </div>
  );
};

export default OrderPage;
