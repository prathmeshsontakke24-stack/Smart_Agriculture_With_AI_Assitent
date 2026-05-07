import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register'; // Add this import
import ProtectedRoute from './components/ProtectedRoute';
import ModernDashboard from './components/ModernDashboard';
import CropList from './components/CropList';
import CropForm from './components/CropForm';
import CropDetail from './components/CropDetail';
import './App.css';

function App() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return (
        <Router>
            <div className="App">
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
                {isLoggedIn && <Navbar />}
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} /> {/* Add this route */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <ModernDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/crops" element={
                            <ProtectedRoute>
                                <CropList />
                            </ProtectedRoute>
                        } />
                        <Route path="/add-crop" element={
                            <ProtectedRoute>
                                <CropForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/crop/:id" element={
                            <ProtectedRoute>
                                <CropDetail />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;