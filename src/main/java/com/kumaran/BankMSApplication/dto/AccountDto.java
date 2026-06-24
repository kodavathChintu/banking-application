package com.kumaran.BankMSApplication.dto;

import com.kumaran.BankMSApplication.enums.AccountStatus;
import com.kumaran.BankMSApplication.enums.AccountType;
import lombok.Data;

@Data
public class AccountDto {

    private Long accountId;

    private String accountNumber;

    private Double balance;

    private AccountType accountType;

    private AccountStatus accountStatus;
}