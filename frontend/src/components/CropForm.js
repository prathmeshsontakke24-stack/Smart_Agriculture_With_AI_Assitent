import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCrop } from '../services/api';
 import './CropForm.css';

function CropForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        variety: '',
        area: '',
        soilType: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createCrop({
                ...formData,
                area: parseFloat(formData.area)
            });
            navigate('/crops');
        } catch (error) {
            console.error('Error creating crop:', error);
            setError('Failed to create crop. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crop-form-container">
            <h1>Add New Crop</h1>
            <form onSubmit={handleSubmit} className="crop-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="name">Crop Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Rice, Wheat, Corn"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Crop Type *</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Cereal, Vegetable, Fruit"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="area">Area (hectares) *</label>
                    <input
                        type="number"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                        step="0.1"
                        min="0.1"
                        placeholder="e.g., 2.5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="soilType">Soil Type *</label>
                    <select
                        id="soilType"
                        name="soilType"
                        value={formData.soilType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select soil type</option>
                        {soilTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="variety">Variety (optional)</label>
                    <input
                        type="text"
                        id="variety"
                        name="variety"
                        value={formData.variety}
                        onChange={handleChange}
                        placeholder="e.g., IR64, HD2967, etc."
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Crop'}
                </button>
            </form>
        </div>
    );
}

export default CropForm;