package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.CustomerDto;
import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;

import java.util.List;

public interface CustomerProfileService {

    ProfileResponseDto getProfile(Long userId, Long bankId);
    List<AccountDto> getAccounts(Long userId);
    String updateProfile(UpdateProfileDto dto);
    ;

}