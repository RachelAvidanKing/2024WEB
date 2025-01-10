import React, { useState, useEffect } from 'react';

//Component to create tabs with dynamic content
const Tabs = ({ activeTab, setActiveTab }) => {
  // State to manage dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user had a dark mode preference stored in localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false; // Default to false (light mode) if no preference found
  });

  // Array of tabs with their IDs and labels
  const tabs = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'interview', label: 'New Interview' },
    { id: 'history', label: 'Interview History' },
    { id: 'theme', label: isDarkMode ? 'Dark Mode' : 'Light Mode' }, // Dynamically label the theme toggle tab
  ];

  // Effect to handle dark mode changes
  useEffect(() => {
    // Save the user's dark mode preference in localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply or remove dark mode class to the HTML document element for Tailwind styling
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]); // Dependency array ensures this runs whenever `isDarkMode` changes

  // Function to handle tab clicks
  const handleTabClick = (tabId) => {
    if (tabId === 'theme') {
      // Toggle dark mode if the "theme" tab is clicked
      setIsDarkMode((prevMode) => !prevMode);
    } else {
      // Set the active tab for other tabs
      setActiveTab(tabId);
    }
  };

  return (
    // Container for the tabs with gradient background and padding
    <div className="relative flex justify-center space-x-4 mb-6 bg-gradient-to-r dark:bg-gray-900 from-purple-500 via-indigo-500 to-purple-500 p-1 rounded-lg dark:from-purple-900 dark:via-indigo-900 dark:to-purple-900">
      {tabs.map((tab) => (
        <button
          key={tab.id} // Unique key for each tab
          onClick={() => handleTabClick(tab.id)} // Handle click events for tabs
          className={`
            relative px-4 py-2 text-sm sm:text-lg font-semibold rounded-lg
            transition-transform duration-300 transform
            ${
              activeTab === tab.id || (tab.id === 'theme' && isDarkMode)
                ? 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 scale-105' // Active tab styles
                : 'text-white hover:scale-105 hover:bg-white/20 dark:hover:bg-gray-700/30' // Hover styles
            }
          `}
        >
          {tab.label} {/* Display the tab label */}

          {/* Animated underline effect for active tabs (excluding the theme toggle tab) */}
          {activeTab === tab.id && tab.id !== 'theme' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 dark:bg-gray-900 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
