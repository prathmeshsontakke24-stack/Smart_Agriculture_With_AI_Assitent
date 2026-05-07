package com.agriculture.smartagriculture.models;

import java.time.LocalDateTime;

public class SensorData {
    private LocalDateTime timestamp;
    private Double temperature; // Celsius
    private Double humidity; // Percentage
    private Double soilMoisture; // Percentage
    private Double rainfall; // mm
    private Double phLevel;

    // Constructors
    public SensorData() {}

    // Getters and Setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Double getSoilMoisture() { return soilMoisture; }
    public void setSoilMoisture(Double soilMoisture) { this.soilMoisture = soilMoisture; }

    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }

    public Double getPhLevel() { return phLevel; }
    public void setPhLevel(Double phLevel) { this.phLevel = phLevel; }
}