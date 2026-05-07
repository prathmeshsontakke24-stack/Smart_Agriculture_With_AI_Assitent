package com.agriculture.smartagriculture.controllers;

import com.agriculture.smartagriculture.models.*;
import com.agriculture.smartagriculture.services.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "http://localhost:3000")
public class CropController {

    @Autowired
    private CropService cropService;

    @GetMapping
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropService.getAllCrops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Crop> getCropById(@PathVariable String id) {
        return cropService.getCropById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Crop> createCrop(@RequestBody Crop crop) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropService.createCrop(crop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Crop> updateCrop(@PathVariable String id, @RequestBody Crop crop) {
        return ResponseEntity.ok(cropService.updateCrop(id, crop));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable String id) {
        cropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/sensors")
    public ResponseEntity<Crop> addSensorData(@PathVariable String id, @RequestBody SensorData sensorData) {
        return ResponseEntity.ok(cropService.addSensorData(id, sensorData));
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Recommendation>> getRecommendations(@PathVariable String id) {
        return ResponseEntity.ok(cropService.getRecommendations(id));
    }

    @PutMapping("/{cropId}/recommendations/{recommendationId}/implement")
    public ResponseEntity<Recommendation> implementRecommendation(
            @PathVariable String cropId,
            @PathVariable String recommendationId) {
        Recommendation rec = cropService.implementRecommendation(cropId, recommendationId);
        return ResponseEntity.ok(rec);
    }

    @GetMapping("/guide/{cropType}")
    public ResponseEntity<Map<String, Object>> getFarmingGuide(@PathVariable String cropType) {
        return ResponseEntity.ok(cropService.getFarmingGuide(cropType));
    }

    @PutMapping("/{cropId}/tasks/{scheduleId}/complete")
    public ResponseEntity<FarmingSchedule> completeTask(
            @PathVariable String cropId,
            @PathVariable String scheduleId) {
        FarmingSchedule schedule = cropService.completeTask(cropId, scheduleId);
        return ResponseEntity.ok(schedule);
    }

    @PostMapping("/{cropId}/notes")
    public ResponseEntity<Crop> addNote(@PathVariable String cropId, @RequestBody Map<String, String> noteData) {
        Crop crop = cropService.addNote(cropId, noteData.get("note"));
        return ResponseEntity.ok(crop);
    }
}