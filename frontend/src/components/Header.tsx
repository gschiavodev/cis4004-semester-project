import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getCookieValue } from "../functions/cookies";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const csrfToken = getCookieValue("csrftoken");
      await axios.post(
        "http://localhost:8000/account/logout/",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleNavigateToGame = () => {
    navigate("/game");
  };

  const handleNavigateToLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <header
      style={{
        width: "100vw", // Ensure the header spans the full viewport width
        padding: "10px 20px",
        backgroundColor: "#6200ea",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box", // Include padding in width calculations
        position: "fixed",
        top: 0,
        left: 0, // Ensure the header starts at the left edge
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0 }}>Riddle Me</h1>
      <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
        <button
          onClick={handleNavigateToGame}
          disabled={!isAuthenticated || location.pathname === "/game"}
          style={{
            backgroundColor: isAuthenticated && location.pathname !== "/game" ? "white" : "#ccc",
            color: isAuthenticated && location.pathname !== "/game" ? "#6200ea" : "#666",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: isAuthenticated && location.pathname !== "/game" ? "pointer" : "not-allowed",
          }}
        >
          Game
        </button>
        <button
          onClick={handleNavigateToLeaderboard}
          disabled={location.pathname === "/leaderboard"}
          style={{
            backgroundColor: location.pathname !== "/leaderboard" ? "white" : "#ccc",
            color: location.pathname !== "/leaderboard" ? "#6200ea" : "#666",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: location.pathname !== "/leaderboard" ? "pointer" : "not-allowed",
          }}
        >
          Leaderboard
        </button>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "white",
              color: "#6200ea",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "white",
              color: "#6200ea",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;