"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PaymentStatus = ({ success }) => {
  const [countdown, setCountdown] = useState(3); // Countdown starting from 3 seconds
  const router = useRouter();

  // Handle countdown and redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    // Clean up timers on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-[40vh] mb-[50vh]">
      {success ? (
        <div className="flex items-center space-x-3">
          <FaCheckCircle className="text-green-500" size={50} />
          <p className="text-xl font-semibold text-green-500">
            Payment Successful!
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <FaTimesCircle className="text-red-500" size={50} />
          <p className="text-xl font-semibold text-red-500">Payment Failed!</p>
        </div>
      )}

      {/* Display the countdown */}
      <p className="mt-4 text-gray-500">
        Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
      </p>
    </div>
  );
};

export default PaymentStatus;
