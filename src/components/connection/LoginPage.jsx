import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom"; 
import image1 from "./background.jpg"; 
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../firebase"; 

//Component for the Login Page- email and password fields
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); // State for storing user email
  const [password, setPassword] = useState(""); // State for storing user password
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      alert("Please fill in all fields."); // Alert user if any field is empty
      return; // Exit the function
    }

    signInWithEmailAndPassword(auth, email, password) // Attempt to sign in using Firebase
      .then((userCredential) => {
        onLogin(); // Notify parent component about successful login
        navigate("/interviewsystem"); // Redirect user to the interviewsystem route
      })
      .catch((error) => {
        alert("Login is not successful. Please check your credentials."); // Alert user on failed login
      });
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background Image */}
      <div className="absolute w-full h-full">
        <img
          src={image1} // Set the background image source
          alt="Background" // Alternative text for the image
          className="w-full h-full object-cover" // Styling for full-screen background
        />
      </div>

      {/* Overlay for dimming the background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-3">
              <label
                htmlFor="email" // Label for the email input field
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                id="email" // ID for input field
                name="email" // Name for input field
                type="email" // Specify email input type
                value={email} // Bind input value to email state
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email" // Placeholder text for email field
              />
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label
                htmlFor="password" // Label for the password input field
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                id="password" // ID for input field
                name="password" // Name for input field
                type="password" // Specify password input type
                value={password} // Bind input value to password state
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password" // Placeholder text for password field
              />
            </div>

            {/* Login Button */}
            <button
              type="submit" // Set button type to submit
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup" // Link to the signup route
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
