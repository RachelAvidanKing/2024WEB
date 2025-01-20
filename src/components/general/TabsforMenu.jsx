import React, { useState, useEffect } from "react"; // Import React and hooks

// Component for managing tabs and dark mode
const TabsforMenu = ({ activeTab, setActiveTab }) => {
  // State to track dark mode, initialized from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode"); // Retrieve dark mode preference from localStorage
    return savedMode ? JSON.parse(savedMode) : false; // Parse the stored value or default to false
  });

  // Array of tabs with their IDs and labels
  const tabs = [
    { id: "welcome", label: "Welcome" }, // Tab for "Welcome" page
    { id: "interview", label: "New Interview" }, // Tab for creating a new interview
    { id: "history", label: "Interview History" }, // Tab for viewing interview history
  ];

  // Effect to update localStorage and toggle dark mode classes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode)); // Save dark mode state in localStorage
    if (isDarkMode) {
      document.documentElement.classList.add("dark"); // Add "dark" class to enable dark mode
    } else {
      document.documentElement.classList.remove("dark"); // Remove "dark" class to disable dark mode
    }
  }, [isDarkMode]); // Runs whenever `isDarkMode` changes

  // Function to handle tab click events
  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Update the active tab state in the parent component
  };

  return (
    <div className="p-4 space-y-3">
      {/* Render each tab as a button */}
      {tabs.map((tab) => (
        <button
          key={tab.id} // Unique key for each tab
          onClick={() => handleTabClick(tab.id)} // Set the active tab when clicked
          className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === tab.id
              ? "bg-purple-600 text-white dark:bg-gray-800 dark:text-purple-300" // Styles for the active tab
              : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-purple-600 hover:text-white dark:hover:bg-gray-700 dark:hover:text-purple-300" // Styles for inactive tabs
          }`}
        >
          {tab.label} {/* Display the tab's label */}
        </button>
      ))}
    </div>
  );
};

export default TabsforMenu; 
