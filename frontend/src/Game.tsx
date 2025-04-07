import { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


// this function will probably need to be written once backend is properly connected. currently hardcode bandaid.

export default function RiddlePage() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [riddle, setRiddle] = useState("Loading riddle...");
    const [answer, setAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState(null);
    const [lives, setLives] = useState(10);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    
    // Grab cookies once on mount
        useEffect(() => {
            const sid = getCookie('sessionid');
            const csrf = getCookie('csrftoken');
            setSessionId(sid);
            setCsrfToken(csrf);
            getAccount();
            console.log('Session ID:', sid);
            console.log('CSRF Token:', csrf);
        }, []);
    
    
    // need to create async functions to start game correctly with proper riddle information.
        
        const fetchRiddle = async () => {

            const url = "http://localhost:8000/game/current-riddle/"
            try {
                const response = await fetch(url, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                });

                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setRiddle(data);
                return data;
            } catch (error) {
                    console.error('Error fetching account info:', error);
                }
            };

    // runs the above functions when the game start game button clicked
    if (gameStarted) {
        fetchRiddle();
    }

        useEffect(() => {

        }, [gameStarted]);

        const getAccount = async () => {
            const url = "http://localhost:8000/account/me/"

            try {
                const response = await fetch(url, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                });

                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                return data;
            } catch (error) {
                    console.error('Error fetching account info:', error);
                }
            };



        const assignNewRiddle = async () => {
            const url = "http://http://localhost:8000/game/assign-new-riddle/:8000/game/current-riddle/"
            try {
                const response = await fetch(url, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                });

                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setRiddle(data);
                return data;
            } catch (error) {
                    console.error('Error fetching account info:', error);
                }
            };


        const startGame = async () => {
            const url = "http://localhost:8000/game/start-game/";
        
            // Build headers conditionally
            const headers: HeadersInit = {
                "Content-Type": "application/json"
            };
        
            if (csrfToken) {
                headers["X-CSRFToken"] = csrfToken;
            }
        
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    credentials: "include",
                    body: JSON.stringify({})
                });

                if (response.status == 400) {
                    // fetch old game here
                    console.log("400 status")
                    fetchRiddle();
                }
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Game started successfully:", data);
                return data;
        
            } catch (error) {
                console.error("Error starting game:", error);
            }
            assignNewRiddle();        
            setGameStarted(true);
        };

        const endGame = async () => {
            const url = "http://localhost:8000/game/end-game/";

            const headers: HeadersInit = {
                "Content-Type": "application/json"
            };
        
            if (csrfToken) {
                headers["X-CSRFToken"] = csrfToken;
            }
                if (lives == 0) {
                    try {
                        const response = await fetch(url, {
                            method: "POST",
                            headers: headers,
                            credentials: "include",
                            body: JSON.stringify({})
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        console.log("Game ended successfully:", data);
                        return data;
                    } catch (error) {
                        console.error("Error ending game:", error);
                    }
                    setGameStarted(false);
                }
            }
    
            // not sure what the modify hearts backend does need further testing but assuming it will change num of lives user has
    const modifyHearts = async () => {
        const url = "http://localhost:8000/game/modify-game-hearts/";

        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };
    
        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                credentials: "include",
                body: JSON.stringify({})
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Game hearts modified successfully:", data);
            return data;
        } catch (error) {
            console.error("Error modifying game hearts:", error);
        }
        setLives(lives-1);

    }


    const checkAnswer = async () => {
        const url = "http://localhost:8000/game/submit-riddle-answer/"

        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };
    
        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                credentials: "include",
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (data.correct) {
                setMessage("Correct! You solved the riddle!");
            } else {
                // need to better dynamically change lives but will work on later
                if (lives > 1) {
                    modifyHearts();
                    setMessage(`Wrong answer! You have ${lives - 1} lives left.`);
                } else {
                    // need to make a submit async function to post of highscore here
                    endGame();
                    setMessage("Game Over! No lives left.");
                }
            }
            // user submits answer and their answer gets stored via here
            setUserAnswer(answer);
        } catch (error) {
            console.error("Error checking answer:", error);
            setMessage("Error connecting to the server.");
        }
    };

    function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift() || null;
        }
        return null;
      }



    // just a basic starting point for me to begin working. visuals are effed but who cares we need a working prototype
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <Card style={{ maxWidth: '400px', width: '100%', padding: '20px', textAlign: 'center' }}>
                <CardContent>
                    {!gameStarted ? (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    ) : (
                        <>
                            <Typography variant="h5" gutterBottom>Riddle</Typography>
                            <Typography variant="body1" paragraph>{riddle}</Typography>
                            <Typography variant="body2" color="textSecondary">Lives: {lives}</Typography>
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                value={answer} 
                                onChange={(e) => setAnswer(e.target.value)} 
                                placeholder="Enter your answer" 
                                disabled={lives === 0} 
                                margin="normal"
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={checkAnswer} 
                                disabled={lives === 0}
                            >
                                Submit
                            </Button>

                            {message && (
                                <Typography variant="body1" style={{ marginTop: '10px', fontWeight: 'bold', color: lives === 0 ? 'red' : 'black' }}>{message}</Typography>
                            )}
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={endGame} 
                            >
                                End Game
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
