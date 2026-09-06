package com.plantdisease.controller;

import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping
    public ResponseEntity<PredictionResponse> predict(
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(predictionService.predictAndSave(userId, file));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PredictionResponse>> getUserHistory(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(predictionService.getUserHistory(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredictionResponse> getPredictionById(@PathVariable Long id) {
        return ResponseEntity.ok(predictionService.getPredictionById(id));
    }
}
