package com.plantdisease.controller;

import com.plantdisease.dto.AdminStatsResponse;
import com.plantdisease.dto.DiseaseDTO;
import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.entity.User;
import com.plantdisease.repository.UserRepository;
import com.plantdisease.service.DiseaseService;
import com.plantdisease.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DiseaseService diseaseService;

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(predictionService.getAdminStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Hide raw password string before returning
        users.forEach(u -> u.setPassword("******"));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User account removed successfully."));
    }

    @GetMapping("/predictions")
    public ResponseEntity<List<PredictionResponse>> getAllPredictions() {
        return ResponseEntity.ok(predictionService.getAllPredictions());
    }

    @PostMapping("/diseases")
    public ResponseEntity<DiseaseDTO> createDisease(@RequestBody DiseaseDTO dto) {
        return ResponseEntity.ok(diseaseService.createDisease(dto));
    }

    @PutMapping("/diseases/{id}")
    public ResponseEntity<DiseaseDTO> updateDisease(@PathVariable Long id, @RequestBody DiseaseDTO dto) {
        return ResponseEntity.ok(diseaseService.updateDisease(id, dto));
    }

    @DeleteMapping("/diseases/{id}")
    public ResponseEntity<Map<String, String>> deleteDisease(@PathVariable Long id) {
        diseaseService.deleteDisease(id);
        return ResponseEntity.ok(Map.of("message", "Disease record deleted successfully."));
    }
}
