import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookieValue } from "../functions/cookies"; // Import the getCookieValue function

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Retrieve the CSRF token from cookies
      const csrfToken = getCookieValue("csrftoken");

      // Make the logout request with the CSRF token in the headers
      await axios.post(
        "http://localhost:8000/account/logout/",
        {},
        {
          withCredentials: true, // Include cookies in the request
          headers: {
            "X-CSRFToken": csrfToken, // Add the CSRF token to the headers
          },
        }
      );

      setIsAuthenticated(false); // Update authentication status
      navigate("/"); // Redirect to login page
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleLogin = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#6200ea",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box", // Ensure padding is included in width
        position: "fixed",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h1 style={{ margin: 0 }}>Riddle Me</h1>
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
            marginLeft: "auto", // Push the button to the far right
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
            marginLeft: "auto", // Push the button to the far right
          }}
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;