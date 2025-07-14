import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { FaUser, FaEnvelope, FaCalendar, FaTrophy, FaHistory, FaChartLine } from 'react-icons/fa';
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

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [profileRes, historyRes, statsRes] = await Promise.all([
                api.get('/api/users/profile'),
                api.get('/api/users/history'),
                api.get('/api/users/stats')
            ]);

            setProfile(profileRes.data);
            setHistory(historyRes.data);
            setStats(statsRes.data);
        } catch (error) {
            setError('Failed to load profile data');
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    const chartData = {
        labels: history.slice(0, 10).map((_, index) => `Quiz ${index + 1}`).reverse(),
        datasets: [
            {
                label: 'Score',
                data: history.slice(0, 10).map(result => result.score).reverse(),
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
                <h1><FaUser /> Profile</h1>
                <p>Your account information and quiz history</p>
            </div>

            {/* Profile Information */}
            <div className="profile-section">
                <div className="card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUser /> Account Information
                    </h3>
                    <div className="profile-info">
                        <div className="info-item">
                            <FaUser className="info-icon" />
                            <div className="info-content">
                                <label>Username</label>
                                <span>{profile?.username}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <FaEnvelope className="info-icon" />
                            <div className="info-content">
                                <label>Email</label>
                                <span>{profile?.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <FaCalendar className="info-icon" />
                            <div className="info-content">
                                <label>Member Since</label>
                                <span>{new Date(profile?.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="profile-section">
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>
                        <FaChartLine /> Your Statistics
                    </h2>
                    <div className="dashboard-grid">
                        <div className="stats-card">
                            <h3>{stats.total_quizzes || 0}</h3>
                            <p>Total Quizzes</p>
                        </div>
                        <div className="stats-card">
                            <h3>{stats.average_score || 0}%</h3>
                            <p>Average Score</p>
                        </div>
                        <div className="stats-card">
                            <h3>{stats.best_score || 0}%</h3>
                            <p>Best Score</p>
                        </div>
                        <div className="stats-card">
                            <h3>{stats.accuracy || 0}%</h3>
                            <p>Accuracy</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Chart
            {history.length > 0 && (
                <div className="profile-section">
                    <div className="card">
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaChartLine /> Performance Trend
                        </h3>
                        <div style={{ height: '300px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            )} */}

            {/* Quiz History */}
            <div className="profile-section">
                <h2 style={{ color: 'white', marginBottom: '20px' }}>
                    <FaHistory /> Quiz History
                </h2>
                {history.length > 0 ? (
                    <div className="history-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Score</th>
                                    <th>Correct</th>
                                    <th>Total</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((result, index) => (
                                    <tr key={index}>
                                        <td>{new Date(result.completed_at).toLocaleDateString()}</td>
                                        <td className="score-cell">
                                            <span className={`score-badge ${result.score >= 80 ? 'excellent' : result.score >= 60 ? 'good' : 'poor'}`}>
                                                {result.score}%
                                            </span>
                                        </td>
                                        <td>{result.correct_answers}</td>
                                        <td>{result.total_questions}</td>
                                        <td>{result.time_taken || 'N/A'} min</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card text-center">
                        <h3>No Quiz History</h3>
                        <p>You haven't taken any quizzes yet. Start your journey now!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 