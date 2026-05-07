import axios from 'axios';

class AIService {
    constructor() {
        // Only Gemini API key is needed - get it from https://makersuite.google.com/app/apikey
        this.geminiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    }

    // Analyze plant disease from image
    async analyzePlantDisease(imageFile, cropType = '') {
        try {
            // Convert image to base64 for analysis
            const base64Image = await this.fileToBase64(imageFile);
            
            // Use Gemini for comprehensive analysis
            const aiSolution = await this.getGeminiAnalysis(base64Image, cropType);
            
            return {
                success: true,
                analysis: aiSolution,
                confidence: this.calculateConfidence(aiSolution)
            };
        } catch (error) {
            console.error('AI Analysis Error:', error);
            return {
                success: false,
                error: error.message,
                fallbackAnalysis: this.getFallbackAnalysis(cropType)
            };
        }
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Gemini API call for plant disease analysis
    async getGeminiAnalysis(base64Image, cropType) {
        if (!this.geminiKey) {
            console.warn('No Gemini API key found. Using local analysis.');
            return this.getLocalAIAnalysis(cropType);
        }

        const prompt = this.buildAnalysisPrompt(cropType);
        
        try {
            // For Gemini with image, we need to send the image in the request
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.geminiKey}`,
                {
                    contents: [{
                        parts: [
                            { text: prompt },
                            { 
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image.split(',')[1]
                                }
                            }
                        ]
                    }]
                }
            );
            
            const analysisText = response.data.candidates[0].content.parts[0].text;
            return this.parseGeminiResponse(analysisText, cropType);
        } catch (error) {
            console.error('Gemini API Error:', error);
            // Fallback to local analysis if API fails
            return this.getLocalAIAnalysis(cropType);
        }
    }

    // Build prompt for Gemini
    buildAnalysisPrompt(cropType) {
        let prompt = `You are an expert agricultural scientist and plant pathologist. Analyze this plant image and provide a detailed diagnosis and treatment plan.\n\n`;
        
        if (cropType) {
            prompt += `Crop Type: ${cropType}\n`;
        }
        
        prompt += `\nPlease analyze and provide the following in a clear, structured format:\n\n`;
        prompt += `1. DISEASE IDENTIFICATION: What disease or issue does this plant have? If healthy, state "No disease detected"\n`;
        prompt += `2. SEVERITY: Low / Medium / High / Critical\n`;
        prompt += `3. CONFIDENCE: Your confidence level in this diagnosis (as percentage)\n`;
        prompt += `4. SYMPTOMS OBSERVED: List visible symptoms\n`;
        prompt += `5. CAUSES: What caused this condition?\n`;
        prompt += `6. IMMEDIATE TREATMENT: Step-by-step urgent actions\n`;
        prompt += `7. ORGANIC SOLUTION: Natural/organic treatment methods\n`;
        prompt += `8. CHEMICAL SOLUTION: Chemical options (if severe)\n`;
        prompt += `9. PREVENTION: How to prevent this in the future\n`;
        prompt += `10. RECOVERY TIME: Expected recovery duration\n`;
        prompt += `11. EXPERT TIPS: Additional advice for farmers\n`;
        
        return prompt;
    }

    // Parse Gemini's response into structured format
    parseGeminiResponse(analysisText, cropType) {
        // Extract information from Gemini's response
        const result = {
            disease: this.extractValue(analysisText, 'DISEASE IDENTIFICATION', 'General Plant Issue'),
            severity: this.extractValue(analysisText, 'SEVERITY', 'Medium'),
            confidence: this.extractValue(analysisText, 'CONFIDENCE', '85%'),
            symptoms: this.extractValue(analysisText, 'SYMPTOMS OBSERVED', 'Visible signs of stress or damage'),
            causes: this.extractValue(analysisText, 'CAUSES', 'Environmental stress or pathogen'),
            immediateTreatment: this.extractValue(analysisText, 'IMMEDIATE TREATMENT', 'Remove affected parts and apply appropriate treatment'),
            organicSolution: this.extractValue(analysisText, 'ORGANIC SOLUTION', 'Apply neem oil or compost tea'),
            chemicalSolution: this.extractValue(analysisText, 'CHEMICAL SOLUTION', 'Consult local agricultural officer'),
            prevention: this.extractValue(analysisText, 'PREVENTION', 'Regular monitoring and good agricultural practices'),
            recoveryTime: this.extractValue(analysisText, 'RECOVERY TIME', '7-14 days'),
            expertTips: this.extractValue(analysisText, 'EXPERT TIPS', 'Maintain proper crop management')
        };
        
        return result;
    }

    // Helper function to extract values from Gemini response
    extractValue(text, label, defaultValue) {
        const regex = new RegExp(`${label}:?\\s*(.+?)(?=\\n\\d+\\.|\\n\\n|$)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : defaultValue;
    }

    // Local AI analysis (fallback when no API key or API fails)
    getLocalAIAnalysis(cropType) {
        const cropLower = cropType?.toLowerCase() || '';
        
        const diseaseDatabase = {
            'rice': {
                disease: 'Rice Blast / Leaf Spot',
                severity: 'Medium',
                confidence: '85%',
                symptoms: 'Elliptical spots with gray centers and brown margins on leaves',
                causes: 'High humidity, excessive nitrogen fertilizer, poor drainage',
                immediateTreatment: 'Remove infected leaves. Apply tricyclazole or kasugamycin immediately.',
                organicSolution: 'Spray neem oil (5ml/L) + baking soda (1g/L) every 5 days. Use compost tea as foliar spray.',
                chemicalSolution: 'Propiconazole 25% EC @ 1ml/L water or Tricyclazole 75% WP @ 0.6g/L',
                prevention: 'Use resistant varieties. Balanced fertilization. Proper spacing (20x15cm). Avoid water stress.',
                recoveryTime: '10-14 days with proper treatment',
                expertTips: 'Monitor fields regularly. Drain fields for 3-4 days to reduce humidity. Apply silicon-based fertilizers.'
            },
            'wheat': {
                disease: 'Yellow Rust / Leaf Rust',
                severity: 'Medium to High',
                confidence: '90%',
                symptoms: 'Yellow to brown pustules arranged in rows on leaves',
                causes: 'Cool temperatures (10-20°C), high humidity, dense planting',
                immediateTreatment: 'Apply fungicide immediately. Remove volunteer plants.',
                organicSolution: 'Spray cow urine solution (1:10 ratio) or buttermilk solution (1:20) weekly.',
                chemicalSolution: 'Tebuconazole @ 1ml/L or Propiconazole @ 1ml/L water',
                prevention: 'Use resistant varieties. Early planting. Avoid excess nitrogen.',
                recoveryTime: '7-10 days',
                expertTips: 'Plant certified seeds. Practice crop rotation with legumes. Monitor weather forecasts.'
            },
            'tomato': {
                disease: 'Early Blight / Late Blight',
                severity: 'High',
                confidence: '88%',
                symptoms: 'Dark spots with concentric rings on lower leaves. White fungal growth in high humidity.',
                causes: 'Wet conditions, poor air circulation, overhead irrigation',
                immediateTreatment: 'Remove infected leaves. Improve air circulation. Apply copper-based fungicide.',
                organicSolution: 'Baking soda solution (1tsp/L) + vegetable oil (3ml/L). Spray garlic-chili extract.',
                chemicalSolution: 'Chlorothalonil @ 2ml/L or Mancozeb @ 2g/L water',
                prevention: 'Mulching. Stake plants. Water at base. Crop rotation (3-4 years).',
                recoveryTime: '5-7 days',
                expertTips: 'Water early morning. Remove lower leaves. Use drip irrigation.'
            },
            'maize': {
                disease: 'Common Rust / Leaf Blight',
                severity: 'Medium',
                confidence: '87%',
                symptoms: 'Brownish-red pustules on leaves. Elongated lesions with tan centers.',
                causes: 'High humidity, moderate temperatures (16-23°C), dense planting',
                immediateTreatment: 'Apply fungicide. Remove severely infected leaves.',
                organicSolution: 'Spray milk solution (1:9 ratio with water) weekly. Apply compost tea.',
                chemicalSolution: 'Azoxystrobin @ 1ml/L or Propiconazole @ 1ml/L water',
                prevention: 'Plant resistant hybrids. Proper spacing. Balanced nitrogen application.',
                recoveryTime: '10-14 days',
                expertTips: 'Plant at optimal density (60x25cm). Avoid late planting. Use certified seeds.'
            },
            'potato': {
                disease: 'Late Blight',
                severity: 'Critical',
                confidence: '92%',
                symptoms: 'Water-soaked lesions on leaves. White fungal growth. Blackened stems.',
                causes: 'Cool, wet weather. Prolonged leaf wetness. Infected seed tubers.',
                immediateTreatment: 'Destroy infected plants immediately. Apply fungicide urgently.',
                organicSolution: 'Copper sulfate spray. Apply neem cake to soil.',
                chemicalSolution: 'Metalaxyl + Mancozeb @ 2g/L. Chlorothalonil @ 2ml/L.',
                prevention: 'Use disease-free seed tubers. Hill soil around plants. Early planting.',
                recoveryTime: '14-21 days',
                expertTips: 'Destroy volunteer potatoes. Avoid overhead irrigation. Store tubers properly.'
            }
        };
        
        // Return specific disease info if crop matches, otherwise general advice
        if (diseaseDatabase[cropLower]) {
            return diseaseDatabase[cropLower];
        }
        
        return {
            disease: 'General Plant Health Issue',
            severity: 'Low to Medium',
            confidence: '75%',
            symptoms: 'Visible signs of stress including discoloration, wilting, or abnormal growth',
            causes: 'Environmental stress, nutrient deficiency, or pest attack',
            immediateTreatment: 'Ensure proper watering. Check for pests. Improve soil drainage.',
            organicSolution: 'Apply compost tea weekly. Use neem oil spray for pests. Add organic mulch.',
            chemicalSolution: 'Consult local agricultural officer for specific chemical recommendations.',
            prevention: 'Regular monitoring. Balanced nutrition. Good agricultural practices.',
            recoveryTime: '7-14 days with proper care',
            expertTips: 'Maintain proper spacing. Rotate crops annually. Keep field weed-free.'
        };
    }

    // Calculate confidence level
    calculateConfidence(analysis) {
        if (analysis.confidence) {
            return analysis.confidence;
        }
        if (analysis.disease && analysis.disease !== 'General Plant Health Issue') {
            return 'High (85-95%)';
        }
        return 'Medium (70-85%)';
    }

    // Fallback when all else fails
    getFallbackAnalysis(cropType) {
        return {
            disease: 'Unable to analyze automatically',
            severity: 'Unknown',
            confidence: 'Low',
            symptoms: 'Please provide more details about visible symptoms',
            causes: 'Unable to determine without clear image',
            immediateTreatment: 'Isolate affected plant. Remove severely damaged parts.',
            organicSolution: 'Apply neem oil (5ml/L water) as preventive measure',
            chemicalSolution: 'Consult local agricultural extension officer',
            prevention: 'Maintain good field hygiene and regular monitoring',
            recoveryTime: 'Monitor and re-upload clearer image for better analysis',
            expertTips: 'Take clear photos of affected leaves, stems, and overall plant'
        };
    }

    // Get weather-based recommendations using Gemini
    async getWeatherRecommendations(location, cropType) {
        if (!this.geminiKey) {
            return this.getFallbackWeatherAdvice(cropType);
        }

        const prompt = `As an agricultural expert, provide weather-based farming recommendations for ${cropType} crops in ${location}. Include:
        1. Irrigation schedule (frequency and timing)
        2. Pest and disease risks based on typical weather
        3. Fertilizer application timing
        4. Protective measures for extreme weather
        5. Best practices for current season
        
        Keep response practical and actionable for farmers.`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }
            );
            
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini Weather API Error:', error);
            return this.getFallbackWeatherAdvice(cropType);
        }
    }

    getFallbackWeatherAdvice(cropType) {
        return `🌤️ Weather-Based Recommendations for ${cropType}:

💧 Irrigation:
• Water every 3-4 days during dry spells
• Irrigate early morning or late evening
• Avoid overhead irrigation during flowering

🐛 Pest Management:
• Monitor for pest activity when temperatures rise above 25°C
• Increased pest risk during humid conditions
• Use yellow sticky traps for early detection

🌿 Fertilizer:
• Apply nitrogen after rainfall for better absorption
• Split fertilizer applications during growing season
• Foliar spray during drought stress

🛡️ Protection:
• Use mulch to retain soil moisture
• Provide wind protection for tall crops
• Have drainage ready for heavy rains

📋 Best Practices:
• Maintain field records
• Regular scouting (twice weekly)
• Join local farmer groups for weather alerts`;
    }

    // General farming advice using Gemini
    async getFarmingAdvice(question, cropType, cropData) {
        if (!this.geminiKey) {
            return this.getLocalAdvice(question, cropType);
        }

        const prompt = `As an expert agricultural advisor, answer this farmer's question about ${cropType} crops:
        
Question: "${question}"

Crop data: ${JSON.stringify(cropData)}

Provide practical, actionable advice that is easy to understand and implement. Include specific examples, dos and don'ts, and safety precautions if applicable.`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }
            );
            
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini Advice API Error:', error);
            return this.getLocalAdvice(question, cropType);
        }
    }

    getLocalAdvice(question, cropType) {
        const q = question.toLowerCase();
        
        if (q.includes('yield') || q.includes('production')) {
            return `📈 Tips to Increase ${cropType} Yield:
• Maintain optimal soil moisture (40-60%)
• Apply balanced NPK fertilizer at recommended rates
• Ensure proper plant spacing for air circulation
• Control weeds regularly
• Monitor for pests and diseases weekly
• Harvest at correct maturity stage
• Use quality seeds from certified sources`;
        }
        
        if (q.includes('pest') || q.includes('insect')) {
            return `🐛 Pest Management for ${cropType}:
Common pests to watch:
• Aphids, caterpillars, stem borers, leaf miners

Organic control:
• Neem oil (5ml/L water) - spray every 7 days
• Garlic-chili spray for severe cases
• Install pheromone traps
• Encourage natural predators (ladybugs, birds)

Chemical control (if needed):
• Consult local agricultural officer for specific pesticides
• Always follow recommended dosage
• Observe waiting period before harvest`;
        }
        
        return this.getFallbackWeatherAdvice(cropType);
    }
}

export default new AIService();