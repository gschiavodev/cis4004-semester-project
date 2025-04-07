import React, { useState } from "react";
import { Navigate } from "react-router-dom";

interface AppProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const GamePage: React.FC<AppProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [count, setCount] = useState(0);

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </div>
    </div>
  );
};

export default GamePage;