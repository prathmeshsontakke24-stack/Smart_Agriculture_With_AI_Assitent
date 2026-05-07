import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCropById, addSensorData, getRecommendations, implementRecommendation, completeTask } from '../services/api';
import SensorDataForm from './SensorDataForm';
import Recommendations from './Recommendations';
import PlantDiseaseDetector from './PlantDiseaseDetector';
import { FaRobot, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './CropDetail.css';

function CropDetail() {
    const { id } = useParams();
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showSensorForm, setShowSensorForm] = useState(false);
    const [taskCompleteMessage, setTaskCompleteMessage] = useState('');
    const [showAIChat, setShowAIChat] = useState(false);
    const [userQuestion, setUserQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [askingAI, setAskingAI] = useState(false);

    useEffect(() => {
        fetchCropDetails();
    }, [id]);

    const fetchCropDetails = async () => {
        try {
            const response = await getCropById(id);
            setCrop(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crop details:', error);
            setLoading(false);
        }
    };

    const askAIQuestion = async () => {
        if (!userQuestion.trim()) return;
        
        setAskingAI(true);
        toast.loading('Getting AI response...', { id: 'ai-ask' });
        
        try {
            setTimeout(() => {
                let response = '';
                const question = userQuestion.toLowerCase();
                
                if (question.includes('yield') || question.includes('production')) {
                    response = `📈 Based on your ${crop.name} crops:\n\nCurrent growth stage: ${crop.growthStage} (${crop.growthProgress}% complete)\nSoil moisture: ${crop.sensorData?.length > 0 ? crop.sensorData[crop.sensorData.length - 1].soilMoisture : 'N/A'}%\n\nRecommendations to increase yield:\n• Maintain soil moisture at 40-60%\n• Apply balanced NPK fertilizer\n• Ensure proper spacing for air circulation\n• Regular pest monitoring\n• Harvest at optimal maturity stage`;
                } 
                else if (question.includes('pest') || question.includes('insect')) {
                    response = `🐛 Pest Management for ${crop.name}:\n\nCommon pests to watch for:\n• Aphids - Use neem oil spray\n• Stem borers - Install pheromone traps\n• Leaf miners - Remove affected leaves\n\nOrganic solutions:\n• Neem oil (5ml/L water) every 7 days\n• Garlic-chili spray for severe cases\n\nChemical options (if needed):\n• Consult local agricultural officer for specific pesticides`;
                }
                else if (question.includes('irrigation') || question.includes('water')) {
                    response = `💧 Irrigation Guide for ${crop.name}:\n\nCurrent soil moisture: ${crop.sensorData?.length > 0 ? crop.sensorData[crop.sensorData.length - 1].soilMoisture : 'N/A'}%\n\nRecommended schedule:\n• ${crop.growthStage} stage: Water every 3-4 days\n• Morning irrigation preferred (reduces evaporation)\n• Avoid water logging\n• Drip irrigation recommended for efficiency\n\nSigns of water stress:\n• Wilting leaves\n• Yellowing from edges\n• Stunted growth`;
                }
                else if (question.includes('harvest')) {
                    response = `🌾 Harvesting Guide for ${crop.name}:\n\nExpected harvest time: ${crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'Based on growth stage'}\n\nSigns of readiness:\n• Color change to golden/yellow\n• Grains/ fruits fully developed\n• Easy separation from plant\n\nHarvesting tips:\n• Harvest in dry weather\n• Use clean, sharp tools\n• Handle carefully to avoid damage\n• Store in cool, dry place`;
                }
                else if (question.includes('fertilizer') || question.includes('nutrient')) {
                    response = `🌿 Fertilizer Recommendation for ${crop.name}:\n\nSoil type: ${crop.soilType}\nGrowth stage: ${crop.growthStage}\n\nRecommended schedule:\n• Seedling stage: Light nitrogen application\n• Vegetative stage: High nitrogen\n• Flowering stage: Balanced NPK\n• Fruiting stage: High potassium\n\nOrganic options:\n• Compost: 5-10 tons/hectare\n• Vermicompost: 2-3 tons/hectare\n• Green manure crops\n\nTip: Always do soil test before major fertilizer application`;
                }
                else {
                    response = `🤖 AI Assistant Response for ${crop.name}:\n\nQuestion: "${userQuestion}"\n\nBased on current crop data:\n• Crop Type: ${crop.type}\n• Growth Stage: ${crop.growthStage} (${crop.growthProgress}%)\n• Soil Type: ${crop.soilType}\n• Area: ${crop.area} hectares\n\nRecommendation: ${getGeneralAdvice(crop)}\n\nFor specific advice, please provide more details about your concern.`;
                }
                
                setAiResponse(response);
                setAskingAI(false);
                toast.success('AI response ready!', { id: 'ai-ask' });
            }, 1500);
        } catch (error) {
            toast.error('Failed to get AI response', { id: 'ai-ask' });
            setAskingAI(false);
        }
    };

    const getGeneralAdvice = (crop) => {
        if (crop.sensorData && crop.sensorData.length > 0) {
            const latest = crop.sensorData[crop.sensorData.length - 1];
            if (latest.soilMoisture < 30) {
                return "Soil moisture is low. Please irrigate immediately.";
            } else if (latest.soilMoisture > 70) {
                return "Soil moisture is high. Ensure proper drainage.";
            } else if (latest.phLevel < 5.5 || latest.phLevel > 7.5) {
                return "Soil pH needs adjustment. Apply lime or sulfur as needed.";
            }
        }
        return "Continue regular monitoring and follow the recommended schedule.";
    };

    const handleTaskComplete = async (scheduleId) => {
        if (window.confirm('Mark this task as completed?')) {
            try {
                await completeTask(id, scheduleId);
                setTaskCompleteMessage('Task completed successfully!');
                fetchCropDetails();
                setTimeout(() => setTaskCompleteMessage(''), 3000);
            } catch (error) {
                console.error('Error completing task:', error);
            }
        }
    };

    const getGrowthStageColor = (stage) => {
        const colors = {
            'SEEDLING': '#4caf50',
            'VEGETATIVE': '#2196f3',
            'FLOWERING': '#ff9800',
            'FRUITING': '#9c27b0',
            'MATURITY': '#f44336'
        };
        return colors[stage] || '#757575';
    };

    if (loading) return <div className="loading">Loading crop details...</div>;
    if (!crop) return <div className="error">Crop not found</div>;

    return (
        <div className="crop-detail-container">
            {taskCompleteMessage && <div className="success-message">{taskCompleteMessage}</div>}

            <div className="crop-header">
                <h1>{crop.name}</h1>
                <div className="header-buttons">
                    <button
                        className="ai-chat-btn"
                        onClick={() => setShowAIChat(!showAIChat)}
                    >
                        <FaRobot /> Ask AI Assistant
                    </button>
                    <button
                        className="add-sensor-btn"
                        onClick={() => setShowSensorForm(!showSensorForm)}
                    >
                        {showSensorForm ? 'Close' : '+ Add Sensor Data'}
                    </button>
                </div>
            </div>

            {showAIChat && (
                <div className="ai-chat-container">
                    <div className="ai-chat-header">
                        <FaRobot className="ai-icon" />
                        <h3>AI Farming Assistant</h3>
                        <button className="close-chat-btn" onClick={() => setShowAIChat(false)}>✕</button>
                    </div>
                    <div className="ai-chat-body">
                        {aiResponse && (
                            <div className="ai-response">
                                <strong>🤖 AI Assistant:</strong>
                                <div className="response-text">{aiResponse.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}</div>
                            </div>
                        )}
                        <div className="ai-question-input">
                            <textarea
                                placeholder="Ask anything about your crops... e.g., 'How to increase yield?', 'When to harvest?', 'Pest control methods?'"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                rows="3"
                            />
                            <button onClick={askAIQuestion} disabled={askingAI}>
                                {askingAI ? <FaSpinner className="spinner" /> : 'Ask AI'}
                            </button>
                        </div>
                        <div className="suggested-questions">
                            <p>💡 Suggested questions:</p>
                            <button onClick={() => setUserQuestion("How to increase crop yield?")}>📈 Increase yield</button>
                            <button onClick={() => setUserQuestion("What are common pests for this crop?")}>🐛 Pest control</button>
                            <button onClick={() => setUserQuestion("Best irrigation schedule?")}>💧 Irrigation</button>
                            <button onClick={() => setUserQuestion("When is the best time to harvest?")}>🌾 Harvest time</button>
                            <button onClick={() => setUserQuestion("What fertilizers should I use?")}>🌿 Fertilizers</button>
                        </div>
                    </div>
                </div>
            )}

            {showSensorForm && (
                <SensorDataForm cropId={id} onDataAdded={fetchCropDetails} />
            )}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedules')}
                >
                    Tasks & Schedule
                </button>
                <button
                    className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recommendations')}
                >
                    AI Recommendations
                </button>
                <button
                    className={`tab ${activeTab === 'diseases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('diseases')}
                >
                    Diseases & Treatment
                </button>
                <button
                    className={`tab ${activeTab === 'yield' ? 'active' : ''}`}
                    onClick={() => setActiveTab('yield')}
                >
                    Yield Prediction
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="tab-content">
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>Basic Information</h3>
                            <p><strong>Type:</strong> {crop.type}</p>
                            <p><strong>Variety:</strong> {crop.variety || 'Not specified'}</p>
                            <p><strong>Area:</strong> {crop.area} hectares</p>
                            <p><strong>Soil Type:</strong> {crop.soilType}</p>
                            <p><strong>Planting Date:</strong> {new Date(crop.plantingDate).toLocaleDateString()}</p>
                        </div>

                        <div className="info-card">
                            <h3>Growth Status</h3>
                            <div className="growth-stage">
                                <span
                                    className="stage-badge"
                                    style={{ backgroundColor: getGrowthStageColor(crop.growthStage) }}
                                >
                                    {crop.growthStage}
                                </span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${crop.growthProgress}%` }}
                                    />
                                </div>
                                <p>{crop.growthProgress}% Complete</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Latest Sensor Data</h3>
                            {crop.sensorData && crop.sensorData.length > 0 ? (
                                <div className="sensor-readings">
                                    <p>🌡️ Temperature: {crop.sensorData[crop.sensorData.length - 1].temperature}°C</p>
                                    <p>💧 Humidity: {crop.sensorData[crop.sensorData.length - 1].humidity}%</p>
                                    <p>🌱 Soil Moisture: {crop.sensorData[crop.sensorData.length - 1].soilMoisture}%</p>
                                    <p>📊 pH Level: {crop.sensorData[crop.sensorData.length - 1].phLevel}</p>
                                    <p>☔ Rainfall: {crop.sensorData[crop.sensorData.length - 1].rainfall}mm</p>
                                    <small>Updated: {new Date(crop.sensorData[crop.sensorData.length - 1].timestamp).toLocaleString()}</small>
                                </div>
                            ) : (
                                <p>No sensor data yet. Add your first reading!</p>
                            )}
                        </div>

                        <div className="info-card">
                            <h3>Expert Tips</h3>
                            <ul className="tips-list">
                                {crop.expertTips && crop.expertTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        {crop.notes && (
                            <div className="info-card">
                                <h3>Notes</h3>
                                <p>{crop.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'schedules' && (
                <div className="tab-content">
                    <h2>Farming Tasks & Schedule</h2>
                    {crop.schedules && crop.schedules.length > 0 ? (
                        <div className="schedules-list">
                            {crop.schedules.map(schedule => (
                                <div key={schedule.id} className={`schedule-card ${schedule.isCompleted ? 'completed' : ''}`}>
                                    <div className="schedule-header">
                                        <h3>{schedule.title}</h3>
                                        <span className={`priority priority-${schedule.priority}`}>
                                            Priority {schedule.priority}
                                        </span>
                                    </div>
                                    <p>{schedule.description}</p>
                                    <p><strong>Due:</strong> {new Date(schedule.scheduledDate).toLocaleDateString()}</p>
                                    <p><strong>Type:</strong> {schedule.activityType}</p>
                                    {schedule.requiredResources && (
                                        <p><strong>Resources:</strong> {schedule.requiredResources.join(', ')}</p>
                                    )}
                                    {!schedule.isCompleted && (
                                        <button
                                            className="complete-task-btn"
                                            onClick={() => handleTaskComplete(schedule.id)}
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                    {schedule.isCompleted && (
                                        <span className="completed-badge">✓ Completed</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tasks scheduled yet.</p>
                    )}
                </div>
            )}

            {activeTab === 'recommendations' && (
                <div className="tab-content">
                    <Recommendations cropId={id} />
                </div>
            )}

            {activeTab === 'diseases' && (
                <div className="tab-content">
                    <PlantDiseaseDetector 
                        cropId={id} 
                        cropType={crop.type}
                        onAnalysisComplete={(analysis) => {
                            toast.success('Disease analysis saved to crop record!');
                            fetchCropDetails();
                        }}
                    />
                    <h2 style={{ marginTop: '2rem' }}>Historical Diseases</h2>
                    {crop.diseases && crop.diseases.length > 0 ? (
                        <div className="diseases-list">
                            {crop.diseases.map(disease => (
                                <div key={disease.id} className={`disease-card severity-${disease.severity.toLowerCase()}`}>
                                    <div className="disease-header">
                                        <h3>{disease.name}</h3>
                                        <span className="severity-badge">{disease.severity}</span>
                                    </div>
                                    <p><strong>Scientific Name:</strong> {disease.scientificName}</p>
                                    <p><strong>Detected:</strong> {new Date(disease.detectionDate).toLocaleDateString()}</p>
                                    <p><strong>Affected Area:</strong> {disease.affectedArea}</p>

                                    <h4>Symptoms:</h4>
                                    <ul>
                                        {disease.symptoms.map((symptom, idx) => (
                                            <li key={idx}>{symptom}</li>
                                        ))}
                                    </ul>

                                    <h4>Causes:</h4>
                                    <ul>
                                        {disease.causes.map((cause, idx) => (
                                            <li key={idx}>{cause}</li>
                                        ))}
                                    </ul>

                                    <h4>Treatment:</h4>
                                    {disease.treatments.map(treatment => (
                                        <div key={treatment.id} className="treatment-card">
                                            <p><strong>{treatment.name}</strong> ({treatment.type})</p>
                                            <p>Method: {treatment.applicationMethod}</p>
                                            <p>Dosage: {treatment.dosage}</p>
                                            <p>Frequency: {treatment.frequency}</p>
                                            <h5>Instructions:</h5>
                                            <ul>
                                                {treatment.instructions.map((instruction, idx) => (
                                                    <li key={idx}>{instruction}</li>
                                                ))}
                                            </ul>
                                            {treatment.precautions && (
                                                <>
                                                    <h5>Precautions:</h5>
                                                    <ul>
                                                        {treatment.precautions.map((precaution, idx) => (
                                                            <li key={idx}>{precaution}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-diseases">
                            <p>✅ No historical diseases recorded!</p>
                            <p>Keep monitoring your crops regularly.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'yield' && crop.yieldPrediction && (
                <div className="tab-content">
                    <div className="yield-prediction">
                        <h2>Yield Prediction</h2>
                        <div className="yield-card">
                            <div className="predicted-yield">
                                <h3>Predicted Yield</h3>
                                <p className="yield-value">{crop.yieldPrediction.predictedYield}</p>
                                <p>Base Yield: {crop.yieldPrediction.baseYield}</p>
                                <p>Confidence: {crop.yieldPrediction.confidence}</p>
                                <p>Quality Grade: {crop.yieldPrediction.quality}</p>
                            </div>

                            {crop.yieldPrediction.recommendations && crop.yieldPrediction.recommendations.length > 0 && (
                                <div className="yield-tips">
                                    <h3>Improvement Tips</h3>
                                    <ul>
                                        {crop.yieldPrediction.recommendations.map((tip, idx) => (
                                            <li key={idx}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CropDetail;