import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const TabsforMenu = ({ activeTab, setActiveTab }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const tabs = [
    { id: "welcome", label: "Welcome" },
    { id: "interview", label: "New Interview" },
    { id: "history", label: "Interview History" },
  ];

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="p-4 space-y-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === tab.id
              ? "bg-purple-600 text-white dark:bg-gray-800 dark:text-purple-300"
              : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 hover:bg-purple-600 hover:text-white dark:hover:bg-gray-700 dark:hover:text-purple-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsforMenu;
