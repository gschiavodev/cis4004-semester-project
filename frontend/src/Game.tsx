import { useState } from "react";

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
            <div style={{ background: 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
                <h1>Riddle</h1>
                <p>{riddle}</p>
                <p>Lives: {lives}</p>
                <p>Score: {score}</p>
                <input 
                    type="text" 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    placeholder="Enter your answer" 
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                    disabled={lives === 0}
                />
                <button 
                    onClick={checkAnswer} 
                    style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    disabled={lives === 0}
                >
                    Submit
                </button>
                {message && (
                    <p style={{ marginTop: '10px', fontWeight: 'bold', color: lives === 0 ? 'red' : 'white' }}>{message}</p>
                )}
            </div>
        </div>
    );
}