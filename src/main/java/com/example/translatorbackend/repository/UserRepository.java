package com.example.translatorbackend.repository;

import com.example.translatorbackend.module.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Indha import romba mukkiyam

public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByEmail(String email);

}
