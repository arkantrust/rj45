package com.rj45.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.List;

import com.rj45.util.EmailValidator;
import com.rj45.util.NationalIdValidator;
import com.rj45.repository.PatientRepository;
import com.rj45.model.Patient;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository repo;

        private record PatientResponse(
        Long id,
        String name,
        String email,
        String nationalId,
        boolean discharged,
        List<String> tests
    ) {};

    public PatientResponse add(String name, String email, String nationalId)
            throws IllegalArgumentException, EntityExistsException {

        if (!new EmailValidator(email).isValid())
            throw new IllegalArgumentException("INVALID_EMAIL");

        if (!new NationalIdValidator(nationalId).isValid())
            throw new IllegalArgumentException("INVALID_NATIONAL_ID");

        // Only if we found a conflict, we do a detailed check to provide a more
        // informative error message
        if (repo.existsByEmailOrNationalId(email, nationalId)) {
            if (repo.existsByEmail(email))
            throw new EntityExistsException("EMAIL_ALREADY_REGISTERED");

            if (repo.existsByNationalId(nationalId))
            throw new EntityExistsException("NATIONAL_ID_ALREADY_REGISTERED");
        }

        Patient p = Patient.builder()
            .name(name)
            .email(email)
            .nationalId(nationalId)
            .discharged(false)
            .build();

        var patient = repo.save(p);

        return new PatientResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getNationalId(),
            patient.isDischarged(),
            patient.getTests().stream().map(t -> t.getId().toString()).toList()
        );
    }

    public List<PatientResponse> getAll() {
        return repo.findAll().stream().map(p -> new PatientResponse(
            p.getId(),
            p.getName(),
            p.getEmail(),
            p.getNationalId(),
            p.isDischarged(),
            p.getTests().stream().map(t -> t.getId().toString()).toList()
        )).toList();
    }

    public PatientResponse getById(Long id) throws EntityNotFoundException {
        var patient = repo.findById(id).orElseThrow(EntityNotFoundException::new);
        return new PatientResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getNationalId(),
            patient.isDischarged(),
            patient.getTests().stream().map(t -> t.getId().toString()).toList()
        );
    }

    public PatientResponse getByUsername(String username) throws EntityNotFoundException, IllegalArgumentException {
        Optional<Patient> box = null;

        var email = new EmailValidator(username);
        var nationalId = new NationalIdValidator(username);

        if (email.isValid()) {
            box = repo.findByEmail(username);
        } else if (nationalId.isValid()) {
            box = repo.findByNationalId(username);
        } else {
            throw new IllegalArgumentException("UNKNOWN_USERNAME");
        }

        if (!box.isPresent())
            throw new EntityNotFoundException();

        var patient = box.get();

        return new PatientResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getNationalId(),
            patient.isDischarged(),
            patient.getTests().stream().map(t -> t.getId().toString()).toList()
        );
    }

    public PatientResponse update(Long id, String name, String email, String nationalId)
            throws EntityNotFoundException, IllegalArgumentException {
        Patient p = repo.findById(id).orElseThrow(EntityNotFoundException::new);

        p.setName(name != null ? name : p.getName());
        p.setEmail(email != null ? email : p.getEmail());
        p.setNationalId(nationalId != null ? nationalId : p.getNationalId());

        var patient = repo.save(p);

        return new PatientResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            patient.getNationalId(),
            patient.isDischarged(),
            patient.getTests().stream().map(t -> t.getId().toString()).toList()
        );
    }

    public void delete(Long id) throws EntityNotFoundException {
        if (!repo.existsById(id))
            throw new EntityNotFoundException();

        repo.discharge(id);
    }

}
