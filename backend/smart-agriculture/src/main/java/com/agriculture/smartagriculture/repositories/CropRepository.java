package com.agriculture.smartagriculture.repositories;

import com.agriculture.smartagriculture.models.Crop;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CropRepository extends MongoRepository<Crop, String> {
    List<Crop> findByType(String type);
    List<Crop> findBySoilType(String soilType);
}