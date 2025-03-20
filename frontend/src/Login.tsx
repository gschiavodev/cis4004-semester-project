import React, { useState, FormEvent, useEffect } from "react";
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


const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false); // state for checkbox
    const [isSignUp, setIsSignUp] = useState(false);

    // Load the email from localStorage if it exists
    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true); // If email is in localStorage, assume "Remember Me" was checked
        }
    }, []);



    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const url = isSignUp
            ? "http://localhost:8000/account/register/"
            : "http://localhost:8000/account/login/";

        // Determine payload based on login vs sign up
        const payload = isSignUp
            ? { email, username, password } // Signup needs a username
            : { email, password }; // Login only requires email and password

        try {
            const response = await axios.post(url, payload);
            console.log(isSignUp ? "Account created successfully:" : "Logged in successfully:", response.data);
            setError(""); // Clear error on success

            // If remember me checkbox is checked, store email in local storage
            if (rememberMe) {
                localStorage.setItem("email", email);
            } else {
                localStorage.removeItem("email");
            }

            // Add code to navigate to game page


        } catch (err: any) {
            setError(err?.response?.data?.error || "An error occurred. Please try again.");
            console.error("Error:", err?.response?.data || err?.message);
        }
    };


    // Handle checkbox change
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };



    return (
        // Background
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100vw",
                backgroundImage: 'url(/Photos/mesh-276.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            <Container maxWidth="xs">
                {isSignUp ? (
                    //Sign Up Form
                    <Paper square={false} elevation={10} sx={{ padding: 4, background: 'linear-gradient(0deg, rgba(176,34,195,1) 0%, rgba(220,217,224,1) 100%)' }}>
                        <Typography variant="h3" component="h3" sx={{ textAlign: "center", padding: 0, paddingTop: 2 }}>Riddle Me</Typography>
                        <Typography component="h6" variant="h6" sx={{ textAlign: "center", paddingBottom: 2 }}>
                            Create Account To Start Solving Riddles
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                required
                                autoFocus
                                color="secondary"
                                sx={{ mb: 2 }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                autoFocus
                                color="secondary"
                                sx={{ mb: 2 }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                fullWidth
                                required
                                color="secondary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Typography color="black" sx={{ textAlign: "center", marginTop: 2 }}>{error}</Typography>}
                            <FormControlLabel
                                control={<Checkbox color="secondary" checked={rememberMe} onChange={handleCheckboxChange} />}
                                label="Remember Me"
                                sx={{ padding: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, backgroundColor: "black" }}>
                                Create Account
                            </Button>
                        </Box>
                        <Typography sx={{ mt: 5, textAlign: "center" }}>
                            Already have an account?{" "}
                            <Button onClick={() => setIsSignUp(false)} type="button" variant="contained" size="small" sx={{ mt: 0, backgroundColor: "blue" }}>Sign in</Button>
                        </Typography>
                    </Paper>
                ) : (
                    //Sign in form
                    <Paper square={false} elevation={10} sx={{ padding: 4, background: 'linear-gradient(0deg, rgba(176,34,195,1) 0%, rgba(220,217,224,1) 100%)' }}>
                        <Typography variant="h3" component="h3" sx={{ textAlign: "center", padding: 0, paddingTop: 2 }}>Riddle Me</Typography>
                        <Typography component="h6" variant="h6" sx={{ textAlign: "center", paddingBottom: 2 }}>
                            Sign In To Start Solving Riddles
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                autoFocus
                                color="secondary"
                                sx={{ mb: 2 }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                fullWidth
                                required
                                color="secondary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Typography color="black" sx={{ textAlign: "center", marginTop: 2 }}>{error}</Typography>}
                            <FormControlLabel
                                control={<Checkbox color="secondary" checked={rememberMe} onChange={handleCheckboxChange} />}
                                label="Remember Me"
                                sx={{ padding: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, backgroundColor: "black" }}>
                                Sign In
                            </Button>
                        </Box>
                        <Typography sx={{ mt: 5, textAlign: "center" }}>
                            Don't have an account?{" "}
                            <Button onClick={() => setIsSignUp(true)} type="button" variant="contained" size="small" sx={{ mt: 0, backgroundColor: "blue" }} >Sign Up</Button >
                        </Typography>
                    </Paper>
                )}
            </Container>

        </Box>

    );
};

export default LoginPage;
