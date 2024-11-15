package com.rj45.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

import com.rj45.util.EmailValidator;
import com.rj45.util.NationalIdValidator;
import com.rj45.repository.PatientRepository;
import com.rj45.model.Patient;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository repo;

    public Patient add(String name, String email, String nationalId)
            throws IllegalArgumentException, EntityExistsException {

        if (!new EmailValidator(email).isValid())
            throw new IllegalArgumentException("Invalid email");

        if (!new NationalIdValidator(nationalId).isValid())
            throw new IllegalArgumentException("Invalid national ID");

        // Only if we found a conflict, we do a detailed check to provide a more
        // informative error message
        if (repo.existsByEmailOrNationalId(email, nationalId)) {
            List<String> errors = new ArrayList<>();

            if (repo.existsByEmail(email))
                errors.add("Email is already registered");

            if (repo.existsByNationalId(nationalId))
                errors.add("National ID is already registered");

            throw new EntityExistsException(String.join(", ", errors));
        }

        Patient p = Patient.builder()
            .name(name)
            .email(email)
            .nationalId(nationalId)
            .discharged(false)
            .build();

        repo.save(p);

        return p;
    }

    public List<Patient> getAll() {
        return repo.findAll();
    }

    public Patient getById(Long id) throws EntityNotFoundException {
        return repo.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public Patient getByUsername(String username) throws EntityNotFoundException, IllegalArgumentException {
        Optional<Patient> box = null;

        var email = new EmailValidator(username);
        var nationalId = new NationalIdValidator(username);

        if (email.isValid()) {
            box = repo.findByEmail(username);
        } else if (nationalId.isValid()) {
            box = repo.findByNationalId(username);
        } else {
            throw new IllegalArgumentException("Unrecognized username format");
        }

        if (!box.isPresent())
            throw new EntityNotFoundException();

        return box.get();
    }

    public Patient update(Long id, String name, String email, String nationalId)
            throws EntityNotFoundException, IllegalArgumentException {
        Patient p = repo.findById(id).orElseThrow(EntityNotFoundException::new);

        p.setName(name != null ? name : p.getName());
        p.setEmail(email != null ? email : p.getEmail());
        p.setNationalId(nationalId != null ? nationalId : p.getNationalId());

        repo.save(p);

        return p;
    }

    public void delete(Long id) throws EntityNotFoundException {
        if (!repo.existsById(id))
            throw new EntityNotFoundException();

        repo.discharge(id);
    }

}
