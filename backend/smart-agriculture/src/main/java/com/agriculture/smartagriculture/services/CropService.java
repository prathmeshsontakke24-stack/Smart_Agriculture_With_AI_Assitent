package com.agriculture.smartagriculture.services;

import com.agriculture.smartagriculture.models.*;
import com.agriculture.smartagriculture.repositories.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    // Get all crops
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    // Get crop by ID
    public Optional<Crop> getCropById(String id) {
        return cropRepository.findById(id);
    }

    // Create new crop with enhanced information
    public Crop createCrop(Crop crop) {
        crop.setPlantingDate(LocalDateTime.now());
        crop.setGrowthStage("SEEDLING");
        crop.setGrowthProgress(5);
        crop.setSensorData(new ArrayList<>());
        crop.setRecommendations(new ArrayList<>());
        crop.setDiseases(new ArrayList<>());
        crop.setSchedules(new ArrayList<>());
        crop.setExpertTips(generateExpertTips(crop));

        // Generate initial schedule
        generateFarmingSchedule(crop);

        // Generate initial recommendations
        generateInitialRecommendations(crop);

        return cropRepository.save(crop);
    }

    // Generate expert tips based on crop type
    private List<String> generateExpertTips(Crop crop) {
        List<String> tips = new ArrayList<>();

        tips.add("🌱 Start with soil testing to understand nutrient deficiencies");
        tips.add("💧 Water early morning or late evening to reduce evaporation");
        tips.add("🌿 Practice crop rotation to maintain soil health");
        tips.add("🐞 Use organic pesticides first before chemical options");

        if (crop.getType().equalsIgnoreCase("rice")) {
            tips.add("🌾 Maintain 5cm water level during vegetative stage");
            tips.add("📊 Apply nitrogen in split doses for better yield");
        } else if (crop.getType().equalsIgnoreCase("wheat")) {
            tips.add("🌾 Ensure proper drainage to prevent root diseases");
            tips.add("📅 Timely irrigation during grain filling stage");
        } else if (crop.getType().equalsIgnoreCase("maize")) {
            tips.add("🌽 Plant at optimal density for maximum yield");
            tips.add("💪 Apply phosphorus at planting time");
        }

        return tips;
    }

    // Generate farming schedule
    private void generateFarmingSchedule(Crop crop) {
        List<FarmingSchedule> schedules = new ArrayList<>();
        LocalDate plantingDate = crop.getPlantingDate().toLocalDate();

        // Weeding schedule (15 days after planting)
        FarmingSchedule weeding = new FarmingSchedule();
        weeding.setId(UUID.randomUUID().toString());
        weeding.setCropId(crop.getId());
        weeding.setActivityType("WEEDING");
        weeding.setTitle("First Weeding");
        weeding.setDescription("Remove weeds to reduce competition for nutrients");
        weeding.setScheduledDate(plantingDate.plusDays(15));
        weeding.setIsCompleted(false);
        weeding.setRequiredResources(Arrays.asList("Hoe", "Gloves"));
        weeding.setPriority(4);
        schedules.add(weeding);

        // First fertilization (30 days after planting)
        FarmingSchedule fertilizing = new FarmingSchedule();
        fertilizing.setId(UUID.randomUUID().toString());
        fertilizing.setCropId(crop.getId());
        fertilizing.setActivityType("FERTILIZING");
        fertilizing.setTitle("First Fertilizer Application");
        fertilizing.setDescription("Apply nitrogen-rich fertilizer for vegetative growth");
        fertilizing.setScheduledDate(plantingDate.plusDays(30));
        fertilizing.setIsCompleted(false);
        fertilizing.setRequiredResources(Arrays.asList("Urea", "Spreader"));
        fertilizing.setPriority(5);
        schedules.add(fertilizing);

        // Pest control (45 days after planting)
        FarmingSchedule pestControl = new FarmingSchedule();
        pestControl.setId(UUID.randomUUID().toString());
        pestControl.setCropId(crop.getId());
        pestControl.setActivityType("PEST_CONTROL");
        pestControl.setTitle("Pest Control Spray");
        pestControl.setDescription("Apply recommended pesticides to prevent infestation");
        pestControl.setScheduledDate(plantingDate.plusDays(45));
        pestControl.setIsCompleted(false);
        pestControl.setRequiredResources(Arrays.asList("Sprayer", "Pesticide", "Mask"));
        pestControl.setPriority(5);
        schedules.add(pestControl);

        crop.setSchedules(schedules);
    }

    // Generate initial recommendations
    private void generateInitialRecommendations(Crop crop) {
        List<Recommendation> recommendations = new ArrayList<>();

        // Soil preparation recommendation
        Recommendation soilPrep = new Recommendation();
        soilPrep.setId(UUID.randomUUID().toString());
        soilPrep.setTitle("🌱 Soil Preparation Guide");
        soilPrep.setDescription("For " + crop.getSoilType() + " soil, add organic compost and ensure proper drainage. Test pH levels and adjust if needed.");
        soilPrep.setType("soil_management");
        soilPrep.setDate(LocalDateTime.now());
        soilPrep.setIsImplemented(false);
        soilPrep.setConfidenceScore(0.95);
        recommendations.add(soilPrep);

        // Irrigation schedule
        Recommendation irrigation = new Recommendation();
        irrigation.setId(UUID.randomUUID().toString());
        irrigation.setTitle("💧 Optimal Irrigation Schedule");
        irrigation.setDescription(crop.getType() + " requires consistent moisture. Water every 3-4 days during germination, then adjust based on rainfall.");
        irrigation.setType("irrigation");
        irrigation.setDate(LocalDateTime.now());
        irrigation.setIsImplemented(false);
        irrigation.setConfidenceScore(0.90);
        recommendations.add(irrigation);

        crop.setRecommendations(recommendations);
    }

    // Update growth stage based on days since planting
    private void updateGrowthStage(Crop crop) {
        long daysSincePlanting = ChronoUnit.DAYS.between(crop.getPlantingDate(), LocalDateTime.now());

        if (daysSincePlanting < 15) {
            crop.setGrowthStage("SEEDLING");
            crop.setGrowthProgress(10);
        } else if (daysSincePlanting < 45) {
            crop.setGrowthStage("VEGETATIVE");
            crop.setGrowthProgress(30);
        } else if (daysSincePlanting < 75) {
            crop.setGrowthStage("FLOWERING");
            crop.setGrowthProgress(60);
        } else if (daysSincePlanting < 105) {
            crop.setGrowthStage("FRUITING");
            crop.setGrowthProgress(85);
        } else {
            crop.setGrowthStage("MATURITY");
            crop.setGrowthProgress(95);
        }
    }

    // Add sensor data with advanced AI analysis
    public Crop addSensorData(String cropId, SensorData sensorData) {
        Crop crop = cropRepository.findById(cropId).orElseThrow();
        sensorData.setTimestamp(LocalDateTime.now());
        crop.getSensorData().add(sensorData);

        // Update growth stage
        updateGrowthStage(crop);

        // Comprehensive AI Analysis
        performAIAnalysis(crop, sensorData);

        // Predict yield
        predictYield(crop);

        // Check for diseases based on conditions
        checkForDiseases(crop, sensorData);

        // Update schedule recommendations
        updateScheduleBasedOnConditions(crop, sensorData);

        return cropRepository.save(crop);
    }

    // Advanced AI Analysis
    private void performAIAnalysis(Crop crop, SensorData sensorData) {
        List<Recommendation> newRecommendations = new ArrayList<>();

        // Temperature analysis
        if (sensorData.getTemperature() != null) {
            if (sensorData.getTemperature() < 10) {
                addRecommendation(newRecommendations, "❄️ Low Temperature Alert",
                        "Temperature is " + sensorData.getTemperature() + "°C. Protect crops from frost using mulch or covers.",
                        "weather_protection", 0.85);
            } else if (sensorData.getTemperature() > 35) {
                addRecommendation(newRecommendations, "🔥 Heat Stress Warning",
                        "High temperature (" + sensorData.getTemperature() + "°C) detected. Increase irrigation frequency and provide shade if possible.",
                        "irrigation", 0.90);
            }
        }

        // Soil moisture analysis
        if (sensorData.getSoilMoisture() != null) {
            if (sensorData.getSoilMoisture() < 25) {
                addRecommendation(newRecommendations, "💧 Severe Water Deficiency",
                        "Soil moisture critically low at " + sensorData.getSoilMoisture() + "%. Immediate irrigation required for " + crop.getName(),
                        "irrigation", 0.95);
            } else if (sensorData.getSoilMoisture() < 40) {
                addRecommendation(newRecommendations, "⚠️ Low Soil Moisture",
                        "Soil moisture at " + sensorData.getSoilMoisture() + "%. Schedule irrigation within 24 hours.",
                        "irrigation", 0.85);
            } else if (sensorData.getSoilMoisture() > 75) {
                addRecommendation(newRecommendations, "💦 Excess Water Detected",
                        "Soil moisture high at " + sensorData.getSoilMoisture() + "%. Ensure proper drainage to prevent root rot.",
                        "drainage", 0.80);
            }
        }

        // pH analysis
        if (sensorData.getPhLevel() != null) {
            if (sensorData.getPhLevel() < 5.5) {
                addRecommendation(newRecommendations, "🧪 Acidic Soil Detected",
                        "pH level " + sensorData.getPhLevel() + " is too acidic. Apply lime to raise pH to optimal range (6.0-7.0).",
                        "soil_amendment", 0.90);
            } else if (sensorData.getPhLevel() > 7.5) {
                addRecommendation(newRecommendations, "🧪 Alkaline Soil Detected",
                        "pH level " + sensorData.getPhLevel() + " is too alkaline. Add sulfur or organic matter to lower pH.",
                        "soil_amendment", 0.90);
            } else if (sensorData.getPhLevel() >= 6.0 && sensorData.getPhLevel() <= 7.0) {
                addRecommendation(newRecommendations, "✅ Optimal pH Level",
                        "pH level " + sensorData.getPhLevel() + " is perfect for " + crop.getName() + ". Maintain current soil management.",
                        "soil_health", 0.98);
            }
        }

        // Humidity analysis
        if (sensorData.getHumidity() != null && sensorData.getHumidity() > 80) {
            addRecommendation(newRecommendations, "🌫️ High Humidity Risk",
                    "High humidity (" + sensorData.getHumidity() + "%) increases fungal disease risk. Ensure good air circulation.",
                    "disease_prevention", 0.85);
        }

        // Add crop-specific recommendations based on growth stage
        addCropSpecificRecommendations(crop, newRecommendations);

        // Add new recommendations to crop
        crop.getRecommendations().addAll(0, newRecommendations);

        // Keep only last 50 recommendations
        if (crop.getRecommendations().size() > 50) {
            crop.setRecommendations(crop.getRecommendations().subList(0, 50));
        }
    }

    private void addRecommendation(List<Recommendation> list, String title, String description, String type, double confidence) {
        Recommendation rec = new Recommendation();
        rec.setId(UUID.randomUUID().toString());
        rec.setTitle(title);
        rec.setDescription(description);
        rec.setType(type);
        rec.setDate(LocalDateTime.now());
        rec.setIsImplemented(false);
        rec.setConfidenceScore(confidence);
        list.add(rec);
    }

    private void addCropSpecificRecommendations(Crop crop, List<Recommendation> recommendations) {
        // Crop-specific recommendations based on growth stage
        if (crop.getGrowthStage().equals("FLOWERING")) {
            addRecommendation(recommendations, "🌸 Flowering Stage Care",
                    crop.getName() + " is flowering. Ensure adequate water and avoid nitrogen-heavy fertilizers.",
                    "growth_management", 0.92);
        } else if (crop.getGrowthStage().equals("FRUITING")) {
            addRecommendation(recommendations, "🍎 Fruiting Stage Nutrition",
                    "Apply potassium-rich fertilizer for better fruit development in " + crop.getName(),
                    "fertilization", 0.94);
        }
    }

    // Yield prediction based on historical data and current conditions
    private void predictYield(Crop crop) {
        Map<String, Object> prediction = new HashMap<>();

        double baseYield = getBaseYieldForCrop(crop.getType());
        double healthFactor = calculateCropHealthFactor(crop);
        double weatherFactor = calculateWeatherFactor(crop);
        double managementFactor = calculateManagementFactor(crop);

        double predictedYield = baseYield * healthFactor * weatherFactor * managementFactor;
        String quality = getQualityGrade(healthFactor);

        prediction.put("predictedYield", String.format("%.2f", predictedYield) + " tons/hectare");
        prediction.put("baseYield", baseYield + " tons/hectare");
        prediction.put("confidence", String.format("%.0f%%", healthFactor * 100));
        prediction.put("quality", quality);
        prediction.put("recommendations", getYieldImprovementTips(crop));

        crop.setYieldPrediction(prediction);
    }

    private double getBaseYieldForCrop(String cropType) {
        Map<String, Double> yields = new HashMap<>();
        yields.put("rice", 4.5);
        yields.put("wheat", 3.2);
        yields.put("maize", 5.5);
        yields.put("soybean", 2.8);
        yields.put("potato", 20.0);
        yields.put("tomato", 40.0);
        return yields.getOrDefault(cropType.toLowerCase(), 3.0);
    }

    private double calculateCropHealthFactor(Crop crop) {
        double factor = 1.0;

        if (crop.getDiseases() != null && !crop.getDiseases().isEmpty()) {
            factor -= crop.getDiseases().size() * 0.1;
        }

        if (crop.getSensorData() != null && !crop.getSensorData().isEmpty()) {
            SensorData latest = crop.getSensorData().get(crop.getSensorData().size() - 1);
            if (latest.getSoilMoisture() != null) {
                if (latest.getSoilMoisture() < 30 || latest.getSoilMoisture() > 70) factor -= 0.1;
            }
            if (latest.getPhLevel() != null && (latest.getPhLevel() < 5.5 || latest.getPhLevel() > 7.5)) factor -= 0.15;
        }

        return Math.max(0.5, Math.min(1.0, factor));
    }

    private double calculateWeatherFactor(Crop crop) {
        // Simplified weather factor calculation
        return 0.85;
    }

    private double calculateManagementFactor(Crop crop) {
        double factor = 1.0;

        // Check if recommendations are being implemented
        if (crop.getRecommendations() != null && !crop.getRecommendations().isEmpty()) {
            long implementedCount = crop.getRecommendations().stream()
                    .filter(r -> r.getIsImplemented() != null && r.getIsImplemented())
                    .count();
            factor += (implementedCount * 0.05);
        }

        return Math.min(1.2, factor);
    }

    private String getQualityGrade(double healthFactor) {
        if (healthFactor >= 0.9) return "Excellent ⭐⭐⭐⭐⭐";
        if (healthFactor >= 0.8) return "Good ⭐⭐⭐⭐";
        if (healthFactor >= 0.7) return "Average ⭐⭐⭐";
        if (healthFactor >= 0.6) return "Fair ⭐⭐";
        return "Poor ⭐";
    }

    private List<String> getYieldImprovementTips(Crop crop) {
        List<String> tips = new ArrayList<>();

        if (crop.getYieldPrediction() != null && crop.getYieldPrediction().containsKey("confidence")) {
            String confidence = crop.getYieldPrediction().get("confidence").toString();
            if (confidence.contains("%") && Integer.parseInt(confidence.replace("%", "")) < 80) {
                tips.add("📊 Improve soil health with organic matter");
                tips.add("💧 Optimize irrigation schedule based on crop needs");
                tips.add("🌿 Implement integrated pest management");
                tips.add("🧪 Regular soil testing and nutrient management");
            }
        }

        return tips;
    }

    // Disease detection based on sensor data
    private void checkForDiseases(Crop crop, SensorData sensorData) {
        List<PlantDisease> newDiseases = new ArrayList<>();

        // High humidity + high temperature = fungal disease risk
        if (sensorData.getHumidity() != null && sensorData.getTemperature() != null) {
            if (sensorData.getHumidity() > 85 && sensorData.getTemperature() > 25) {
                PlantDisease fungal = new PlantDisease();
                fungal.setId(UUID.randomUUID().toString());
                fungal.setName("Powdery Mildew");
                fungal.setScientificName("Erysiphe graminis");
                fungal.setSeverity("MEDIUM");
                fungal.setDetectionDate(LocalDateTime.now());
                fungal.setSymptoms(Arrays.asList(
                        "White powdery spots on leaves",
                        "Yellowing of leaves",
                        "Stunted growth"
                ));
                fungal.setCauses(Arrays.asList(
                        "High humidity",
                        "Poor air circulation",
                        "Overcrowding"
                ));

                Treatment treatment = new Treatment();
                treatment.setId(UUID.randomUUID().toString());
                treatment.setName("Sulfur-based Fungicide");
                treatment.setType("CHEMICAL");
                treatment.setApplicationMethod("Spray on affected areas");
                treatment.setDosage("2g per liter of water");
                treatment.setFrequency("Every 7-10 days");
                treatment.setInstructions(Arrays.asList(
                        "Spray in early morning",
                        "Cover both sides of leaves",
                        "Repeat after rain"
                ));
                treatment.setDuration(14);

                fungal.setTreatments(Arrays.asList(treatment));
                fungal.setIsActive(true);
                fungal.setAffectedArea("10-20%");

                newDiseases.add(fungal);

                // Add disease alert recommendation
                addRecommendation(crop.getRecommendations(), "⚠️ Disease Alert: Powdery Mildew Detected",
                        "Fungal disease detected due to high humidity. Apply fungicide immediately and improve air circulation.",
                        "disease_control", 0.88);
            }
        }

        // Wet soil + poor drainage = root rot risk
        if (sensorData.getSoilMoisture() != null && sensorData.getSoilMoisture() > 75) {
            PlantDisease rootRot = new PlantDisease();
            rootRot.setId(UUID.randomUUID().toString());
            rootRot.setName("Root Rot");
            rootRot.setSeverity("HIGH");
            rootRot.setDetectionDate(LocalDateTime.now());
            rootRot.setSymptoms(Arrays.asList(
                    "Wilting despite wet soil",
                    "Yellow lower leaves",
                    "Brown/black roots"
            ));
            rootRot.setCauses(Arrays.asList(
                    "Overwatering",
                    "Poor drainage",
                    "Fungal pathogens"
            ));

            Treatment treatment = new Treatment();
            treatment.setId(UUID.randomUUID().toString());
            treatment.setName("Improve Drainage");
            treatment.setType("CULTURAL");
            treatment.setApplicationMethod("Reduce irrigation and add organic matter");
            treatment.setInstructions(Arrays.asList(
                    "Stop watering immediately",
                    "Improve soil drainage",
                    "Apply fungicide if severe"
            ));

            rootRot.setTreatments(Arrays.asList(treatment));
            rootRot.setIsActive(true);

            newDiseases.add(rootRot);
        }

        // Add new diseases to crop
        if (!newDiseases.isEmpty()) {
            if (crop.getDiseases() == null) {
                crop.setDiseases(new ArrayList<>());
            }
            crop.getDiseases().addAll(newDiseases);
        }
    }

    // Update schedule based on current conditions
    private void updateScheduleBasedOnConditions(Crop crop, SensorData sensorData) {
        if (crop.getSchedules() != null) {
            for (FarmingSchedule schedule : crop.getSchedules()) {
                if (!schedule.getIsCompleted()) {
                    // Adjust priority based on conditions
                    if (schedule.getActivityType().equals("IRRIGATION") &&
                            sensorData.getSoilMoisture() != null &&
                            sensorData.getSoilMoisture() < 30) {
                        schedule.setPriority(5);
                    }
                }
            }
        }
    }

    // Get detailed farming guide
    public Map<String, Object> getFarmingGuide(String cropType) {
        Map<String, Object> guide = new HashMap<>();

        switch(cropType.toLowerCase()) {
            case "rice":
                guide.put("soilRequirement", "Clay loam or silty loam with pH 5.5-6.5");
                guide.put("temperature", "20-35°C");
                guide.put("waterRequirement", "5-10 cm standing water during growth");
                guide.put("fertilizerSchedule", "Nitrogen: 120kg/ha, Phosphorus: 60kg/ha, Potassium: 60kg/ha");
                guide.put("pestManagement", "Watch for stem borer, leaf folder, and blast disease");
                guide.put("harvestingTime", "120-150 days after planting");
                break;
            case "wheat":
                guide.put("soilRequirement", "Well-drained loamy soil with pH 6.0-7.5");
                guide.put("temperature", "15-25°C");
                guide.put("waterRequirement", "4-5 irrigations throughout growth");
                guide.put("fertilizerSchedule", "Nitrogen: 120kg/ha, Phosphorus: 60kg/ha");
                guide.put("pestManagement", "Watch for aphids, rust, and smut");
                guide.put("harvestingTime", "110-130 days after planting");
                break;
            case "maize":
                guide.put("soilRequirement", "Deep, well-drained loamy soil with pH 6.0-7.0");
                guide.put("temperature", "18-32°C");
                guide.put("waterRequirement", "500-800mm total water requirement");
                guide.put("fertilizerSchedule", "Nitrogen: 150kg/ha, Phosphorus: 75kg/ha, Potassium: 75kg/ha");
                guide.put("pestManagement", "Watch for stem borer, armyworm, and fall armyworm");
                guide.put("harvestingTime", "90-120 days after planting");
                break;
            default:
                guide.put("soilRequirement", "Well-drained fertile soil");
                guide.put("temperature", "15-30°C");
                guide.put("waterRequirement", "Regular irrigation based on soil moisture");
                guide.put("fertilizerSchedule", "Balanced NPK fertilization based on soil test");
                guide.put("pestManagement", "Regular monitoring and integrated pest management");
                guide.put("harvestingTime", "Varies by crop type");
        }

        return guide;
    }

    // Update crop
    public Crop updateCrop(String id, Crop cropDetails) {
        Crop crop = cropRepository.findById(id).orElseThrow();
        crop.setName(cropDetails.getName());
        crop.setType(cropDetails.getType());
        crop.setVariety(cropDetails.getVariety());
        crop.setArea(cropDetails.getArea());
        crop.setSoilType(cropDetails.getSoilType());
        crop.setNotes(cropDetails.getNotes());
        return cropRepository.save(crop);
    }

    // Delete crop
    public void deleteCrop(String id) {
        cropRepository.deleteById(id);
    }

    // Complete a farming task
    public FarmingSchedule completeTask(String cropId, String scheduleId) {
        Crop crop = cropRepository.findById(cropId).orElseThrow();
        for (FarmingSchedule schedule : crop.getSchedules()) {
            if (schedule.getId().equals(scheduleId)) {
                schedule.setIsCompleted(true);
                schedule.setCompletedDate(LocalDate.now());
                cropRepository.save(crop);
                return schedule;
            }
        }
        return null;
    }

    // Get all recommendations
    public List<Recommendation> getRecommendations(String cropId) {
        Crop crop = cropRepository.findById(cropId).orElseThrow();
        return crop.getRecommendations();
    }

    // Mark recommendation as implemented
    public Recommendation implementRecommendation(String cropId, String recommendationId) {
        Crop crop = cropRepository.findById(cropId).orElseThrow();
        for (Recommendation rec : crop.getRecommendations()) {
            if (rec.getId().equals(recommendationId)) {
                rec.setIsImplemented(true);
                cropRepository.save(crop);
                return rec;
            }
        }
        return null;
    }

    // Add custom note
    public Crop addNote(String cropId, String note) {
        Crop crop = cropRepository.findById(cropId).orElseThrow();
        crop.setNotes(note);
        return cropRepository.save(crop);
    }
}