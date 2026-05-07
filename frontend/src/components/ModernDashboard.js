import React, { useState, useEffect } from 'react';
import { getCrops } from '../services/api';
import { motion } from 'framer-motion';
import { FaTractor, FaSeedling, FaTint, FaThermometerHalf, FaRobot, FaLeaf, FaChartLine, FaCalendarAlt, FaCloudSun, FaWind, FaTachometerAlt } from 'react-icons/fa';
import './ModernDashboard.css';

function ModernDashboard() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCrops: 0,
        totalArea: 0,
        avgMoisture: 0,
        healthyCrops: 0,
        alerts: 0,
        criticalAlerts: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [weatherData, setWeatherData] = useState({
        temperature: 19,
        condition: 'Mostly clear',
        humidity: 65,
        windSpeed: 12
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getCrops();
            setCrops(response.data);
            calculateStats(response.data);
            generateActivities(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const calculateStats = (cropData) => {
        let totalArea = 0;
        let totalMoisture = 0;
        let moistureCount = 0;
        let alerts = 0;
        let criticalAlerts = 0;
        let healthy = 0;

        cropData.forEach(crop => {
            totalArea += crop.area || 0;
            
            if (crop.sensorData && crop.sensorData.length > 0) {
                const latest = crop.sensorData[crop.sensorData.length - 1];
                if (latest.soilMoisture) {
                    totalMoisture += latest.soilMoisture;
                    moistureCount++;
                    
                    if (latest.soilMoisture < 25) {
                        alerts++;
                        criticalAlerts++;
                    } else if (latest.soilMoisture < 30 || latest.soilMoisture > 70) {
                        alerts++;
                    }
                    
                    if (latest.soilMoisture >= 40 && latest.soilMoisture <= 60) {
                        healthy++;
                    }
                }
            }
        });

        setStats({
            totalCrops: cropData.length,
            totalArea: totalArea.toFixed(1),
            avgMoisture: moistureCount > 0 ? Math.round(totalMoisture / moistureCount) : 0,
            healthyCrops: healthy,
            alerts: alerts,
            criticalAlerts: criticalAlerts
        });
    };

    const generateActivities = (cropData) => {
        const activities = [];
        cropData.forEach(crop => {
            if (crop.sensorData && crop.sensorData.length > 0) {
                const latest = crop.sensorData[crop.sensorData.length - 1];
                let action = '';
                let type = '';
                
                if (latest.soilMoisture < 25) {
                    action = '🔴 Critical: Severe缺水';
                    type = 'critical';
                } else if (latest.soilMoisture < 30) {
                    action = '⚠️ Needs Immediate Irrigation';
                    type = 'warning';
                } else if (latest.soilMoisture > 75) {
                    action = '💧 Excess Water Detected';
                    type = 'warning';
                } else if (latest.soilMoisture >= 40 && latest.soilMoisture <= 60) {
                    action = '✅ Optimal Conditions';
                    type = 'success';
                } else {
                    action = '📊 Monitor Closely';
                    type = 'info';
                }
                
                activities.push({
                    crop: crop.name,
                    action: action,
                    type: type,
                    time: new Date(latest.timestamp).toLocaleString(),
                    moisture: latest.soilMoisture
                });
            } else {
                activities.push({
                    crop: crop.name,
                    action: '📝 No Sensor Data Yet',
                    type: 'info',
                    time: new Date(crop.plantingDate).toLocaleString(),
                    moisture: null
                });
            }
        });
        setRecentActivities(activities.slice(0, 6));
    };

    const statCards = [
        { 
            icon: <FaSeedling />, 
            title: 'Total Crops', 
            value: stats.totalCrops, 
            unit: '', 
            color: '#4caf50', 
            bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            description: 'Active crops in field'
        },
        { 
            icon: <FaTractor />, 
            title: 'Total Area', 
            value: stats.totalArea, 
            unit: 'ha', 
            color: '#2196f3', 
            bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            description: 'Cultivated land'
        },
        { 
            icon: <FaTint />, 
            title: 'Avg Moisture', 
            value: stats.avgMoisture, 
            unit: '%', 
            color: '#00bcd4', 
            bg: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
            description: 'Soil moisture level'
        },
        { 
            icon: <FaLeaf />, 
            title: 'Healthy Crops', 
            value: stats.healthyCrops, 
            unit: '', 
            color: '#8bc34a', 
            bg: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)',
            description: 'Optimal condition'
        },
        { 
            icon: <FaThermometerHalf />, 
            title: 'Active Alerts', 
            value: stats.alerts, 
            unit: '', 
            color: stats.criticalAlerts > 0 ? '#f44336' : '#ff9800', 
            bg: stats.criticalAlerts > 0 ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            description: stats.criticalAlerts > 0 ? `${stats.criticalAlerts} critical` : 'Needs attention'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading your farm data...</p>
            </div>
        );
    }

    return (
        <div className="modern-dashboard">
            {/* Header Section */}
            <motion.div 
                className="dashboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <h1>
                        <FaRobot className="ai-icon" />
                        Smart Agriculture Dashboard
                    </h1>
                    <p>Real-time monitoring & intelligent insights for your farm</p>
                </div>
                <div className="header-date">
                    <FaCalendarAlt />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </motion.div>

            {/* Stats Grid - 5 cards in responsive grid */}
            <div className="stats-grid-5">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card-modern"
                        style={{ background: stat.bg }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p className="stat-value">
                                {stat.value}
                                {stat.unit && <span className="stat-unit">{stat.unit}</span>}
                            </p>
                            <p className="stat-description">{stat.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid - 2 columns */}
            <div className="dashboard-main-grid">
                {/* Recent Crops Section */}
                <motion.div 
                    className="dashboard-card recent-crops-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-header">
                        <h2>
                            <FaSeedling className="card-icon" />
                            Recent Crops
                        </h2>
                        <span className="card-badge">{crops.length} total</span>
                    </div>
                    <div className="crops-list-modern">
                        {crops.length === 0 ? (
                            <div className="empty-state">
                                <p>🌱 No crops added yet</p>
                                <button className="empty-state-btn">Add Your First Crop</button>
                            </div>
                        ) : (
                            crops.slice(0, 5).map((crop, idx) => (
                                <div key={crop.id} className="crop-item-modern">
                                    <div className="crop-info">
                                        <strong>{crop.name}</strong>
                                        <span className="crop-type">{crop.type}</span>
                                    </div>
                                    <div className="crop-status">
                                        {crop.sensorData && crop.sensorData.length > 0 ? (
                                            <span className={`status-badge ${crop.sensorData[crop.sensorData.length - 1].soilMoisture < 30 ? 'warning' : crop.sensorData[crop.sensorData.length - 1].soilMoisture > 70 ? 'warning' : 'success'}`}>
                                                💧 {crop.sensorData[crop.sensorData.length - 1].soilMoisture}%
                                            </span>
                                        ) : (
                                            <span className="status-badge info">
                                                📝 No data
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Recent Activities Section */}
                <motion.div 
                    className="dashboard-card activities-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="card-header">
                        <h2>
                            <FaChartLine className="card-icon" />
                            Recent Activities
                        </h2>
                        <span className="card-badge">Live updates</span>
                    </div>
                    <div className="activities-list">
                        {recentActivities.length === 0 ? (
                            <div className="empty-state">
                                <p>📊 No recent activities</p>
                                <p className="empty-state-sub">Add sensor data to see updates</p>
                            </div>
                        ) : (
                            recentActivities.map((activity, idx) => (
                                <div key={idx} className={`activity-item ${activity.type}`}>
                                    <div className="activity-crop">{activity.crop}</div>
                                    <div className="activity-action">{activity.action}</div>
                                    <div className="activity-time">{activity.time}</div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Grid - AI Insights & Weather */}
            <div className="dashboard-bottom-grid">
                {/* AI Insights Section */}
                <motion.div 
                    className="dashboard-card ai-insights"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="card-header">
                        <h2>
                            <FaRobot className="card-icon" />
                            AI Insights
                        </h2>
                        <span className="card-badge">Powered by Gemini AI</span>
                    </div>
                    <div className="insights-grid">
                        <div className="insight-item">
                            <span className="insight-icon">🤖</span>
                            <p>24/7 AI monitoring active</p>
                        </div>
                        <div className="insight-item">
                            <span className="insight-icon">📸</span>
                            <p>Upload photos for disease detection</p>
                        </div>
                        <div className="insight-item">
                            <span className="insight-icon">💡</span>
                            <p>Personalized recommendations</p>
                        </div>
                        <div className="insight-item">
                            <span className="insight-icon">🌡️</span>
                            <p>Weather-based farming advice</p>
                        </div>
                    </div>
                </motion.div>

                {/* Weather & Metrics Section */}
                <motion.div 
                    className="dashboard-card weather-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="card-header">
                        <h2>
                            <FaCloudSun className="card-icon" />
                            Weather & Metrics
                        </h2>
                        <span className="card-badge">Live</span>
                    </div>
                    <div className="weather-content">
                        <div className="weather-main">
                            <div className="weather-temp">
                                <span className="temp-value">{weatherData.temperature}°C</span>
                                <span className="temp-condition">{weatherData.condition}</span>
                            </div>
                            <div className="weather-details">
                                <div className="weather-detail">
                                    <FaTint />
                                    <span>Humidity: {weatherData.humidity}%</span>
                                </div>
                                <div className="weather-detail">
                                    <FaWind />
                                    <span>Wind: {weatherData.windSpeed} km/h</span>
                                </div>
                            </div>
                        </div>
                        <div className="metrics-divider"></div>
                        <div className="metrics-grid">
                            <div className="metric-item">
                                <FaTachometerAlt />
                                <div>
                                    <span className="metric-label">Soil Quality</span>
                                    <span className="metric-value">Good</span>
                                </div>
                            </div>
                            <div className="metric-item">
                                <FaLeaf />
                                <div>
                                    <span className="metric-label">Crop Health</span>
                                    <span className="metric-value">{stats.healthyCrops}/{stats.totalCrops}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ModernDashboard;