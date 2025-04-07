import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import the CSS file

// Define interfaces for type safety
interface LeaderboardItem {
  username: string;
  highest_streak: number;
}

interface Pagination {
  next: string | null;
  previous: string | null;
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highestStreak' | 'mostGamesPlayed'>('highestStreak');
  const [highestStreakData, setHighestStreakData] = useState<LeaderboardItem[]>([]);
  const [mostGamesPlayedData, setMostGamesPlayedData] = useState<LeaderboardItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ next: null, previous: null });
  const [page, setPage] = useState<number>(1);
  const pageSize: number = 3;

  // Fetch data from the API
  const fetchData = async (url: string, type: 'highestStreak' | 'mostGamesPlayed'): Promise<void> => {
    try {
      const response = await fetch(url);
      const data: { next: string | null; previous: string | null; results: LeaderboardItem[] } = await response.json();
      if (type === 'highestStreak') {
        setHighestStreakData(data.results);
      } else {
        setMostGamesPlayedData(data.results);
      }
      setPagination({ next: data.next, previous: data.previous });
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'highestStreak' | 'mostGamesPlayed'): void => {
    setActiveTab(tab);
    setPage(1); // Reset to page 1 when switching tabs
    const url =
      tab === 'highestStreak'
        ? `http://localhost:8000/leaderboard/highest-streak/?page=1&page_size=${pageSize}`
        : `http://localhost:8000/leaderboard/most-games-played/?page=1&page_size=${pageSize}`;
    fetchData(url, tab);
  };

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    const url =
      activeTab === 'highestStreak'
        ? `http://localhost:8000/leaderboard/highest-streak/?page=${newPage}&page_size=${pageSize}`
        : `http://localhost:8000/leaderboard/most-games-played/?page=${newPage}&page_size=${pageSize}`;
    fetchData(url, activeTab);
  };

  // Fetch initial data on component mount
  useEffect(() => {
    handleTabChange('highestStreak'); // Default tab
  }, []);

  return (
    <div id="leaderboard">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'highestStreak' ? 'active' : ''}`}
          onClick={() => handleTabChange('highestStreak')}
        >
          Highest Streak
        </button>
        <button
          className={`tab-button ${activeTab === 'mostGamesPlayed' ? 'active' : ''}`}
          onClick={() => handleTabChange('mostGamesPlayed')}
        >
          Most Games Played
        </button>
      </div>

      {activeTab === 'highestStreak' && (
        <div>
          <h2>Highest Streak</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Highest Streak</th>
              </tr>
            </thead>
            <tbody>
              {highestStreakData.map((item, index) => (
                <tr key={index}>
                  <td className="name">{item.username}</td>
                  <td className="score">{item.highest_streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'mostGamesPlayed' && (
        <div>
          <h2>Most Games Played</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Games Played</th>
              </tr>
            </thead>
            <tbody>
              {mostGamesPlayedData.map((item, index) => (
                <tr key={index}>
                  <td className="name">{item.username}</td>
                  <td className="games-played">{item.game_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!pagination.previous}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!pagination.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;