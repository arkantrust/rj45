package com.rj45.dto;

import com.rj45.model.Measurement;
import java.util.List;

// TODO: add evaluatorId and patientId
public record TestDto(String type, List<Measurement> measurements) {

}
