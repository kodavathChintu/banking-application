package com.kumaran.BankMSApplication.dto;

import com.kumaran.BankMSApplication.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerDto {

    private Long customerId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "Address is required")
    private String address;

    private CustomerStatus status;
    private String bankName;
    
}