package com.kumaran.BankMSApplication.dto;

import lombok.Data;

@Data
public class ProfileResponseDto {
    private Long customerId;

    private Long userId;

    private String customerName;

    private String email;

    private String address;

    private String mobileNumber;

}