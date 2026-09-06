package com.plantdisease.dto;

import com.plantdisease.entity.Treatment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiseaseDTO {
    private Long id;
    private String plantName;
    private String diseaseName;
    private String symptoms;
    private String causes;
    private Boolean isHealthy;
    private Treatment treatment;
}
