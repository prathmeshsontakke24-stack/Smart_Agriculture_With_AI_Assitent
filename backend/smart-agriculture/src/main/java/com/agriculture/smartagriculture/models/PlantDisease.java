package com.agriculture.smartagriculture.models;

import java.time.LocalDateTime;
import java.util.List;

public class PlantDisease {
    private String id;
    private String name;
    private String scientificName;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private LocalDateTime detectionDate;
    private List<String> symptoms;
    private List<String> causes;
    private List<Treatment> treatments;
    private Boolean isActive;
    private String affectedArea; // percentage
    private String images; // base64 or URL

    // Constructors
    public PlantDisease() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getDetectionDate() { return detectionDate; }
    public void setDetectionDate(LocalDateTime detectionDate) { this.detectionDate = detectionDate; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<String> getCauses() { return causes; }
    public void setCauses(List<String> causes) { this.causes = causes; }

    public List<Treatment> getTreatments() { return treatments; }
    public void setTreatments(List<Treatment> treatments) { this.treatments = treatments; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getAffectedArea() { return affectedArea; }
    public void setAffectedArea(String affectedArea) { this.affectedArea = affectedArea; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
}