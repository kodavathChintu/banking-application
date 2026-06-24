package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.LoginRequestDto;
import com.kumaran.BankMSApplication.dto.LoginResponseDto;
import com.kumaran.BankMSApplication.dto.UserDto;
import com.kumaran.BankMSApplication.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public String registerCustomer(
            @Valid @RequestBody UserDto userDto) {

        return userService.registerCustomer(userDto);
    }

    @PostMapping("/login")
    public LoginResponseDto login(
            @Valid @RequestBody LoginRequestDto dto) {

        return userService.login(dto);
    }
}