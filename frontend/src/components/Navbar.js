import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle, FaTachometerAlt, FaLeaf, FaPlus } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check login status
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || 'Farmer';
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        navigate('/login');
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🌾</span>
                    <span className="logo-text">Smart Agriculture</span>
                </Link>
                
                <div className="nav-menu-wrapper">
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                <FaTachometerAlt className="nav-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/crops" className={`nav-link ${location.pathname === '/crops' ? 'active' : ''}`}>
                                <FaLeaf className="nav-icon" />
                                <span>My Crops</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add-crop" className={`nav-link ${location.pathname === '/add-crop' ? 'active' : ''}`}>
                                <FaPlus className="nav-icon" />
                                <span>Add Crop</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-right">
                    <div className="user-info">
                        <FaUserCircle className="user-icon" />
                        <span className="username">{username}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;