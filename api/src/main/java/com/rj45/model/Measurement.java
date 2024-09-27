package com.rj45.model;

public class Measurement{

    private String id;
    private double gyroX;
    private double gyroY;

    public Measurement(){


    }

    public Measurement(String id){

        this.id = id;
    }

    public Measurement(String id, double gyroX, double gyroY){

        this.id = id;
        this.gyroX = gyroX;
        this.gyroY = gyroY;
    }

    
}
