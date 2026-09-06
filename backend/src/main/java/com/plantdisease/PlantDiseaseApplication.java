package com.plantdisease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlantDiseaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlantDiseaseApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Plant Disease Detection Backend Service Running ");
        System.out.println(" REST APIs: http://localhost:8080/api           ");
        System.out.println("=================================================");
    }
}
