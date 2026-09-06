package com.plantdisease.repository;

import com.plantdisease.entity.PlantCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlantCategoryRepository extends JpaRepository<PlantCategory, Long> {
    Optional<PlantCategory> findByPlantNameIgnoreCase(String plantName);
}
