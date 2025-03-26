import { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";


// this function will probably need to be written once backend is properly connected. currently hardcode bandaid.

export default function RiddlePage() {
    const [riddle, setRiddle] = useState("Loading riddle...");
    const correctAnswer = "echo";
    const [answer, setAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState(null);
    const [lives, setLives] = useState(3);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState();

    // need to create async functions to start game correctly with proper riddle information.

            useEffect(() => {
                const fetchRiddle = async () => {
                    try {
                        const response = await fetch("http://localhost:8000/game/current-riddle/");
                        const data = await response.json();
                        setRiddle(data.riddle);
                    } catch (error) {
                        console.error("Error fetching riddle:", error);
                        setRiddle("Failed to load riddle.");
                    }
                };
                fetchRiddle();
            
                const fetchCorrectAnswer = async () => {
                    try {
                        const response = await fetch("http://localhost:8000/game/current-riddle-answer/");
                        const data = await response.json();
                        setAnswer(data.answer);
                    } catch (error) {
                        console.error("Error fetching correct answer:", error);
                        setAnswer(null);
                    }
                };
        
                if (gameStarted) {
                    fetchRiddle();
                    fetchCorrectAnswer();
                }
            }, [gameStarted]);

        const startGame = async () => {
            const url = "http://localhost:8000/game/start-game/";

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": "tZEPSbkjkstUJmby0f3ScXZdG9mhujnt",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({}) // Add any required request body here
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Game started successfully:", data);
                return data;

            } catch (error) {
                console.error("Error starting game:", error);
            }
            setGameStarted(true);
        }

        const endGame = async () => {
            const url = "http://localhost:8000/game/end-game/";
                if (lives == 0) {
                    try {
                        const response = await fetch(url, {
                            method: "POST",
                            headers: {
                                "X-CSRFToken": "tZEPSbkjkstUJmby0f3ScXZdG9mhujnt",
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({}) // Add any required request body here
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
                }
            }
    

    const modifyHearts = async (change) => {
        const url = "http://localhost:8000/game/modify-game-hearts/";
    
        const formData = new FormData();
        formData.append("change", change);
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-CSRFToken": "tZEPSbkjkstUJmby0f3ScXZdG9mhujnt"
                },
                body: formData
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

    }


    const checkAnswer = async () => {
        try {
            const formData = new FormData();
            formData.append("answer", userAnswer);

            const response = await fetch("http://localhost:8000/game/submit-riddle-answer/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": "tZEPSbkjkstUJmby0f3ScXZdG9mhujnt"
                },
                body: formData
            });

            const data = await response.json();

            if (data.correct) {
                setMessage("Correct! You solved the riddle!");
            } else {
                if (lives > 1) {
                    modifyHearts(-1);
                    setMessage(`Wrong answer! You have ${lives - 1} lives left.`);
                } else {
                    endGame();
                    setMessage("Game Over! No lives left.");
                }
            }
            setUserAnswer(answer);
        } catch (error) {
            console.error("Error checking answer:", error);
            setMessage("Error connecting to the server.");
        }
    };




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
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};