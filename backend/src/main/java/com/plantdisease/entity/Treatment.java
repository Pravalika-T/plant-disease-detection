package com.plantdisease.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "treatments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "disease_id", nullable = false)
    @JsonIgnore
    private Disease disease;

    private String pesticide;
    private String fungicide;
    private String fertilizer;

    @Column(name = "biological_control")
    private String biologicalControl;

    @Column(columnDefinition = "TEXT")
    private String dosage;

    @Column(columnDefinition = "TEXT")
    private String prevention;
}
