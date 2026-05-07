package com.agriculture.smartagriculture.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "crops")
public class Crop {
    @Id
    private String id;
    private String name;
    private String type;
    private String variety;
    private LocalDateTime plantingDate;
    private LocalDateTime expectedHarvestDate;
    private Double area;
    private String soilType;
    private String growthStage; // SEEDLING, VEGETATIVE, FLOWERING, FRUITING, MATURITY
    private Integer growthProgress; // 0-100%
    private List<SensorData> sensorData;
    private List<Recommendation> recommendations;
    private List<PlantDisease> diseases;
    private List<FarmingSchedule> schedules;
    private Map<String, Object> weatherData;
    private Map<String, Object> yieldPrediction;
    private List<String> expertTips;
    private String notes;

    // Constructors
    public Crop() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }

    public LocalDateTime getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDateTime plantingDate) { this.plantingDate = plantingDate; }

    public LocalDateTime getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDateTime expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }

    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public String getGrowthStage() { return growthStage; }
    public void setGrowthStage(String growthStage) { this.growthStage = growthStage; }

    public Integer getGrowthProgress() { return growthProgress; }
    public void setGrowthProgress(Integer growthProgress) { this.growthProgress = growthProgress; }

    public List<SensorData> getSensorData() { return sensorData; }
    public void setSensorData(List<SensorData> sensorData) { this.sensorData = sensorData; }

    public List<Recommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Recommendation> recommendations) { this.recommendations = recommendations; }

    public List<PlantDisease> getDiseases() { return diseases; }
    public void setDiseases(List<PlantDisease> diseases) { this.diseases = diseases; }

    public List<FarmingSchedule> getSchedules() { return schedules; }
    public void setSchedules(List<FarmingSchedule> schedules) { this.schedules = schedules; }

    public Map<String, Object> getWeatherData() { return weatherData; }
    public void setWeatherData(Map<String, Object> weatherData) { this.weatherData = weatherData; }

    public Map<String, Object> getYieldPrediction() { return yieldPrediction; }
    public void setYieldPrediction(Map<String, Object> yieldPrediction) { this.yieldPrediction = yieldPrediction; }

    public List<String> getExpertTips() { return expertTips; }
    public void setExpertTips(List<String> expertTips) { this.expertTips = expertTips; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}