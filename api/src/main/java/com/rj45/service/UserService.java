package com.rj45.service;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import com.rj45.model.User;
import com.rj45.repository.UserRepository;
import com.rj45.dto.UserDto;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository repo;

    private boolean isEmail(String username) {
        return username.contains("@");
    }

    private boolean isNationalId(String username) throws IllegalArgumentException {
        try {
            Integer.parseInt(username);
            return true;
        } catch (NumberFormatException e) {
            return false;
        } catch (Exception e) {
            throw new IllegalArgumentException();
        }
    }

    public UserDto getById(Long id) throws EntityNotFoundException {
        User u = repo.getReferenceById(id);

        if (!u.isActive())
            throw new EntityNotFoundException();
        
        return u.toDto();
    }

    public UserDto getByUsername(String username) throws EntityNotFoundException, IllegalArgumentException {
        Optional<User> box = null;

        // username is an email
        if (isEmail(username)) {
            box = repo.getByEmail(username);
        } else if (isNationalId(username)) {
            box = repo.getByNationalId(username);
        } else {
            throw new IllegalArgumentException();
        }

        if (!box.isPresent() || !box.get().isActive())
            throw new EntityNotFoundException();
        
        return box.get().toDto();
    }

    public UserDto update(Long id, String name, String email, String nationalId) throws EntityNotFoundException, IllegalArgumentException {
        User u = repo.getReferenceById(id);

        if (!u.isActive())
            throw new EntityNotFoundException();
        
        u.setName(name != null ? name : u.getName());
        u.setEmail(email != null ? email : u.getEmail());
        u.setNationalId(nationalId != null ? nationalId : u.getNationalId());

        repo.save(u);

        return u.toDto();
    }

    // TODO: delete user by id
    public void delete(Long id) throws EntityNotFoundException {
        User u = repo.getReferenceById(id);

        if (!u.isActive())
            throw new EntityNotFoundException();

        u.setActive(false);        

        repo.save(u);
    }

}
