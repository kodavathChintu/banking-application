package com.kumaran.BankMSApplication.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankDto {

    private Long bankId;

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @NotBlank(message = "IFSC code is required")
    private String ifscCode;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    @NotBlank(message = "Address is required")
    private String address;

    private Boolean active;
}