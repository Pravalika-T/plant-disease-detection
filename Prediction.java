package com.plantdisease.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "image_id", nullable = false)
    private ImageRecord image;

    @ManyToOne
    @JoinColumn(name = "disease_id", nullable = false)
    private Disease disease;

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "prediction_date")
    private LocalDateTime predictionDate;

    @PrePersist
    public void prePersist() {
        if (this.predictionDate == null) {
            this.predictionDate = LocalDateTime.now();
        }
    }
}
