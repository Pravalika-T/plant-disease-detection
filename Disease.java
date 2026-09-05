package com.plantdisease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diseases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false)
    private PlantCategory plantCategory;

    @Column(name = "disease_name", nullable = false, length = 150)
    private String diseaseName;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String causes;

    @Column(name = "is_healthy")
    private Boolean isHealthy = false;

    @OneToOne(mappedBy = "disease", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Treatment treatment;
}
