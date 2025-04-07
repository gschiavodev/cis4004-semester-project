import React, { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "axios";

interface LoginPageProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect to /game if the user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/game" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const url = isSignUp
      ? "http://localhost:8000/account/register/"
      : "http://localhost:8000/account/login/";

    const payload = isSignUp
      ? { email, username, password }
      : { email, password };

    try {
      await axios.post(url, payload, {
        withCredentials: true, // Include credentials (cookies) in the request
      });

      setError(""); // Clear error on success
      handleRememberMe(); // Handle "Remember Me" functionality
      setIsAuthenticated(true); // Update authentication status

      // Redirect to the game page after login
      window.location.href = "/game";
    } catch (err: any) {
      setError(err?.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  const handleRememberMe = () => {
    if (rememberMe) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
    setError(""); // Clear error when switching modes
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url(/Photos/mesh-276.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            background:
              "linear-gradient(0deg, rgba(176,34,195,1) 0%, rgba(220,217,224,1) 100%)",
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            sx={{ textAlign: "center", paddingTop: 2 }}
          >
            Riddle Me
          </Typography>
          <Typography
            component="h6"
            variant="h6"
            sx={{ textAlign: "center", paddingBottom: 2 }}
          >
            {isSignUp
              ? "Create Account To Start Solving Riddles"
              : "Sign In To Start Solving Riddles"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {isSignUp && (
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                required
                color="secondary"
                sx={{ mb: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              color="secondary"
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              color="secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography
                color="black"
                sx={{ textAlign: "center", marginTop: 2 }}
              >
                {error}
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember Me"
              sx={{ padding: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, backgroundColor: "black" }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </Box>
          <Typography sx={{ mt: 5, textAlign: "center" }}>
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Button
                  onClick={toggleSignUp}
                  variant="contained"
                  size="small"
                  sx={{ mt: 0, backgroundColor: "blue" }}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Button
                  onClick={toggleSignUp}
                  variant="contained"
                  size="small"
                  sx={{ mt: 0, backgroundColor: "blue" }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;