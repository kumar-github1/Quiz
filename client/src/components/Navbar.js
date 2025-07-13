import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTrophy, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <FaTrophy className="navbar-icon" />
                    Quiz App
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="navbar-link">
                                <FaHome /> Dashboard
                            </Link>
                            <Link to="/quiz" className="navbar-link">
                                Take Quiz
                            </Link>
                            <Link to="/scoreboard" className="navbar-link">
                                <FaTrophy /> Scoreboard
                            </Link>
                            <Link to="/profile" className="navbar-link">
                                <FaUser /> Profile
                            </Link>
                            <button onClick={handleLogout} className="navbar-link logout-btn">
                                <FaSignOutAlt /> Logout
                            </button>
                            <span className="navbar-user">
                                Welcome, {user?.username}!
                            </span>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/register" className="navbar-link">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 