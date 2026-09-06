package com.plantdisease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalDiseases;
    private long totalPredictions;
    private long healthyPredictions;
    private long diseasedPredictions;
}
