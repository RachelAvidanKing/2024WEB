import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./index.css";
import LoginPage from "./src/components/connection/LoginPage.jsx";
import SignUp from "./src/components/connection/SignUp.jsx";
import Interviewsystem from "./src/components/general/InterviewSystem.jsx";
import WelcomePage from "./src/components/general/WelcomePage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
        />

        {/* Sign Up Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Welcome Page */}
        <Route
          path="/main"
          element={
            isLoggedIn ? <WelcomePage /> : <Navigate to="/" />
          }
        />

        {/* Interview System */}
        <Route
          path="/interviewsystem"
          element={isLoggedIn ? <Interviewsystem /> : <Navigate to="/" />}
        />

        {/* Welcome Page */}
<Route
  path="/welcome"
  element={isLoggedIn ? <WelcomePage /> : <Navigate to="/" />}
/>

      </Routes>
    </Router>
  );
}

export default App;
