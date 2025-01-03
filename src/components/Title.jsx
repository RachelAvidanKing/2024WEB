import React from 'react';
import { useTheme } from './ThemeContext'; // Import the ThemeContext to access theme-related functionality

// Define the Title component, which displays the website title and theme toggle button
const Title = () => {
  // Destructure the current theme and the toggleTheme function from the ThemeContext
  const { theme, toggleTheme } = useTheme();

  return (
    // Header section with dynamic styling based on the current theme
    <header
      className={`flex flex-col items-center justify-center p-5 ${
        theme === 'light' ? 'bg-orange-400' : 'bg-gray-800' // Apply background color based on theme
      }`}
    >
      {/* Main title of the website */}
      <h1 className="text-3xl font-bold text-white">
        Job Interview Website
      </h1>

      {/* Subtitle providing additional context or description */}
      <p className="text-sm mt-1 text-white">
        Your gateway to career success!
      </p>

      {/* Button to toggle between light and dark modes */}
      <button
        onClick={toggleTheme} // Call the toggleTheme function when the button is clicked
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700" // Button styling
      >
        {/* Display the theme to switch to based on the current theme */}
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
};

export default Title; 
