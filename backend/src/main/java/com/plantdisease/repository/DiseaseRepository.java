package com.plantdisease.repository;

import com.plantdisease.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    
    Optional<Disease> findByDiseaseNameIgnoreCase(String diseaseName);

    @Query("SELECT d FROM Disease d WHERE LOWER(d.diseaseName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.plantCategory.plantName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Disease> searchByQuery(@Param("query") String query);

    List<Disease> findByPlantCategoryId(Long plantCategoryId);
}
