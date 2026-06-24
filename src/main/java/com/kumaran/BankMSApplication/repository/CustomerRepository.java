package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.Customer;
import com.kumaran.BankMSApplication.enums.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByUserUserId(Long userId);

    List<Customer> findByStatus(CustomerStatus status);

}