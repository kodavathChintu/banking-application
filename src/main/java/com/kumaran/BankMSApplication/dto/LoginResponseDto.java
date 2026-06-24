package com.kumaran.BankMSApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {

    private String token;

    private String role;

    private String message;
}