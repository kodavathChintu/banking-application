package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;

public interface CustomerProfileService {

    ProfileResponseDto getProfile(Long customerId);

    String updateProfile(UpdateProfileDto dto);
}