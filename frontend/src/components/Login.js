import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf, FaUser, FaLock, FaSeedling, FaTractor } from 'react-icons/fa';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Hardcoded admin/farmer credentials for backward compatibility
    const hardcodedCredentials = {
        admin: 'admin123',
        farmer: 'farmer123'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!username || !password) {
            setError('Please enter both username and password');
            setLoading(false);
            return;
        }

        // Get all registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user exists in registered users
        const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
        
        // Check hardcoded credentials
        const isHardcodedUser = hardcodedCredentials[username] === password;
        
        if (foundUser || isHardcodedUser) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Set user role
            if (foundUser) {
                localStorage.setItem('userRole', foundUser.role || 'Farmer');
            } else if (username === 'admin') {
                localStorage.setItem('userRole', 'Admin');
            } else {
                localStorage.setItem('userRole', 'Farmer');
            }
            
            // Call the onLogin callback if provided
            if (onLogin) {
                onLogin(true);
            }
            
            // Redirect to dashboard
            window.location.href = '/';
        } else {
            setError('Invalid username or password. Please register if you don\'t have an account.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-left">
                    <div className="login-brand">
                        <div className="brand-icon">
                            <FaLeaf className="main-icon" />
                            <FaSeedling className="sub-icon" />
                        </div>
                        <h1>Smart Agriculture</h1>
                        <p>AI-Powered Farming Platform</p>
                    </div>
                    <div className="login-features">
                        <div className="feature">
                            <FaTractor />
                            <span>Smart Crop Management</span>
                        </div>
                        <div className="feature">
                            <FaLeaf />
                            <span>AI Disease Detection</span>
                        </div>
                        <div className="feature">
                            <FaSeedling />
                            <span>Yield Prediction</span>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-form-container">
                        <h2>Welcome Back</h2>
                        <p className="login-subtitle">Login to access your farm dashboard</p>
                        
                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}
                            
                            <div className="input-group">
                                <label>
                                    <FaUser className="input-icon" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <FaLock className="input-icon" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="demo-credentials">
                                <p>Demo Credentials:</p>
                                <div className="cred-buttons">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setUsername('admin');
                                            setPassword('admin123');
                                        }}
                                        className="cred-btn"
                                    >
                                        Admin: admin/admin123
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setUsername('farmer');
                                            setPassword('farmer123');
                                        }}
                                        className="cred-btn"
                                    >
                                        Farmer: farmer/farmer123
                                    </button>
                                </div>
                            </div>

                            <div className="register-link">
                                Don't have an account? <Link to="/register">Register here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;