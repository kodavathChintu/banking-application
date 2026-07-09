package com.kumaran.BankMSApplication.dto;

import com.kumaran.BankMSApplication.enums.AccountStatus;
import com.kumaran.BankMSApplication.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDto {

    private Long accountId;

    private String accountNumber;

    private Double balance;

    private AccountType accountType;

    private AccountStatus accountStatus;

    private String bankName;

    private String ifscCode;
    private String customerName;
}