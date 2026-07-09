package com.kumaran.BankMSApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    private String token;

    private String role;

    private String message;

    private Long userId;
    private String fullName;
    private String email;
    private Boolean active;


}