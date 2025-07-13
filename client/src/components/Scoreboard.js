import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaTrophy, FaMedal, FaCrown, FaClock, FaUser } from 'react-icons/fa';
import './Scoreboard.css';

const Scoreboard = () => {
    const { isAuthenticated } = useAuth();
    const [topScorers, setTopScorers] = useState([]);
    const [recentResults, setRecentResults] = useState([]);
    const [userRanking, setUserRanking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchScoreboardData();
    }, []);

    const fetchScoreboardData = async () => {
        try {
            const [topScorersRes, recentResultsRes] = await Promise.all([
                axios.get('/api/scoreboard/top-scorers'),
                axios.get('/api/scoreboard/recent-results')
            ]);

            setTopScorers(topScorersRes.data);
            setRecentResults(recentResultsRes.data);

            if (isAuthenticated) {
                try {
                    const userRankingRes = await axios.get('/api/scoreboard/user-ranking');
                    setUserRanking(userRankingRes.data);
                } catch (error) {
                    console.log('User not ranked yet');
                }
            }
        } catch (error) {
            setError('Failed to load scoreboard data');
            console.error('Error fetching scoreboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <FaCrown className="rank-icon gold" />;
        if (rank === 2) return <FaMedal className="rank-icon silver" />;
        if (rank === 3) return <FaMedal className="rank-icon bronze" />;
        return null;
    };

    const getRankClass = (rank) => {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return '';
    };

    if (loading) {
        return <div className="loading">Loading scoreboard...</div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1><FaTrophy /> Leaderboard</h1>
                <p>Top performers and recent quiz results</p>
            </div>

            {/* User Ranking */}
            {isAuthenticated && userRanking && (
                <div className="card user-ranking-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUser /> Your Ranking
                    </h3>
                    <div className="user-ranking-info">
                        <div className="ranking-stat">
                            <span className="ranking-number">#{userRanking.ranking}</span>
                            <span className="ranking-label">Rank</span>
                        </div>
                        <div className="ranking-stat">
                            <span className="ranking-number">{userRanking.bestScore}%</span>
                            <span className="ranking-label">Best Score</span>
                        </div>
                        <div className="ranking-stat">
                            <span className="ranking-number">{userRanking.totalUsers}</span>
                            <span className="ranking-label">Total Players</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Scorers */}
            <div className="scoreboard-section">
                <h2>Top Scorers</h2>
                <div className="scoreboard-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Best Score</th>
                                <th>Average</th>
                                <th>Accuracy</th>
                                <th>Quizzes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topScorers.map((scorer, index) => (
                                <tr key={index} className={getRankClass(index + 1)}>
                                    <td>
                                        <div className="rank-cell">
                                            {getRankIcon(index + 1)}
                                            <span className="rank-number">{index + 1}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="player-info">
                                            <FaUser className="player-icon" />
                                            <span className="player-name">{scorer.username}</span>
                                        </div>
                                    </td>
                                    <td className="score-cell">{scorer.best_score}%</td>
                                    <td className="score-cell">{scorer.average_score}%</td>
                                    <td className="score-cell">{scorer.accuracy}%</td>
                                    <td className="score-cell">{scorer.total_quizzes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Results */}
            <div className="scoreboard-section">
                <h2>Recent Activity</h2>
                <div className="recent-activity">
                    {recentResults.map((result, index) => (
                        <div key={index} className="activity-item">
                            <div className="activity-icon">
                                <FaUser />
                            </div>
                            <div className="activity-content">
                                <div className="activity-header">
                                    <span className="activity-user">{result.username}</span>
                                    <span className="activity-score">{result.score}%</span>
                                </div>
                                <div className="activity-details">
                                    <span>{result.correct_answers}/{result.total_questions} correct</span>
                                    <span className="activity-time">
                                        <FaClock /> {new Date(result.completed_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {topScorers.length === 0 && (
                <div className="card text-center">
                    <h3>No Data Available</h3>
                    <p>No quiz results have been recorded yet.</p>
                </div>
            )}
        </div>
    );
};

export default Scoreboard; 