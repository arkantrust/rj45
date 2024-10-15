package com.rj45.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Measurement {

    private Coordinate accel;

    private Coordinate gyro;
    
}
