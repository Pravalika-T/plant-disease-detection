package com.plantdisease.controller;

import com.plantdisease.dto.DiseaseDTO;
import com.plantdisease.service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/diseases")
@CrossOrigin(origins = "*")
public class DiseaseController {

    @Autowired
    private DiseaseService diseaseService;

    @GetMapping
    public ResponseEntity<List<DiseaseDTO>> getAllDiseases() {
        return ResponseEntity.ok(diseaseService.getAllDiseases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiseaseDTO> getDiseaseById(@PathVariable Long id) {
        return ResponseEntity.ok(diseaseService.getDiseaseById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DiseaseDTO>> searchDiseases(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(diseaseService.searchDiseases(query));
    }
}
