package com.rj45.repository;
import com.rj45.model.Patient;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface PatientRepository extends CrudRepository<Patient, String> {


}
