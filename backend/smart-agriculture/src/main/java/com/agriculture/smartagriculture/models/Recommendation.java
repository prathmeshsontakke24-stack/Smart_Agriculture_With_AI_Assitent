package com.agriculture.smartagriculture.models;

import java.time.LocalDateTime;

public class Recommendation {
    private String id;
    private String title;
    private String description;
    private String type; // "irrigation", "fertilizer", "pest_control", "harvesting"
    private LocalDateTime date;
    private Boolean isImplemented;
    private Double confidenceScore; // AI confidence (0-1)

    // Constructors
    public Recommendation() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public Boolean getIsImplemented() { return isImplemented; }
    public void setIsImplemented(Boolean isImplemented) { this.isImplemented = isImplemented; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}