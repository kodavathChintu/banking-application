package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);
    List<Account> findByCustomerCustomerId(Long customerId);

    Long countByBank(Bank bank);

    boolean existsByCustomer(Customer customer);

    List<Account> findByBank(Bank bank);
    Optional<Account> findByCustomer(Customer customer);
}