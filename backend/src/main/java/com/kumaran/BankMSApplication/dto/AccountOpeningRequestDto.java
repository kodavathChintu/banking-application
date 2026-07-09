package com.kumaran.BankMSApplication.dto;

import com.kumaran.BankMSApplication.enums.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountOpeningRequestDto {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    private String gender;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Bank id is required")
    private Long bankId;

    @NotNull(message = "Account type is required")
    private AccountType accountType;
}