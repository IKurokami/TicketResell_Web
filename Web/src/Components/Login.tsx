"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import "@/Css/Login.css"; // Import your CSS file
import Cookies from 'js-cookie';
interface TabProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
  <button className={`tab ${isActive ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const SocialButton: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ icon, children, className, onClick }) => (
  <button className={`social-btn ${className}`} onClick={onClick}>
    {icon}
    <span>{children}</span>
  </button>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => <input className="input-field" {...props} />;

const ActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button className="action-btn" onClick={onClick}>
    {children}
  </button>
);

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

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
        console.log( result.message);
        console.log(result);
        Cookies.set("id", result.data.user.userId, { expires: 7 }); // Lưu trong 7 ngày
        Cookies.set("accessKey", result.data.accessKey, { expires: 7 });
        if(Cookies){
          console.log("cookie saved");
        }
        router.push("/");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  

  // Simulate a sign-in process
  // Replace with actual sign-in logic
  // if (email === "admin" && password === "1") {
  //   setError(null); // Clear error if login is successful
  //   router.push("/"); // Redirect to the home page
  // } else {
  //   setError("Invalid email or password.");
  // }

  const handleSignUp = async () => {
    if (!username || !name || !email || !password || !role) {
      setError("Please fill in all fields and choose a role.");
      return;
    }

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
        // Handle error from the server
        setError(result.message || "Something went wrong.");
        return;
      }

      // Clear error if sign-up is successful
      setError(null);
      console.log("Signed up as:", role); // Log the chosen role
      router.push("/"); // Redirect to home or another page after sign-up
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        {/* TicketResell logo - Now inside the form box */}
        <div className="logo-inside-box">
          <span className="logo-login">Ticket</span>{" "}
          <span className="logo-login-behind">Resell</span>
        </div>

        <div className="tab-container">
          <Tab
            isActive={activeTab === "login"}
            onClick={() => setActiveTab("login")}
          >
            Sign in
          </Tab>
          <Tab
            isActive={activeTab === "register"}
            onClick={() => setActiveTab("register")}
          >
            Sign up
          </Tab>
        </div>
        <div className="tab-content">
          {activeTab === "login" ? (
            <>
              <InputField
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex-row">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>
              {error && <p className="error-text">{error}</p>}
              <ActionButton onClick={handleSignIn}>Sign in</ActionButton>
              <p className="center-text">or</p>
              <div className="social-buttons">
                <SocialButton
                  className="facebook"
                  icon={<FaFacebookF />}
                  onClick={handleSignIn}
                >
                  Continue with Facebook
                </SocialButton>
                <SocialButton
                  className="google"
                  icon={<FaGoogle />}
                  onClick={handleSignIn}
                >
                  Continue with Google
                </SocialButton>
              </div>
            </>
          ) : (
            <>
              <InputField
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex-row center">
                <label>
                  <input type="checkbox" /> I agree to the terms
                </label>
              </div>
              {error && <p className="error-text">{error}</p>}
              <ActionButton onClick={handleSignUp}>Sign up</ActionButton>
              <p className="center-text">or</p>
              <div className="social-buttons">
                <SocialButton
                  className="facebook"
                  icon={<FaFacebookF />}
                  onClick={handleSignIn}
                >
                  Continue with Facebook
                </SocialButton>
                <SocialButton
                  className="google"
                  icon={<FaGoogle />}
                  onClick={handleSignIn}
                >
                  Continue with Google
                </SocialButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
