package com.rj45.service;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import com.rj45.model.User;
import com.rj45.repository.UserRepository;
import com.rj45.util.EmailValidator;
import com.rj45.util.NationalIdValidator;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository repo;

    public User getById(Long id) throws EntityNotFoundException {
        User u = repo.findById(id).orElseThrow(EntityNotFoundException::new);

        if (!u.isActive())
            throw new EntityNotFoundException();
        
        return u;
    }

    public User getByUsername(String username) throws EntityNotFoundException, IllegalArgumentException {
        Optional<User> box = null;

        // username is an email
        if (new EmailValidator(username).isValid()) {
            box = repo.findByEmail(username);
        } else if (new NationalIdValidator(username).isValid()) {
            box = repo.findByNationalId(username);
        } else {
            throw new IllegalArgumentException("Invalid username");
        }

        if (!box.isPresent() || !box.get().isActive())
            System.out.println("User not found");
        
        return box.get();
    }

    public User update(Long id, String name, String email, String nationalId) throws EntityNotFoundException, IllegalArgumentException {
        User u = repo.findById(id).orElseThrow(EntityNotFoundException::new);

        if (!u.isActive())
            throw new EntityNotFoundException();
        
        u.setName(name != null ? name : u.getName());
        u.setEmail(email != null ? email : u.getEmail());
        u.setNationalId(nationalId != null ? nationalId : u.getNationalId());

        return repo.save(u);
    }

    public void delete(Long id) throws EntityNotFoundException {
        if (!repo.existsById(id))
            throw new EntityNotFoundException();

        repo.deleteProfile(id);
    }

}
