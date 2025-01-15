import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import image1 from "./background.jpg";
import LoginController from "./LoginController";

// Component for the login page
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store password input
  const navigate = useNavigate(); // Navigation function to redirect users

  // Handles the login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate form data before attempting login
    const validation = LoginController.validateLoginData(email, password);
    if (!validation.isValid) {
      alert(validation.message); // Show an alert if validation fails
      return;
    }

    // Attempt to log in using the provided credentials
    const result = await LoginController.loginWithEmailAndPassword(email, password);
    if (result.success) {
      onLogin(); // Trigger the parent component's login callback
      navigate("/interviewsystem"); // Redirect to the main application page
    } else {
      alert(result.message); // Show an error message if login fails
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Image */}
      <div className="absolute w-full h-full">
        <img
          src={image1}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay for dimming the background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          {/* Page Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Login
          </h2>
          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
          {/* Sign Up Link */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline dark:text-purple-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
