package com.rj45.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.rj45.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> getByEmail(String nationalId);

    public Optional<User> getByNationalId(String nationalId);

}
