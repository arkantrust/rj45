package com.rj45.repository;
import com.rj45.model.Doctor;
import org.springframework.data.repository.CrudRepository;

public interface DoctorRepository extends CrudRepository<Doctor, String> {


}
