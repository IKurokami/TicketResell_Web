import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

const OTP: React.FC<{
  email: string;
  name: string; // Thêm prop name để sử dụng
  onSuccess: () => void;
  onError: (message: string) => void;
}> = ({ email, name, onSuccess, onError }) => {
  const [otp, setOtp] = useState<number | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0 && otpSent) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
    if (timer === 0) {
      setOtpSent(false);
      setOtp(null);
      alert("OTP has expired. Please request a new one.");
    }
  }, [timer, otpSent]);

  const handleSendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const templateParams = {
      to_name: name, // Thêm to_name
      to_email: email,
      otp: generatedOtp,
    };

    try {
      const emailResponse = await emailjs.send(
        "service_d76v3rv",
        "template_juvp2i4",
        templateParams,
        "RNLODJWvSPCIi0CTv"
      );

      if (emailResponse.status === 200) {
        setOtp(generatedOtp);
        setOtpSent(true);
        setTimer(60);
        alert(`An OTP has been sent to your email: ${email}`);

        // Gọi API để gửi OTP
        await sendOtpToBackend(email, generatedOtp);
      } else {
        onError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      onError("Failed to send OTP. Please try again.");
    }
  };

  const sendOtpToBackend = async (email: string, generatedOtp: number) => {
    try {
      const response = await fetch("http://localhost:5296/api/authentication/putOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: email, // Sử dụng email như userId
          OTP: generatedOtp, // Gửi OTP
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP to server.");
      }
    } catch (error) {
      console.error("Error sending OTP to backend:", error);
      onError("Error sending OTP to backend. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    if (parseInt(enteredOtp) === otp) {
      onSuccess();
    } else {
      onError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      {otpSent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            className="w-full p-4 border rounded-md"
          />
          <p className="text-sm text-gray-500">
            {timer > 0
              ? `Resend OTP in ${timer}s`
              : <button onClick={handleSendOtp} className="text-green-500">Resend OTP</button>}
          </p>
          <button onClick={handleVerifyOtp} className="mt-4 p-2 bg-green-500 text-white rounded-md">
            Verify OTP
          </button>
        </motion.div>
      ) : (
        <button onClick={handleSendOtp} className="mt-4 p-2 bg-green-500 text-white rounded-md">
          Send OTP
        </button>
      )}
    </div>
  );
};

export default OTP;
