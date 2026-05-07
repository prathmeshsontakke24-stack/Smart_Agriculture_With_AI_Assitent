import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf, FaUser, FaLock, FaEnvelope, FaSeedling, FaTractor, FaUserPlus } from 'react-icons/fa';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!formData.username || !formData.password || !formData.email) {
            setError('Please fill all required fields');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 4) {
            setError('Password must be at least 4 characters');
            setLoading(false);
            return;
        }

        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (existingUsers.find(u => u.username === formData.username)) {
            setError('Username already exists. Please choose another.');
            setLoading(false);
            return;
        }

        // Check if email already exists
        if (existingUsers.find(u => u.email === formData.email)) {
            setError('Email already registered. Please login instead.');
            setLoading(false);
            return;
        }

        // Create new user
        const newUser = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        setSuccess('Registration successful! Please login.');
        
        // Clear form
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'farmer'
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
            navigate('/login');
        }, 2000);
        
        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-left">
                    <div className="register-brand">
                        <div className="brand-icon">
                            <FaLeaf className="main-icon" />
                            <FaUserPlus className="sub-icon" />
                        </div>
                        <h1>Join Smart Agriculture</h1>
                        <p>Create your account to start farming smarter</p>
                    </div>
                    <div className="register-features">
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

                <div className="register-right">
                    <div className="register-form-container">
                        <h2>Create Account</h2>
                        <p className="register-subtitle">Start your farming journey today</p>
                        
                        <form onSubmit={handleSubmit} className="register-form">
                            {error && <div className="register-error">{error}</div>}
                            {success && <div className="register-success">{success}</div>}
                            
                            <div className="input-group">
                                <label>
                                    <FaUser className="input-icon" />
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <FaEnvelope className="input-icon" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <FaLock className="input-icon" />
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password (min 4 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <FaLock className="input-icon" />
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <FaSeedling className="input-icon" />
                                    Role
                                </label>
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="farmer">👨‍🌾 Farmer</option>
                                    <option value="agronomist">👨‍🔬 Agronomist</option>
                                    <option value="student">📚 Student</option>
                                    <option value="researcher">🔬 Researcher</option>
                                </select>
                            </div>

                            <button type="submit" className="register-btn" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Register'}
                            </button>

                            <div className="login-link">
                                Already have an account? <Link to="/login">Login here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;