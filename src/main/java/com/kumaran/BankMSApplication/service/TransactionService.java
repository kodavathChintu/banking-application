package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.TransactionDto;
import com.kumaran.BankMSApplication.dto.TransactionRequestDto;
import com.kumaran.BankMSApplication.dto.TransferRequestDto;

import java.util.List;

public interface TransactionService {

    String deposit(TransactionRequestDto dto);

    String withdraw(TransactionRequestDto dto);

    String transfer(TransferRequestDto dto);

    Double checkBalance(String accountNumber);



    List<TransactionDto> getStatement(String accountNumber);
}