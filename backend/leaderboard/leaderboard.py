import sqlite3
from datetime import datetime

# Connect to SQLite Database
def connect_db():
    conn = sqlite3.connect('leaderboard.db')
    return conn

# Create a table if it doesn't exist
def create_table():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            score INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Add a new score
def add_score(username, score):
    conn = connect_db()
    cursor = conn.cursor()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('''
        INSERT INTO leaderboard (username, score, timestamp)
        VALUES (?, ?, ?)
    ''', (username, score, timestamp))
    conn.commit()
    conn.close()

# Retrieve top N scores
def get_top_scores(limit=10):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT username, score, timestamp
        FROM leaderboard
        ORDER BY score DESC, timestamp ASC
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return rows
