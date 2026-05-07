import React, { useState, useEffect } from 'react';
import { getRecommendations, implementRecommendation } from '../services/api';
// import './Recommendations.css';

function Recommendations({ cropId }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecommendations();
    }, [cropId]);

    const fetchRecommendations = async () => {
        try {
            const response = await getRecommendations(cropId);
            setRecommendations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('Failed to load recommendations');
            setLoading(false);
        }
    };

    const handleImplement = async (recommendationId) => {
        try {
            await implementRecommendation(cropId, recommendationId);
            fetchRecommendations();
        } catch (error) {
            console.error('Error implementing recommendation:', error);
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'irrigation': return '💧';
            case 'fertilizer': return '🌿';
            case 'pest_control': return '🐛';
            case 'harvesting': return '🌾';
            default: return '📋';
        }
    };

    if (loading) return <div className="recommendations-loading">Loading recommendations...</div>;
    if (error) return <div className="recommendations-error">{error}</div>;

    return (
        <div className="recommendations-container">
            <h3>AI Recommendations</h3>
            {recommendations.length === 0 ? (
                <p className="no-recommendations">No recommendations yet. Add sensor data to get AI insights!</p>
            ) : (
                <div className="recommendations-list">
                    {recommendations.map(rec => (
                        <div key={rec.id} className={`recommendation-card ${rec.isImplemented ? 'implemented' : ''}`}>
                            <div className="recommendation-header">
                                <span className="type-icon">{getTypeIcon(rec.type)}</span>
                                <h4>{rec.title}</h4>
                                <span className="confidence">{(rec.confidenceScore * 100).toFixed(0)}% confidence</span>
                            </div>
                            <p className="description">{rec.description}</p>
                            <div className="recommendation-footer">
                                <small>Date: {new Date(rec.date).toLocaleDateString()}</small>
                                {!rec.isImplemented && (
                                    <button 
                                        className="implement-btn"
                                        onClick={() => handleImplement(rec.id)}
                                    >
                                        Mark as Implemented
                                    </button>
                                )}
                                {rec.isImplemented && (
                                    <span className="implemented-badge">✓ Implemented</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recommendations;