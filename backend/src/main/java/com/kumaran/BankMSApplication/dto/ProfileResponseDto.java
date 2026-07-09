package com.kumaran.BankMSApplication.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileResponseDto {

    private Long userId;
    private Long customerId;
    private String customerName;
    private String email;
    private String mobileNumber;
    private String address;

    private String requestStatus;

    private List<AccountDto> accounts; // ONLY THIS
}