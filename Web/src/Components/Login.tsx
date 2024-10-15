"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Cookies from "js-cookie";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }> = ({
  icon,
  ...props
}) => (
  <div className="relative mt-5">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      className="w-full pl-10 pr-3 py-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      {...props}
    />
  </div>
);

const ActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <motion.button
    className="w-full px-4 py-4 mt-6 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5296/api/Authentication/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Gmail: email,
            Password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Login error:", result);
        setError(result.message || "Invalid email or password.");
      } else {
        if (rememberMe) {
          Cookies.set("id", result.data.user.userId, { expires: 7 }); // Save user ID for 7 days
          Cookies.set("accessKey", result.data.accessKey, { expires: 7 }); // Save accessKey for 7 days
        } else {
          Cookies.set("id", result.data.user.userId); // Save session cookies (will be removed on browser close)
          Cookies.set("accessKey", result.data.accessKey);
        }
        if (Cookies) {
          console.log("cookie saved");
        }
        setLoginSuccessMessage("Login successful!"); // Set success message
        setTimeout(() => {
          setLoginSuccessMessage(null); // Clear success message after displaying it
        }, 3000); // Clear after 3 seconds

        // Delay navigation to the home page by 5 seconds
        setTimeout(() => {
          router.push("/");
        }, 4000); // Redirect after 5 seconds
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("An error occurred. Please try again later.");
    }
  };


  const handleSignUp = async () => {
    // Validate email format before proceeding
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!username || !name || !email || !password) {
      setError("Please fill in all fields and choose a role.");
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const templateParams = {
      to_name: name,
      to_email: email,
      otp: generatedOtp,
    };

    try {
      const response = await emailjs.send(
        "service_d76v3rv", // Service ID
        "template_juvp2i4", // Template ID
        templateParams,
        "RNLODJWvSPCIi0CTv" // Public key
      );

      console.log("OTP sent:", response.status, response.text);

      if (response.status === 200) {
        alert(`An OTP has been sent to your email: ${email}`);
        setOtp(generatedOtp); // Save OTP for verification
        setOtpSent(true); // Set flag indicating OTP has been sent
        setTimer(60); // Reset timer to 60 seconds
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (parseInt(enteredOtp) === otp) {
      // Proceed with registration if OTP is correct
      try {
        const response = await fetch(
          "http://localhost:5296/api/Authentication/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              UserId: email,
              Username: username,
              Password: password,
              Gmail: email,
            }),
          }
        );

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
          setError(result.message || "Something went wrong.");
          return;
        }

        setError(null);
        setSuccessMessage("Registration successful! You can now sign in."); // Set success message
        setTimeout(() => {
          setActiveTab("login"); // Switch to login tab after a delay
          setSuccessMessage(null); // Clear success message after displaying it
        }, 3000); // Switch after 3 seconds
      } catch (error) {
        console.error("Sign up error:", error);
        setError("An error occurred during sign-up. Please try again.");
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-20 p-10 max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold">
              <span className="text-green-500">Ticket</span>
              <span className="text-black">Resell</span>
            </h1>
          </div>
          <div className="flex mb-0">
            <button
              className={`w-full py-4 text-lg font-bold transition-all ${activeTab === "login"
                ? "text-white bg-green-500"
                : "text-gray-600 bg-transparent"
                } rounded-l-3xl`}
              onClick={() => setActiveTab("login")}
            >
              Sign In
            </button>
            <button
              className={`w-full py-4 text-lg font-bold transition-all ${activeTab === "register"
                ? "text-white bg-green-500"
                : "text-gray-600 bg-transparent"
                } rounded-r-3xl`}
              onClick={() => setActiveTab("register")}
            >
              Sign Up
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {activeTab === "login" ? (
              <>
                <InputField
                  icon={<FaEnvelope />}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  icon={<FaLock />}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  <label htmlFor="rememberMe" className="text-gray-600">
                    Remember Me
                  </label>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {loginSuccessMessage && <p className="text-green-500">{loginSuccessMessage}</p>}
                <ActionButton onClick={handleSignIn}>Sign In</ActionButton>
                <div className="mt-4 text-center">
                  <p>or</p>
                </div>

                {/* Google Login Button */}
                <div className="mt-4">
                  <button
                    className="w-full flex items-center justify-center px-4 py-4 mt-6 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all"
                  >
                    <FaGoogle className="mr-2" /> Continue with Google
                  </button>
                </div>

              </>
            ) : (
              <>
                <InputField
                  icon={<FaUser />}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                  icon={<FaUser />}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputField
                  icon={<FaEnvelope />}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  icon={<FaLock />}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {otpSent ? (
                  <>
                    <InputField
                      icon={<FaLock />}
                      type="text"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <p className="text-gray-600">
                      OTP will expire in {timer} seconds.
                    </p>
                    <ActionButton onClick={handleVerifyOtp}>Verify OTP</ActionButton>
                  </>
                ) : (
                  <ActionButton onClick={handleSignUp}>Sign Up</ActionButton>
                )}
                <div className="mt-4 text-center">
                  <p>or</p>
                </div>

                {/* Google Login Button */}
                <div className="mt-4">
                  <button
                    className="w-full flex items-center justify-center px-4 py-4 mt-6 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all"
                  >
                    <FaGoogle className="mr-2" /> Continue with Google
                  </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
