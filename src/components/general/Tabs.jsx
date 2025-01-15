import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
//Component to add tabs and toggle dark mode
const Tabs = ({ activeTab, setActiveTab }) => {
  // State to handle dark mode and initialize from local storage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // State to show/hide tabs based on the screen width
  const [showTabs, setShowTabs] = useState(window.innerWidth >= 1024);

  // Array of tab objects for rendering
  const tabs = [
    { id: "welcome", label: "Welcome" },
    { id: "interview", label: "New Interview" },
    { id: "history", label: "Interview History" },
  ];

  // Sync dark mode state with local storage and apply the class to the document
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle window resize events to toggle tabs visibility
  useEffect(() => {
    const handleResize = () => {
      setShowTabs(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle tab selection
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-4 mb-6 p-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 dark:from-purple-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg">
      {showTabs &&
        tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative px-3 py-2 text-sm sm:text-base font-semibold rounded-lg transition-transform duration-300 transform ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 scale-105"
                : "text-white hover:scale-105 hover:bg-white/20 dark:hover:bg-gray-700/30"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-1 dark:bg-gray-900 rounded-full"></span>
            )}
          </button>
        ))}

      {/* Button to toggle dark mode */}
      <button
        onClick={() => setIsDarkMode((prev) => !prev)}
        className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
          isDarkMode
            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-[0_0_15px_3px_rgba(200,200,200,0.5),0_0_30px_6px_rgba(200,200,200,0.3)]"
            : "bg-yellow-500 text-white hover:bg-yellow-400 shadow-[0_0_15px_3px_rgba(255,255,71,0.6),0_0_30px_6px_rgba(255,255,71,0.4)]"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <>
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-5 h-5" />
            <span className="text-sm font-medium">Light</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Tabs;
