package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.TransactionDto;
import com.kumaran.BankMSApplication.dto.TransactionRequestDto;
import com.kumaran.BankMSApplication.dto.TransferRequestDto;
import com.kumaran.BankMSApplication.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public String deposit(
            @Valid @RequestBody TransactionRequestDto dto) {

        return transactionService.deposit(dto);
    }

    @PostMapping("/withdraw")
    public String withdraw(
            @Valid @RequestBody TransactionRequestDto dto) {

        return transactionService.withdraw(dto);
    }

    @PostMapping("/transfer")
    public String transfer(
            @Valid @RequestBody TransferRequestDto dto) {

        return transactionService.transfer(dto);
    }

    @GetMapping("/balance/{accountNumber}")
    public Double checkBalance(
            @PathVariable String accountNumber) {

        return transactionService
                .checkBalance(accountNumber);
    }

    @GetMapping("/statement/{accountNumber}")
    public List<TransactionDto> getStatement(
            @PathVariable String accountNumber) {

        return transactionService
                .getStatement(accountNumber);
    }
}