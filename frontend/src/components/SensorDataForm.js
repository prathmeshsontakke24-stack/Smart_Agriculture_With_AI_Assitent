import React, { useState } from 'react';
import { addSensorData } from '../services/api';
// import './SensorDataForm.css';

function SensorDataForm({ cropId, onDataAdded }) {
    const [formData, setFormData] = useState({
        temperature: '',
        humidity: '',
        soilMoisture: '',
        rainfall: '',
        phLevel: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await addSensorData(cropId, {
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                soilMoisture: parseFloat(formData.soilMoisture),
                rainfall: parseFloat(formData.rainfall),
                phLevel: parseFloat(formData.phLevel)
            });
            setMessage('Sensor data added successfully!');
            setFormData({
                temperature: '',
                humidity: '',
                soilMoisture: '',
                rainfall: '',
                phLevel: ''
            });
            if (onDataAdded) onDataAdded();
        } catch (error) {
            console.error('Error adding sensor data:', error);
            setMessage('Failed to add sensor data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sensor-form-container">
            <h3>Add Sensor Data</h3>
            <form onSubmit={handleSubmit} className="sensor-form">
                {message && <div className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</div>}
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Temperature (°C)</label>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            required
                            step="0.1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Humidity (%)</label>
                        <input
                            type="number"
                            name="humidity"
                            value={formData.humidity}
                            onChange={handleChange}
                            required
                            step="0.1"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Soil Moisture (%)</label>
                        <input
                            type="number"
                            name="soilMoisture"
                            value={formData.soilMoisture}
                            onChange={handleChange}
                            required
                            step="0.1"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-group">
                        <label>Rainfall (mm)</label>
                        <input
                            type="number"
                            name="rainfall"
                            value={formData.rainfall}
                            onChange={handleChange}
                            required
                            step="0.1"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>pH Level</label>
                    <input
                        type="number"
                        name="phLevel"
                        value={formData.phLevel}
                        onChange={handleChange}
                        required
                        step="0.1"
                        min="0"
                        max="14"
                    />
                </div>

                <button type="submit" className="submit-sensor-btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Sensor Data'}
                </button>
            </form>
        </div>
    );
}

export default SensorDataForm;