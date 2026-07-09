package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.BankManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankManagerRepository extends JpaRepository<BankManager, Long> {

    Optional<BankManager> findByUserEmail(String email);
}