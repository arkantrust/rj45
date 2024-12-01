package com.rj45.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rj45.model.Coordinate;
import com.rj45.model.Measurement;
import com.rj45.model.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.rj45.dto.AnalysisDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final FastAPIService fastAPIService;

    public AnalyticsService(FastAPIService fastAPIService) {
        this.fastAPIService = fastAPIService;
    }

    public AnalysisDto analyzeTest(Test test) throws Exception {
        // Extrae las mediciones de la lista dentro del objeto Test
        List<Coordinate> measurements = test.getMeasurements().stream()
                .map(Measurement::getAccel).collect(Collectors.toList());

        // Convierte las mediciones a JSON
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonMeasurement = objectMapper.writeValueAsString(measurements);

        // Llama a FastAPI con el JSON generado
        return fastAPIService.sendDataToFastAPI(jsonMeasurement);
    }
}
