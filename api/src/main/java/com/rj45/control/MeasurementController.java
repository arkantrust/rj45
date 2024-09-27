package com.rj45.control;
import com.rj45.model.Measurement;
import com.rj45.repository.MeasureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    private MeasureRepository measurementRepository;

    @PostMapping
    public Measurement saveMeasurement(@RequestBody Measurement measurement) {
        measurement.setTimestamp(LocalDateTime.now());
        return measurementRepository.save(measurement);
    }

}
