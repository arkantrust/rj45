package com.rj45.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Measurement{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private double gyroX;
    private double gyroY;

    private double othermeasX;

    private double othermeasY;

    private LocalDateTime timestamp;

    public Measurement(){

    }

    public Measurement(String id){

        this.id = id;
    }

    public Measurement(String id, double gyroX, double gyroY, double othermeasX, double othermeasY){

        this.id = id;
        this.gyroX = gyroX;
        this.gyroY = gyroY;
        this.othermeasX = othermeasX;
        this.othermeasY = othermeasY;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public double getGyroX() {
        return gyroX;
    }

    public void setGyroX(double gyroX) {
        this.gyroX = gyroX;
    }

    public double getGyroY() {
        return gyroY;
    }

    public void setGyroY(double gyroY) {
        this.gyroY = gyroY;
    }

    public double getOthermeasX() {
        return othermeasX;
    }

    public void setOthermeasX(double othermeasX) {
        this.othermeasX = othermeasX;
    }

    public double getOthermeasY() {
        return othermeasY;
    }

    public void setOthermeasY(double othermeasY) {
        this.othermeasY = othermeasY;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
