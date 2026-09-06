package com.plantdisease.repository;

import com.plantdisease.entity.ImageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<ImageRecord, Long> {
    List<ImageRecord> findByUserIdOrderByUploadedAtDesc(Long userId);
}
