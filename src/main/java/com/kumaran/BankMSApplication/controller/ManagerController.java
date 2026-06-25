package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.CustomerDto;
import com.kumaran.BankMSApplication.dto.DashboardDto;
import com.kumaran.BankMSApplication.entity.AccountOpeningRequest;
import com.kumaran.BankMSApplication.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/requests")
    public List<AccountOpeningRequest> getPendingRequests() {

        return managerService.getPendingRequests();
    }

    @PostMapping("/approve/{requestId}")
    public String approveRequest(
            @PathVariable Long requestId) {

        return managerService.approveRequest(requestId);
    }

    @GetMapping("/customers")
    public List<CustomerDto> getAllCustomers() {

        return managerService.getAllCustomers();
    }

    @GetMapping("/customer/{customerId}")
    public CustomerDto getCustomerById(
            @PathVariable Long customerId) {

        return managerService.getCustomerById(customerId);
    }

    @PutMapping("/customer/deactivate/{customerId}")
    public String deactivateCustomer(
            @PathVariable Long customerId) {

        return managerService.deactivateCustomer(customerId);
    }

    @PutMapping("/customer/activate/{customerId}")
    public String activateCustomer(
            @PathVariable Long customerId) {

        return managerService.activateCustomer(customerId);
    }

    @GetMapping("/accounts")
    public List<AccountDto> getAllAccounts() {

        return managerService.getAllAccounts();
    }

    @PutMapping("/account/lock/{accountId}")
    public String lockAccount(
            @PathVariable Long accountId) {

        return managerService.lockAccount(accountId);
    }

    @PutMapping("/account/unlock/{accountId}")
    public String unlockAccount(
            @PathVariable Long accountId) {

        return managerService.unlockAccount(accountId);
    }

    @PutMapping("/account/close/{accountId}")
    public String closeAccount(
            @PathVariable Long accountId) {

        return managerService.closeAccount(accountId);
    }

    @GetMapping("/account/{accountNumber}")
    public AccountDto getAccountByNumber(
            @PathVariable String accountNumber) {

        return managerService.getAccountByNumber(accountNumber);
    }

    @GetMapping("/dashboard")
    public DashboardDto getDashboardData(
            Authentication authentication){

        return managerService.getDashboardData(
                authentication.getName()
        );
    }
}