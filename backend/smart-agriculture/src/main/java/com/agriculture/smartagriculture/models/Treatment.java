package com.agriculture.smartagriculture.models;

import java.util.List;

public class Treatment {
    private String id;
    private String name;
    private String type; // CHEMICAL, ORGANIC, CULTURAL, BIOLOGICAL
    private String applicationMethod;
    private String dosage;
    private String frequency;
    private List<String> precautions;
    private List<String> instructions;
    private String effectiveness;
    private Integer duration; // in days

    // Constructors
    public Treatment() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getApplicationMethod() { return applicationMethod; }
    public void setApplicationMethod(String applicationMethod) { this.applicationMethod = applicationMethod; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public List<String> getPrecautions() { return precautions; }
    public void setPrecautions(List<String> precautions) { this.precautions = precautions; }

    public List<String> getInstructions() { return instructions; }
    public void setInstructions(List<String> instructions) { this.instructions = instructions; }

    public String getEffectiveness() { return effectiveness; }
    public void setEffectiveness(String effectiveness) { this.effectiveness = effectiveness; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
}