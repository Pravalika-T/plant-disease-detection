package com.plantdisease.dto;

import com.plantdisease.entity.Treatment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResponse {
    private Long predictionId;
    private String plantName;
    private String diseaseName;
    private Double confidence;
    private Boolean isHealthy;
    private String symptoms;
    private String causes;
    private Treatment treatment;
    private String imagePath;
    private LocalDateTime predictionDate;
}
