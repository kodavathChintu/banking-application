package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;
import com.kumaran.BankMSApplication.service.CustomerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    @GetMapping("/{customerId}")
    public ProfileResponseDto getProfile(
            @PathVariable Long customerId) {

        return customerProfileService
                .getProfile(customerId);
    }

    @PutMapping("/update")
    public String updateProfile(
            @Valid @RequestBody UpdateProfileDto dto) {

        return customerProfileService
                .updateProfile(dto);
    }
}