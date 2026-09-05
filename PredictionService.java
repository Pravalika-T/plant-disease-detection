package com.plantdisease.service;

import com.plantdisease.dto.AdminStatsResponse;
import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.entity.*;
import com.plantdisease.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private DiseaseRepository diseaseRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private AIServiceClient aiServiceClient;

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    public PredictionResponse predictAndSave(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a clear photo of a plant leaf.");
        }

        // Save File Locally
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            fileExtension = ".jpg";
        }

        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath);

        File savedFile = filePath.toFile();

        // Send to AI Client
        AIServiceClient.AIPredictionResult aiResult = aiServiceClient.predictPlantDisease(savedFile);

        // Fetch corresponding Disease record from Database
        Disease disease = diseaseRepository.findByDiseaseNameIgnoreCase(aiResult.getDiseaseName())
                .orElseGet(() -> diseaseRepository.findAll().stream()
                        .filter(d -> d.getDiseaseName().toLowerCase().contains("blight") || d.getDiseaseName().toLowerCase().contains("healthy"))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Disease record not found in system database")));

        // Save Image Record
        ImageRecord imageRecord = ImageRecord.builder()
                .user(user)
                .imagePath("uploads/" + storedFileName)
                .build();
        ImageRecord savedImage = imageRepository.save(imageRecord);

        // Save Prediction Record
        Prediction prediction = Prediction.builder()
                .user(user)
                .image(savedImage)
                .disease(disease)
                .confidence(aiResult.getConfidence())
                .build();
        Prediction savedPrediction = predictionRepository.save(prediction);

        return mapToPredictionResponse(savedPrediction);
    }

    public List<PredictionResponse> getUserHistory(Long userId) {
        return predictionRepository.findByUserIdOrderByPredictionDateDesc(userId).stream()
                .map(this::mapToPredictionResponse)
                .collect(Collectors.toList());
    }

    public PredictionResponse getPredictionById(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction record not found"));
        return mapToPredictionResponse(prediction);
    }

    public List<PredictionResponse> getAllPredictions() {
        return predictionRepository.findAllByOrderByPredictionDateDesc().stream()
                .map(this::mapToPredictionResponse)
                .collect(Collectors.toList());
    }

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalDiseases = diseaseRepository.count();
        long totalPredictions = predictionRepository.count();
        long healthyCount = predictionRepository.countAllHealthy();
        long diseasedCount = predictionRepository.countAllDiseased();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalDiseases(totalDiseases)
                .totalPredictions(totalPredictions)
                .healthyPredictions(healthyCount)
                .diseasedPredictions(diseasedCount)
                .build();
    }

    private PredictionResponse mapToPredictionResponse(Prediction p) {
        return PredictionResponse.builder()
                .predictionId(p.getId())
                .plantName(p.getDisease().getPlantCategory().getPlantName())
                .diseaseName(p.getDisease().getDiseaseName())
                .confidence(p.getConfidence())
                .isHealthy(p.getDisease().getIsHealthy())
                .symptoms(p.getDisease().getSymptoms())
                .causes(p.getDisease().getCauses())
                .treatment(p.getDisease().getTreatment())
                .imagePath(p.getImage().getImagePath())
                .predictionDate(p.getPredictionDate())
                .build();
    }
}
