import React, { useState, useEffect } from 'react';
import { getCrops, deleteCrop } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CropList.css';

function CropList() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await getCrops();
            setCrops(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crops:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/crop/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this crop?')) {
            try {
                await deleteCrop(id);
                fetchCrops();
            } catch (error) {
                console.error('Error deleting crop:', error);
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading crops...</div>;
    }

    return (
        <div className="crop-list-container">
            <h1>My Crops</h1>
            {crops.length === 0 ? (
                <p className="no-crops">No crops added yet. Click "Add Crop" to get started!</p>
            ) : (
                <div className="crops-grid">
                    {crops.map(crop => (
                        <div key={crop.id} className="crop-card-large">
                            <div className="crop-header">
                                <h3>{crop.name}</h3>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(crop.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="crop-details">
                                <p><strong>Type:</strong> {crop.type}</p>
                                <p><strong>Area:</strong> {crop.area} hectares</p>
                                <p><strong>Soil Type:</strong> {crop.soilType}</p>
                                <p><strong>Planting Date:</strong> {new Date(crop.plantingDate).toLocaleDateString()}</p>

                                {crop.sensorData && crop.sensorData.length > 0 && (
                                    <div className="sensor-data">
                                        <h4>Latest Sensor Data</h4>
                                        <p>🌡️ Temperature: {crop.sensorData[crop.sensorData.length - 1].temperature}°C</p>
                                        <p>💧 Humidity: {crop.sensorData[crop.sensorData.length - 1].humidity}%</p>
                                        <p>🌱 Soil Moisture: {crop.sensorData[crop.sensorData.length - 1].soilMoisture}%</p>
                                        <p>📊 pH Level: {crop.sensorData[crop.sensorData.length - 1].phLevel}</p>
                                    </div>
                                )}

                                {crop.recommendations && crop.recommendations.length > 0 && (
                                    <div className="recommendations-preview">
                                        <h4>Recent Recommendations</h4>
                                        {crop.recommendations.slice(0, 2).map(rec => (
                                            <div key={rec.id} className="rec-preview">
                                                <strong>{rec.title}</strong>
                                                <p>{rec.description.substring(0, 100)}...</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button 
                                    className="view-details-btn"
                                    onClick={() => handleViewDetails(crop.id)}
                                >
                                    View Details & Get Recommendations
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CropList;