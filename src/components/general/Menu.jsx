import React, { useState, useEffect } from "react";
import { X, Menu as MenuIcon } from "lucide-react";
import { auth, database } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUserDetails, fetchLastInterview } from "./MenuController";
import Tabs from "./TabsforMenu";

//Component for menu
const Menu = ({ activeTab, setActiveTab }) => {
  // State for managing menu open/close state
  const [isOpen, setIsOpen] = useState(false);

  // State for storing user details (username, email, newspaper)
  const [userDetails, setUserDetails] = useState({
    username: "Guest",
    email: "",
    newspaper: "",
  });

  // State for storing the last interview details
  const [lastInterview, setLastInterview] = useState(null);

  // State to determine if the screen width is less than 1024px (mobile)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Function to toggle the menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Effect to update `isMobile` state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to fetch user details and last interview on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user details and last interview when a user is logged in
        fetchUserDetails(database, user.uid, setUserDetails);
        fetchLastInterview(database, user.uid, setLastInterview);
      } else {
        // Reset user details and last interview when no user is logged in
        setUserDetails({
          username: "Guest",
          email: "",
          newspaper: "",
        });
        setLastInterview(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div className="relative">
      {/* Button to toggle the menu */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-6 z-50 bg-purple-600 p-3 rounded-full shadow-xl hover:bg-purple-700 focus:outline-none sm:p-4"
      >
        {/* Menu icon */}
        <MenuIcon className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Menu overlay */}
      <div
        className={`fixed top-0 right-0 z-40 h-full bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-300 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-48 sm:w-64 md:w-72 lg:w-80`}
      >
        {/* Button to close the menu */}
        <button
          onClick={toggleMenu}
          className="flex justify-end p-3 sm:p-4 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </button>

        {/* Menu content */}
        <nav className="flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6">
          {/* Display username */}
          <p className="text-lg font-extrabold text-gray-800 dark:text-gray-200 sm:text-xl">
            Hello, {userDetails.username}!
          </p>
          {/* Display user email if available */}
          {userDetails.email && (
            <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              <strong>Email:</strong> {userDetails.email}
            </p>
          )}
          {/* Display user newspaper if available */}
          {userDetails.newspaper && (
            <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              <strong>Newspaper:</strong> {userDetails.newspaper}
            </p>
          )}
          {/* Display the last interview details if available */}
          {lastInterview && (
            <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
              The most recently added interview with{" "}
              <strong>{lastInterview.intervieweeName}</strong> was conducted on{" "}
              <strong>{lastInterview.date}</strong>.
            </p>
          )}
          {/* Render Tabs component for mobile view */}
          {isMobile && <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />}
        </nav>
      </div>
    </div>
  );
};

export default Menu;
