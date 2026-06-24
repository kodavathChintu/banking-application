package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.CustomerDto;
import com.kumaran.BankMSApplication.dto.DashboardDto;
import com.kumaran.BankMSApplication.entity.AccountOpeningRequest;

import java.util.List;

public interface ManagerService {

    List<AccountOpeningRequest> getPendingRequests();

    String approveRequest(Long requestId);

    List<CustomerDto> getAllCustomers();

    CustomerDto getCustomerById(Long customerId);

    String deactivateCustomer(Long customerId);

    String activateCustomer(Long customerId);

    List<AccountDto> getAllAccounts();

    String lockAccount(Long accountId);

    String unlockAccount(Long accountId);

    String closeAccount(Long accountId);

    AccountDto getAccountByNumber(String accountNumber);

    DashboardDto getDashboardData();
}