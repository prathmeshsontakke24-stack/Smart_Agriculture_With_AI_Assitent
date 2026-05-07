import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaLeaf, FaFlask, FaTint, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';
// import './PlantDiseaseDetector.css';

function PlantDiseaseDetector({ cropId, cropType, onAnalysisComplete }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [usingAI, setUsingAI] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setAnalysisResult(null);
            
            // Show API key modal if not set
            if (!aiService.openAIKey && !aiService.geminiKey) {
                setShowApiKeyModal(true);
            } else {
                analyzeImage(file);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1
    });

    const analyzeImage = async (file) => {
        setAnalyzing(true);
        setUsingAI(true);
        
        toast.loading('AI is analyzing your plant...', { id: 'analysis' });
        
        try {
            const result = await aiService.analyzePlantDisease(file, cropType);
            
            if (result.success) {
                setAnalysisResult(result.analysis);
                toast.success('Analysis complete!', { id: 'analysis' });
                if (onAnalysisComplete) {
                    onAnalysisComplete(result.analysis);
                }
            } else {
                setAnalysisResult(result.fallbackAnalysis);
                toast.error('Using local analysis database', { id: 'analysis' });
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Analysis failed. Using local database.', { id: 'analysis' });
            const fallback = aiService.getLocalAIAnalysis(cropType);
            setAnalysisResult(fallback);
        } finally {
            setAnalyzing(false);
            setUsingAI(false);
        }
    };

    const saveApiKey = () => {
        if (apiKeyInput.startsWith('AIza')) {
            aiService.geminiKey = apiKeyInput;
            toast.success('Gemini API Key saved!');
        } else if (apiKeyInput.startsWith('sk-')) {
            aiService.openAIKey = apiKeyInput;
            toast.success('OpenAI API Key saved!');
        } else {
            toast.error('Invalid API key format');
            return;
        }
        setShowApiKeyModal(false);
        if (selectedImage) {
            analyzeImage(selectedImage);
        }
    };

    const getSeverityColor = (severity) => {
        if (!severity) return '#757575';
        const sev = severity.toLowerCase();
        if (sev.includes('low')) return '#4caf50';
        if (sev.includes('medium')) return '#ff9800';
        if (sev.includes('high')) return '#f44336';
        return '#757575';
    };

    return (
        <div className="disease-detector">
            <div className="detector-header">
                <h3>
                    <FaLeaf className="header-icon" />
                    AI Plant Disease Detector
                </h3>
                <p>Upload a photo of your plant for instant diagnosis and treatment</p>
            </div>

            <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} />
                <FaCloudUploadAlt className="upload-icon" />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : (
                    <p>Drag & drop a plant photo here, or click to select</p>
                )}
                <small>Supports: JPEG, PNG, GIF (Max 5MB)</small>
            </div>

            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Plant preview" />
                    {analyzing && (
                        <div className="analyzing-overlay">
                            <FaSpinner className="spinner" />
                            <p>AI is analyzing your plant...</p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {analysisResult && (
                    <motion.div 
                        className="analysis-result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="result-header">
                            <FaCheckCircle className="success-icon" />
                            <h4>AI Diagnosis Complete</h4>
                            {usingAI && <span className="ai-badge">Powered by AI</span>}
                        </div>

                        <div className="result-grid">
                            <div className="result-section">
                                <h5>
                                    <FaExclamationTriangle />
                                    Disease Identification
                                </h5>
                                <p className="disease-name">{analysisResult.disease || 'General Plant Issue'}</p>
                                {analysisResult.severity && (
                                    <div className="severity-badge" style={{ backgroundColor: getSeverityColor(analysisResult.severity) }}>
                                        Severity: {analysisResult.severity}
                                    </div>
                                )}
                            </div>

                            <div className="result-section">
                                <h5>Causes</h5>
                                <p>{analysisResult.causes || 'Environmental stress or pathogen attack'}</p>
                            </div>

                            <div className="result-section">
                                <h5>
                                    <FaFlask />
                                    Immediate Treatment
                                </h5>
                                <p>{analysisResult.immediateTreatment || 'Apply recommended fungicide/pesticide'}</p>
                            </div>

                            <div className="result-section organic">
                                <h5>
                                    <FaLeaf />
                                    Organic Solution
                                </h5>
                                <p>{analysisResult.organicSolution || 'Use neem oil or compost tea'}</p>
                            </div>

                            {analysisResult.chemicalSolution && (
                                <div className="result-section chemical">
                                    <h5>
                                        <FaTint />
                                        Chemical Solution (If Severe)
                                    </h5>
                                    <p>{analysisResult.chemicalSolution}</p>
                                </div>
                            )}

                            <div className="result-section">
                                <h5>Prevention Measures</h5>
                                <p>{analysisResult.prevention || 'Maintain proper crop management'}</p>
                            </div>

                            <div className="result-section">
                                <h5>
                                    <FaCalendarAlt />
                                    Expected Recovery
                                </h5>
                                <p>{analysisResult.recoveryTime || '7-14 days'}</p>
                            </div>
                        </div>

                        <div className="result-footer">
                            <p className="disclaimer">
                                ⚠️ This is an AI-powered analysis. For critical cases, consult a local agricultural expert.
                            </p>
                            <button 
                                className="save-analysis-btn"
                                onClick={() => onAnalysisComplete && onAnalysisComplete(analysisResult)}
                            >
                                Save to Crop Record
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showApiKeyModal && (
                <div className="modal-overlay">
                    <div className="api-key-modal">
                        <h3>🔑 Enter AI API Key</h3>
                        <p>To get real-time AI analysis, please enter your API key:</p>
                        <div className="api-key-options">
                            <div className="option">
                                <strong>Option 1: Google Gemini (Free)</strong>
                                <p>Get key from: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
                            </div>
                            <div className="option">
                                <strong>Option 2: OpenAI GPT-4 (Paid)</strong>
                                <p>Get key from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></p>
                            </div>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your API key"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={saveApiKey} className="save-key-btn">Save & Analyze</button>
                            <button onClick={() => {
                                setShowApiKeyModal(false);
                                analyzeImage(selectedImage);
                            }} className="skip-btn">Use Local Analysis</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlantDiseaseDetector;