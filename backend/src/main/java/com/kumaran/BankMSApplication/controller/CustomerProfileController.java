package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;
import com.kumaran.BankMSApplication.service.CustomerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    @GetMapping("/{userId}/{bankId}")
    public ProfileResponseDto getProfile(
            @PathVariable Long userId,
            @PathVariable Long bankId) {

        return customerProfileService.getProfile(userId, bankId);
    }

    @GetMapping("/accounts/{userId}")
    public List<AccountDto> getAccounts(@PathVariable Long userId) {
        return customerProfileService.getAccounts(userId);
    }

    @PatchMapping ("/update")
    public String updateProfile(
            @Valid @RequestBody UpdateProfileDto dto) {

        return customerProfileService.updateProfile(dto);
    }
}