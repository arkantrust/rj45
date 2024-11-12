package com.rj45.controller;

import com.rj45.model.Doctor;
import com.rj45.model.Patient;
import com.rj45.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@CrossOrigin(maxAge = 3600)
public class DoctorController {


    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("doctors/create")
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        doctorRepository.save(doctor);
        return ResponseEntity.status(200).body(doctor);
    }
    //users?email=domic.rincon@gmail.com -> Request
    //users/domic.rincon@gmail.com -> Path Variable
    @GetMapping("doctors")
    public ResponseEntity<?> getDoctorById(@RequestParam("email") String id){
        Optional<Doctor> optDoct = doctorRepository.findById(id);
        if(optDoct.isPresent()){
            var user = optDoct.get();
            return ResponseEntity.status(200).body(user);
        }else{
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("doctors/list")
    public ResponseEntity<?> listDoctors(@RequestHeader("Authorization") String authorization) {

        var doctors = doctorRepository.findAll();

        return ResponseEntity.status(200).body(doctors);


    }

    @DeleteMapping("/doctors/{natID}")
    public ResponseEntity<?> deletePatient(@PathVariable String id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        if (doctor.isPresent()) {
            doctorRepository.deleteById(id);
            return ResponseEntity.status(200).body("Patient deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Patient not found");
        }
    }

}
