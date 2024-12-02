package com.rj45.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.rj45.model.User;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public Optional<User> findByEmail(String nationalId);

    public Optional<User> findByNationalId(String nationalId);

    @Query("SELECT u FROM User u WHERE u.email = :username OR u.nationalId = :username")
    public Optional<User> findByUsername(@Param("username") String username);

    public boolean existsByEmail(String nationalId);

    public boolean existsByNationalId(String nationalId);

    public boolean existsByEmailOrNationalId(String email, String nationalId);

    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.id = :id")
    public void deleteProfile(@Param("id") Long id);

}
