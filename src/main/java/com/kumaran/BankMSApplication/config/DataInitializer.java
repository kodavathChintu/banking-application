package com.kumaran.BankMSApplication.config;

import com.kumaran.BankMSApplication.entity.Bank;
import com.kumaran.BankMSApplication.entity.User;
import com.kumaran.BankMSApplication.enums.Role;
import com.kumaran.BankMSApplication.repository.BankRepository;
import com.kumaran.BankMSApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BankRepository bankRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        createBankAndManager(
                "HDFC",
                "HDFC0001",
                "hdfcmanager@gmail.com",
                "hdfc123"
        );

        createBankAndManager(
                "SBI",
                "SBI0001",
                "sbimanager@gmail.com",
                "sbi123"
        );
    }

    private void createBankAndManager(
            String bankName,
            String ifsc,
            String email,
            String password) {

        if (bankRepository.findByBankName(bankName).isPresent()) {
            return;
        }

        Bank bank = new Bank();

        bank.setBankName(bankName);
        bank.setIfscCode(ifsc);
        bank.setBranchName("Hyderabad");
        bank.setAddress("Hyderabad");
        bank.setActive(true);

        bankRepository.save(bank);

        User manager = new User();

        manager.setFullName(bankName + " Manager");
        manager.setEmail(email);
        manager.setPassword(
                passwordEncoder.encode(password)
        );
        manager.setRole(Role.MANAGER);
        manager.setActive(true);

        userRepository.save(manager);
    }
}