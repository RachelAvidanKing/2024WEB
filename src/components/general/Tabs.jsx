import React, { useState, useEffect } from "react";

// Component to create a responsive tab navigation with dynamic content
const Tabs = ({ activeTab, setActiveTab }) => {
  // State to manage dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Retrieve saved dark mode preference from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false; // Default to light mode if no preference is saved
  });

  // Array of tabs with their IDs and labels
  const tabs = [
    { id: "welcome", label: "Welcome" }, // Tab for "Welcome" content
    { id: "interview", label: "New Interview" }, // Tab for adding a new interview
    { id: "history", label: "Interview History" }, // Tab for viewing interview history
    { id: "theme", label: isDarkMode ? "Dark Mode" : "Light Mode" }, // Tab for toggling dark mode, label updates dynamically
  ];

  // Effect to synchronize dark mode state with localStorage and update the document's class
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode)); // Save dark mode preference to localStorage

    if (isDarkMode) {
      document.documentElement.classList.add("dark"); // Add "dark" class for Tailwind dark mode
    } else {
      document.documentElement.classList.remove("dark"); // Remove "dark" class for light mode
    }
  }, [isDarkMode]); // Dependency array ensures the effect runs when `isDarkMode` changes

  // Function to handle tab clicks
  const handleTabClick = (tabId) => {
    if (tabId === "theme") {
      // Toggle dark mode when the "theme" tab is clicked
      setIsDarkMode((prevMode) => !prevMode);
    } else {
      // Update the active tab for other tabs
      setActiveTab(tabId);
    }
  };

  return (
    // Container for tabs with responsive layout and gradient background
    <div className="relative flex flex-wrap justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 bg-gradient-to-r dark:bg-gray-900 from-purple-500 via-indigo-500 to-purple-500 p-1 rounded-lg dark:from-purple-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Map through tabs to render each tab dynamically */}
      {tabs.map((tab) => (
        <button
          key={tab.id} // Unique key for each tab
          onClick={() => handleTabClick(tab.id)} // Handle tab click events
          className={`
            relative px-3 py-2 text-sm sm:text-base font-semibold rounded-lg
            transition-transform duration-300 transform
            ${
              activeTab === tab.id || (tab.id === "theme" && isDarkMode)
                ? "bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 scale-105" // Active tab styles
                : "text-white hover:scale-105 hover:bg-white/20 dark:hover:bg-gray-700/30" // Hover styles for inactive tabs
            }
          `}
        >
          {tab.label} {/* Display the tab's label */}

          {/* Add an underline effect for active tabs (excluding the "theme" tab) */}
          {activeTab === tab.id && tab.id !== "theme" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 dark:bg-gray-900 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
