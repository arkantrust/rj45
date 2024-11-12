package com.rj45.controller;

import com.rj45.model.Patient;
import com.rj45.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@CrossOrigin(maxAge = 3600)
public class PatientController{

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("patients/create")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        patientRepository.save(patient);
        return ResponseEntity.status(200).body(patient);
    }
    //users?email=domic.rincon@gmail.com -> Request
    //users/domic.rincon@gmail.com -> Path Variable
    @GetMapping("users")
    public ResponseEntity<?> getPatientById(@RequestParam("email") String id){
        Optional<Patient> optPat = patientRepository.findById(id);
        if(optPat.isPresent()){
            var user = optPat.get();
            return ResponseEntity.status(200).body(user);
        }else{
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("users/list")
    public ResponseEntity<?> listPatients(@RequestHeader("Authorization") String authorization) {

        var users = patientRepository.findAll();

        return ResponseEntity.status(200).body(users);


    }

    @DeleteMapping("/patients/{natID}")
    public ResponseEntity<?> deletePatient(@PathVariable String natID) {
        Optional<Patient> patient = patientRepository.findById(natID);
        if (patient.isPresent()) {
            patientRepository.deleteById(natID);
            return ResponseEntity.status(200).body("Patient deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Patient not found");
        }
    }

}
