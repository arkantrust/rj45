package com.rj45.dto;

import com.rj45.model.Measurement;
import java.util.List;
import java.util.Map;

// TODO: add evaluatorId and patientId
public record TestDto(String type, List<Map<String, Object>> measurements) {

}
