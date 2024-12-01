package com.rj45.service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.rj45.dto.AnalysisDto;

@Service
public class FastAPIService {

    private final RestTemplate restTemplate;

    public FastAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AnalysisDto sendDataToFastAPI(String jsonData) {
        String url = "http://127.0.0.1:8000/analyze";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(jsonData, headers);

        // Realizar la solicitud y mapear la respuesta al DTO
        ResponseEntity<AnalysisDto> response = restTemplate.postForEntity(
                url,
                request,
                AnalysisDto.class
        );

        return response.getBody();
    }
}

