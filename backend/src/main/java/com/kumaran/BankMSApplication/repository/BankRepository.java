package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, Long> {

    Optional<Bank> findByBankName(String bankName);

    Optional<Bank> findByIfscCode(String ifscCode);

    boolean existsByIfscCode(String ifscCode);
}