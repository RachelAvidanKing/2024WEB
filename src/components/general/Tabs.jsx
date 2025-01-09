import React, { useState, useEffect } from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user had a preference stored
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const tabs = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'interview', label: 'New Interview' },
    { id: 'history', label: 'Interview History' },
    { id: 'theme', label: isDarkMode ? 'Dark Mode' : 'Light Mode' },
  ];

  // Effect to apply the dark mode
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode to html tag for Tailwind
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleTabClick = (tabId) => {
    if (tabId === 'theme') {
      setIsDarkMode((prevMode) => !prevMode);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="relative flex justify-center space-x-4 mb-6 bg-gradient-to-r  dark:bg-gray-900 from-purple-500 via-indigo-500 to-purple-500 p-1 rounded-lg dark:from-purple-900 dark:via-indigo-900 dark:to-purple-900">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            relative px-4 py-2 text-sm sm:text-lg font-semibold rounded-lg
            transition-transform duration-300 transform
            ${activeTab === tab.id || (tab.id === 'theme' && isDarkMode)
              ? 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 scale-105'
              : 'text-white hover:scale-105 hover:bg-white/20 dark:hover:bg-gray-700/30'
            }
          `}
        >
          {tab.label}

          {/* Animated underline effect */}
          {activeTab === tab.id && tab.id !== 'theme' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 dark:bg-gray-900 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;