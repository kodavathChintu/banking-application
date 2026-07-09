package com.kumaran.BankMSApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardDto {

    private Long totalCustomers;

    private Long totalAccounts;

    private Long totalTransactions;

    private Long totalPendingRequests;
}