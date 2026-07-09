package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.TransactionDto;
import com.kumaran.BankMSApplication.dto.TransactionRequestDto;
import com.kumaran.BankMSApplication.dto.TransferRequestDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TransactionService {

    String deposit(TransactionRequestDto dto);

    String withdraw(TransactionRequestDto dto);

    String transfer(TransferRequestDto dto);

    Double checkBalance(String accountNumber);



    Page<TransactionDto> getStatement(
            String accountNumber,
            int page,
            int size
    );
    byte[] downloadStatement(String accountNumber);
}