import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "./Game"; // Game Page
import LoginPage from "./Login"; // Login Page
import ProtectedRoute from "./components/ProtectedRoute"; // ProtectedRoute component
import Header from "./components/Header"; // Global Header component
import "./index.css";
import axios from "axios";

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated by verifying the sessionid cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8000/account/me/", {
          withCredentials: true, // Include cookies in the request
        });
        setIsAuthenticated(true); // User is authenticated
      } catch (err) {
        setIsAuthenticated(false); // User is not authenticated
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      {/* Global Header */}
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* Public route for login */}
        <Route
          path="/"
          element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Protected route for the game */}
        <Route
          path="/game"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GamePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);