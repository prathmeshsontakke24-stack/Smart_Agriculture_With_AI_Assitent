import React, { useState, useEffect } from 'react';
import { getCrops } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCrops: 0,
        totalArea: 0,
        avgMoisture: 0,
        activeAlerts: 0
    });

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await getCrops();
            setCrops(response.data);
            calculateStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crops:', error);
            setLoading(false);
        }
    };

    const calculateStats = (cropData) => {
        let totalArea = 0;
        let totalMoisture = 0;
        let moistureCount = 0;
        let alerts = 0;

        cropData.forEach(crop => {
            totalArea += crop.area || 0;
            
            if (crop.sensorData && crop.sensorData.length > 0) {
                const latestSensor = crop.sensorData[crop.sensorData.length - 1];
                if (latestSensor.soilMoisture) {
                    totalMoisture += latestSensor.soilMoisture;
                    moistureCount++;
                    
                    if (latestSensor.soilMoisture < 30) {
                        alerts++;
                    }
                }
            }
        });

        setStats({
            totalCrops: cropData.length,
            totalArea: totalArea.toFixed(2),
            avgMoisture: moistureCount > 0 ? (totalMoisture / moistureCount).toFixed(1) : 0,
            activeAlerts: alerts
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Agriculture Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Crops</h3>
                    <p className="stat-number">{stats.totalCrops}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Area</h3>
                    <p className="stat-number">{stats.totalArea} ha</p>
                </div>
                <div className="stat-card">
                    <h3>Avg Soil Moisture</h3>
                    <p className="stat-number">{stats.avgMoisture}%</p>
                </div>
                <div className="stat-card alert">
                    <h3>Active Alerts</h3>
                    <p className="stat-number">{stats.activeAlerts}</p>
                </div>
            </div>

            <div className="recent-crops">
                <h2>Recent Crops</h2>
                <div className="crops-list">
                    {crops.slice(0, 5).map(crop => (
                        <div key={crop.id} className="crop-card">
                            <h4>{crop.name}</h4>
                            <p>Type: {crop.type}</p>
                            <p>Area: {crop.area} hectares</p>
                            {crop.sensorData && crop.sensorData.length > 0 && (
                                <p>Soil Moisture: {crop.sensorData[crop.sensorData.length - 1].soilMoisture}%</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;