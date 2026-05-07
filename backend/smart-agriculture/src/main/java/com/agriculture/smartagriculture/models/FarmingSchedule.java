package com.agriculture.smartagriculture.models;

import java.time.LocalDate;
import java.util.List;

public class FarmingSchedule {
    private String id;
    private String cropId;
    private String activityType; // PLANTING, IRRIGATION, FERTILIZING, PEST_CONTROL, WEEDING, HARVESTING
    private String title;
    private String description;
    private LocalDate scheduledDate;
    private LocalDate completedDate;
    private Boolean isCompleted;
    private List<String> requiredResources;
    private String weatherDependency;
    private Integer priority; // 1-5, 5 being highest

    // Constructors
    public FarmingSchedule() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCropId() { return cropId; }
    public void setCropId(String cropId) { this.cropId = cropId; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public List<String> getRequiredResources() { return requiredResources; }
    public void setRequiredResources(List<String> requiredResources) { this.requiredResources = requiredResources; }

    public String getWeatherDependency() { return weatherDependency; }
    public void setWeatherDependency(String weatherDependency) { this.weatherDependency = weatherDependency; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
}
