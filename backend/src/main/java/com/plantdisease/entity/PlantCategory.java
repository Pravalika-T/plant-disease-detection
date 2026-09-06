package com.plantdisease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plant_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plant_name", nullable = false, unique = true, length = 100)
    private String plantName;
}
