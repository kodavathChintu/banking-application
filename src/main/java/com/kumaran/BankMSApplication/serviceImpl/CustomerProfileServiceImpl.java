package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;
import com.kumaran.BankMSApplication.entity.Customer;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import com.kumaran.BankMSApplication.repository.CustomerRepository;
import com.kumaran.BankMSApplication.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerProfileServiceImpl
        implements CustomerProfileService {

    private final CustomerRepository customerRepository;

    @Override
    public ProfileResponseDto getProfile(Long customerId) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        ProfileResponseDto dto = new ProfileResponseDto();

        dto.setCustomerId(customer.getCustomerId());
        dto.setUserId(customer.getUser().getUserId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setMobileNumber(customer.getMobileNumber());

        return dto;
    }

    @Override
    public String updateProfile(UpdateProfileDto dto) {

        Customer customer = customerRepository
                .findById(dto.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        customer.setCustomerName(dto.getCustomerName());
        customer.setEmail(dto.getEmail());
        customer.setMobileNumber(dto.getMobileNumber());
        customer.setAddress(dto.getAddress());

        customerRepository.save(customer);

        return "Profile Updated Successfully";
    }
}