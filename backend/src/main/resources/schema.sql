-- Database schema for AI-Based Plant Disease Detection System

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_FARMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plant_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS diseases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_id BIGINT NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    symptoms TEXT,
    causes TEXT,
    is_healthy BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (plant_id) REFERENCES plant_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS treatments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disease_id BIGINT NOT NULL UNIQUE,
    pesticide VARCHAR(255),
    fungicide VARCHAR(255),
    fertilizer VARCHAR(255),
    biological_control VARCHAR(255),
    dosage TEXT,
    prevention TEXT,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    disease_id BIGINT NOT NULL,
    confidence DOUBLE NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
);
