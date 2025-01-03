import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
// Import necessary components for routing
import "./App.css"
import "./index.css"; // Import global CSS for styling
import Title from "./components/Title.jsx"; // Import the Title component for the header
import LoginPage from "./components/index.jsx"; // Import the LoginPage component
import SignUp from "./components/SignUp.jsx"; // Import the SignUp component
import Options from "./components/Options.jsx"; // Import the Options component for user options
import Questions from "./components/Questions.jsx"; // Import the Questions component for question suggestions
import FullForm from "./components/FullForm.jsx"; // Import the FullForm component for interviewer form fill
import History from "./components/History.jsx"; // Import the History component (ensure it's available)
import { ThemeProvider } from "./components/ThemeContext.jsx";
import { createContext } from "react";

export const ThemeContext =createContext(null);

// Define the App component
function App() {
  return (
    <ThemeProvider>
      <Router> {/* Enable routing in the application */}
        <Title /> {/* Render the Title component at the top of the app */}
        <Routes> {/* Define routes for navigation */}
          <Route path="/" element={<LoginPage />} /> 
          {/* Route for the login page, accessible at the root URL */}
          <Route path="/signup" element={<SignUp />} /> 
          {/* Route for the sign-up page */}
          <Route path="/options" element={<Options />} /> 
          {/* Route for the options page */}
          <Route path="/questions" element={<Questions />} />
          {/* Route for the questions page */}
          <Route path="/fullform" element={<FullForm />} />
          {/* Route for the FullForm page */}
          <Route path="/history" element={<History />} />
          {/* Route for the history page */}
        </Routes>
      </Router>
      </ThemeProvider>
  );
}

export default App;
