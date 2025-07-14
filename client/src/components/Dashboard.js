import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import api from '../config/api';
import { FaPlay, FaTrophy, FaChartLine, FaHistory, FaUser } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/quiz/stats');
            setStats(response.data);
        } catch (error) {
            setError('Failed to load statistics');
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading your dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    const chartData = {
        labels: stats?.recentResults?.map((_, index) => `Quiz ${index + 1}`) || [],
        datasets: [
            {
                label: 'Score',
                data: stats?.recentResults?.map(result => result.score) || [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Welcome back, {user?.username}!</h1>
                <p>Track your progress and take new quizzes</p>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-actions">
                <Link to="/quiz" className="action-card">
                    <FaPlay className="action-icon" />
                    <h3>Take Quiz</h3>
                    <p>Start a new quiz session</p>
                </Link>
                <Link to="/scoreboard" className="action-card">
                    <FaTrophy className="action-icon" />
                    <h3>Leaderboard</h3>
                    <p>View top performers</p>
                </Link>
                <Link to="/profile" className="action-card">
                    <FaUser className="action-icon" />
                    <h3>Profile</h3>
                    <p>View your details</p>
                </Link>
            </div>

            {/* Statistics Grid */}
            <div className="dashboard-grid">
                <div className="stats-card">
                    <h3>{stats?.totalQuizzes || 0}</h3>
                    <p>Total Quizzes</p>
                </div>
                <div className="stats-card">
                    <h3>{stats?.averageScore || 0}%</h3>
                    <p>Average Score</p>
                </div>
                <div className="stats-card">
                    <h3>{stats?.bestScore || 0}%</h3>
                    <p>Best Score</p>
                </div>
                <div className="stats-card">
                    <h3>{stats?.accuracy || 0}%</h3>
                    <p>Accuracy</p>
                </div>
            </div>

            {/* Recent Performance Chart */}
            {/* {stats?.recentResults && stats.recentResults.length > 0 && (
                <div className="card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaChartLine /> Recent Performance
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            )} */}

            {/* Recent Results */}
            {stats?.recentResults && stats.recentResults.length > 0 && (
                <div className="card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaHistory /> Recent Results
                    </h3>
                    <div className="recent-results">
                        {stats.recentResults.slice(0, 5).map((result, index) => (
                            <div key={index} className="result-item">
                                <div className="result-score">
                                    <span className="score-number">{result.score}%</span>
                                    <span className="score-label">Score</span>
                                </div>
                                <div className="result-details">
                                    <p>{result.correct_answers}/{result.total_questions} correct</p>
                                    <small>{new Date(result.completed_at).toLocaleDateString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(!stats || stats.totalQuizzes === 0) && (
                <div className="card text-center">
                    <h3>No Quiz History</h3>
                    <p>You haven't taken any quizzes yet. Start your journey now!</p>
                    <Link to="/quiz" className="btn btn-primary mt-20">
                        Take Your First Quiz
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard; 