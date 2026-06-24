package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.AccountOpeningRequestDto;
import com.kumaran.BankMSApplication.service.AccountOpeningRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class AccountOpeningRequestController {

    private final AccountOpeningRequestService service;

    @PostMapping("/account-opening")
    public String submitRequest(
            @RequestBody AccountOpeningRequestDto dto,
            Authentication authentication) {

        return service.submitRequest(
                dto,
                authentication.getName()
        );
    }
}