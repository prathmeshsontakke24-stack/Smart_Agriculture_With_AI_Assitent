import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Crop API calls
export const getCrops = () => api.get('/crops');
export const getCropById = (id) => api.get(`/crops/${id}`);
export const createCrop = (crop) => api.post('/crops', crop);
export const updateCrop = (id, crop) => api.put(`/crops/${id}`, crop);
export const deleteCrop = (id) => api.delete(`/crops/${id}`);
export const addSensorData = (id, sensorData) => api.post(`/crops/${id}/sensors`, sensorData);
export const getRecommendations = (id) => api.get(`/crops/${id}/recommendations`);
export const implementRecommendation = (cropId, recommendationId) => 
    api.put(`/crops/${cropId}/recommendations/${recommendationId}/implement`);
export const completeTask = (cropId, scheduleId) => {
    return api.put(`/crops/${cropId}/schedules/${scheduleId}/complete`);
};
export default api;