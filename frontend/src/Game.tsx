import { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";


// this function will probably need to be written once backend is properly connected. currently hardcode bandaid.

export default function RiddlePage() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [riddle, setRiddle] = useState("Loading riddle...");
    const [userAnswer, setUserAnswer] = useState("");
    const [lives, setLives] = useState();
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
            // console.log('Session ID:', sid);
            // console.log('CSRF Token:', csrf);

        }, []);

        useEffect(() => {
            getCurrentGame();
        }, []);
    
    
    // need to create async functions to start game correctly with proper riddle information.

    // check to see if user has concurrent game already
    const getCurrentGame = async () => {
        const url = "http://localhost:8000/game/current-game/"

        try {
            const response = await fetch(url, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            });



            if (!response.ok && response.status !== 404) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setLives(data.hearts);
            return data;
        } catch (error) {
                console.error('Error fetching account info:', error);
            }
        };

    // fetches users current riddle to solve

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
                
                const data = await response.json();
                if (response.status == 404) {
                    assignNewRiddle();
                    fetchRiddle();
                }
                console.log(data);
                setRiddle(data.question);
                return data;
            } catch (error) {
                    console.error('Error fetching account info:', error);
                }
            };

        // checks account info for debugging
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


        // assigns a new riddle to the game
        const assignNewRiddle = async () => {
            console.log("made it");
            const url = "http://localhost:8000/game/assign-new-riddle/"
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
                console.log(data);
                setRiddle(data.question);
                fetchRiddle();
                return data;
            } catch (error) {
                    console.error('Error fetching account info:', error);
                }
            };

        // starts a new game for the user
        const startGame = async () => {
            // check if we have an active game first
            const activeGame = await getCurrentGame();
            if (activeGame.is_active === true && activeGame.hearts == 0) {
                endGame();
                startGame();
                return;
            } else if (activeGame.is_active === true) {
                setGameStarted(true)
                setLives(activeGame.hearts)
                fetchRiddle();
                return;
            }

            // start a new game now
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

                // error checking anything besides 400 game already started error
        
                const data = await response.json();
                console.log("Game started successfully:", data);
                const newRiddle = await assignNewRiddle();
                setRiddle(newRiddle.question);    
                setLives(data.hearts);
                fetchRiddle();
                setGameStarted(true);
                return data;
                
            } catch (error) {
                console.error("Error starting game:", error);
            }
            // assigning riddle and changing frontend ui hopefully

        };

        const endGame = async () => {
            const url = "http://localhost:8000/game/end-game/";

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
                        console.log("Game ended successfully:", data);
                        return data;
                    } catch (error) {
                        console.error("Error ending game:", error);
                    }
                    setGameStarted(false);
                }   
    // this function decreases number of lives by 1
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
                body: JSON.stringify({
                    change: -1,
                })
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

    const increaseStreak = async () => {

        const url = "http://localhost:8000/game/modify-game-streak/"

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
                body: JSON.stringify({
                    change: 1,
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Game streak modified successfully:", data);
            return data;
        } catch (error) {
            console.error("Error modifying game streak:", error);
        }
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
                body: JSON.stringify({
                    answer: userAnswer,
                })
            });

            const data = await response.json();

            if (data.is_correct == true) {
                setMessage("Correct! You solved the riddle!");
                setScore(score+1);
                increaseStreak();
                assignNewRiddle();
                fetchRiddle();
            } else if (data.is_correct == false) {
                {
// lives should be not null for this error, should be set upon game start and updated when user submits answer
                    setMessage(`Wrong answer! You have ${lives - 1} lives left.`);
                    setLives(lives - 1);
                    modifyHearts();
                } 
            } 
            
            if (lives == 0) {
                    // need to make a submit async function to post of highscore here
                    setMessage("Game Over! No lives left.");
                    endGame();
                }

            // user submits answer and their answer gets stored via here
        } catch (error) {
            console.error("Error checking answer:", error);
            setMessage("Error connecting to the server.");
        }
        setMessage("")
        setUserAnswer("")
        
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
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
                        {/* lives in theory should be set upon game start and not null */}
                            {lives > 0 ? (
                                <>
                                    <Typography variant="h5" gutterBottom>Riddle</Typography>
                                    <Typography variant="body1" paragraph>{riddle}</Typography>
                                    <Typography variant="body2" color="textSecondary">Lives: {lives}</Typography>
                                    <TextField 
                                        fullWidth 
                                        variant="outlined" 
                                        value={userAnswer} 
                                        onChange={(e) => setUserAnswer(e.target.value)} 
                                        placeholder="Enter your answer" 
                                        margin="normal"
                                    />
                                    <Button
                                        variant="contained" 
                                        color="primary" 
                                        onClick={checkAnswer}
                                    >
                                        Submit
                                    </Button>
                                    {message && (
                                        <Typography 
                                            variant="body1" 
                                            style={{ marginTop: '10px', fontWeight: 'bold' }}
                                        >
                                            {message}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Typography 
                                        variant="body1" 
                                        style={{ marginBottom: '10px', fontWeight: 'bold', color: 'red' }}
                                    >
                                        Game Over!
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={startGame}
                                    >
                                        New Game
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
