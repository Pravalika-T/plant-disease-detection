package com.plantdisease.repository;

import com.plantdisease.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserIdOrderByPredictionDateDesc(Long userId);
    
    long countByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.user.id = :userId AND p.disease.isHealthy = true")
    long countHealthyByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.user.id = :userId AND p.disease.isHealthy = false")
    long countDiseasedByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.disease.isHealthy = true")
    long countAllHealthy();

    @Query("SELECT COUNT(p) FROM Prediction p WHERE p.disease.isHealthy = false")
    long countAllDiseased();

    List<Prediction> findAllByOrderByPredictionDateDesc();
}
