import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Custom hook to use the theme
export const useTheme = () => {
  return useContext(ThemeContext);
};

// ThemeProvider to provide theme and toggleTheme to components
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle theme between 'light' and 'dark'
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Store the theme in localStorage
  };

  // Apply theme to <body> element when theme changes
  useEffect(() => {
    // Apply classes for theme and background color to <body>
    if (theme === 'dark') {
      document.body.classList.add('dark', 'bg-gray-900', 'text-purple-500'); // Purple text in dark mode
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('dark', 'bg-gray-900', 'text-purple-500');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
