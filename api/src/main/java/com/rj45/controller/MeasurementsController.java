package com.rj45.controller;

import com.rj45.model.Measurement;
import com.rj45.repository.MeasurementRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/measurements")
public class MeasurementsController {

    private MeasurementRepository measurementRepository;

    @PostMapping
    public Measurement saveMeasurement(@RequestBody Measurement measurement) {
        measurement.setTimestamp(LocalDateTime.now());
        return measurementRepository.save(measurement);
    }

}
