import React, { useState } from "react";
import image1 from "./background.jpg";
import { Link } from "react-router-dom";
import { signUpUser } from "./SignUpController";

// Component for signing up a new user
function SignUp() {
  const [username, setUsername] = useState(""); // State for storing username input
  const [email, setEmail] = useState(""); // State for storing email input
  const [password, setPassword] = useState(""); // State for storing password input
  const [newspaper, setNewspaper] = useState(""); // State for storing newspaper input

  // Function to handle form submission
  const signUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Attempt to sign up the user with the provided inputs
      const user = await signUpUser(username, email, password, newspaper);
      alert(
        `User signed up successfully!\nWelcome, ${username} from ${newspaper}!\nYou can now log in with your credentials.`
      );
    } catch (error) {
      // Display an error message if sign-up fails
      alert(`Error Signing Up: ${error.message}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background image */}
      <div className="absolute w-full h-full">
        <img
          src={image1}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay for background dimming */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Sign-up form container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          {/* Form header */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Create Account
          </h2>
          
          {/* Sign-up form */}
          <form onSubmit={signUp}>
            {/* Username input field */}
            <div className="mb-3">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>

            {/* Email input field */}
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

            {/* Password input field */}
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

            {/* Newspaper input field */}
            <div className="mb-3">
              <label
                htmlFor="newspaper"
                className="block text-sm font-medium text-gray-600"
              >
                Newspaper
              </label>
              <input
                id="newspaper"
                name="newspaper"
                type="text"
                value={newspaper}
                onChange={(e) => setNewspaper(e.target.value)}
                className="mt-0.5 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the name of your newspaper"
              />
            </div>

            {/* Sign-up button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>

          {/* Link to the login page */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline dark:text-purple-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
