package com.plantdisease.service;

import com.plantdisease.dto.DiseaseDTO;
import com.plantdisease.entity.Disease;
import com.plantdisease.entity.PlantCategory;
import com.plantdisease.entity.Treatment;
import com.plantdisease.repository.DiseaseRepository;
import com.plantdisease.repository.PlantCategoryRepository;
import com.plantdisease.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiseaseService {

    @Autowired
    private DiseaseRepository diseaseRepository;

    @Autowired
    private PlantCategoryRepository plantCategoryRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    public List<DiseaseDTO> getAllDiseases() {
        return diseaseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DiseaseDTO getDiseaseById(Long id) {
        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease record not found"));
        return mapToDTO(disease);
    }

    public List<DiseaseDTO> searchDiseases(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllDiseases();
        }
        return diseaseRepository.searchByQuery(query.trim()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DiseaseDTO createDisease(DiseaseDTO dto) {
        PlantCategory category = plantCategoryRepository.findByPlantNameIgnoreCase(dto.getPlantName())
                .orElseGet(() -> plantCategoryRepository.save(
                        PlantCategory.builder().plantName(dto.getPlantName()).build()
                ));

        Disease disease = Disease.builder()
                .plantCategory(category)
                .diseaseName(dto.getDiseaseName())
                .symptoms(dto.getSymptoms())
                .causes(dto.getCauses())
                .isHealthy(dto.getIsHealthy() != null && dto.getIsHealthy())
                .build();

        Disease savedDisease = diseaseRepository.save(disease);

        if (dto.getTreatment() != null) {
            Treatment treatment = dto.getTreatment();
            treatment.setDisease(savedDisease);
            treatmentRepository.save(treatment);
            savedDisease.setTreatment(treatment);
        }

        return mapToDTO(savedDisease);
    }

    public DiseaseDTO updateDisease(Long id, DiseaseDTO dto) {
        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disease record not found"));

        if (dto.getPlantName() != null) {
            PlantCategory category = plantCategoryRepository.findByPlantNameIgnoreCase(dto.getPlantName())
                    .orElseGet(() -> plantCategoryRepository.save(
                            PlantCategory.builder().plantName(dto.getPlantName()).build()
                    ));
            disease.setPlantCategory(category);
        }

        disease.setDiseaseName(dto.getDiseaseName());
        disease.setSymptoms(dto.getSymptoms());
        disease.setCauses(dto.getCauses());
        if (dto.getIsHealthy() != null) {
            disease.setIsHealthy(dto.getIsHealthy());
        }

        Disease updatedDisease = diseaseRepository.save(disease);

        if (dto.getTreatment() != null) {
            Treatment treatment = treatmentRepository.findByDiseaseId(id)
                    .orElse(new Treatment());
            treatment.setDisease(updatedDisease);
            treatment.setPesticide(dto.getTreatment().getPesticide());
            treatment.setFungicide(dto.getTreatment().getFungicide());
            treatment.setFertilizer(dto.getTreatment().getFertilizer());
            treatment.setBiologicalControl(dto.getTreatment().getBiologicalControl());
            treatment.setDosage(dto.getTreatment().getDosage());
            treatment.setPrevention(dto.getTreatment().getPrevention());
            treatmentRepository.save(treatment);
            updatedDisease.setTreatment(treatment);
        }

        return mapToDTO(updatedDisease);
    }

    public void deleteDisease(Long id) {
        diseaseRepository.deleteById(id);
    }

    public DiseaseDTO mapToDTO(Disease disease) {
        return DiseaseDTO.builder()
                .id(disease.getId())
                .plantName(disease.getPlantCategory().getPlantName())
                .diseaseName(disease.getDiseaseName())
                .symptoms(disease.getSymptoms())
                .causes(disease.getCauses())
                .isHealthy(disease.getIsHealthy())
                .treatment(disease.getTreatment())
                .build();
    }
}
