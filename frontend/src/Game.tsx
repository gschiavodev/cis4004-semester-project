import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

export default function RiddlePage() {
    const riddle = "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?";
    const correctAnswer = "echo";
    const [answer, setAnswer] = useState("");
    const [userAnswer, setUserAnswer] = useState(null);
    const [lives, setLives] = useState(3);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);

    const checkAnswer = () => {
        if (answer.toLowerCase() === correctAnswer) {
            setMessage("Correct! You solved the riddle!");
            setScore(score+1);
        } else {
            if (lives > 1) {
                setLives(lives - 1);
                setMessage(`Wrong answer! You have ${lives - 1} lives left.`);
            } else {
                setLives(0);
                setMessage("Game Over! No lives left.");
            }
        }
        setUserAnswer(answer);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <Card style={{ maxWidth: '400px', width: '100%', padding: '20px', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Riddle</Typography>
                    <Typography variant="body1" paragraph>{riddle}</Typography>
                    <Typography variant="body2" color="textSecondary">Lives: {lives}</Typography>
                    <Typography variant="body2" color="textSecondary">Score: {score}</Typography>
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
                </CardContent>
            </Card>
        </div>
    );
}