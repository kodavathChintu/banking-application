package com.kumaran.BankMSApplication.dto;

import com.kumaran.BankMSApplication.enums.TransactionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionDto {

    private Long transactionId;

    private Double amount;

    private TransactionType transactionType;

    private LocalDateTime transactionTime;

    private String remarks;

    // Additional fields for PDF
    private String senderAccountNumber;

    private String receiverAccountNumber;
}