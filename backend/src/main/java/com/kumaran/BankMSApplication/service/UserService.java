package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.LoginRequestDto;
import com.kumaran.BankMSApplication.dto.LoginResponseDto;
import com.kumaran.BankMSApplication.dto.UserDto;

public interface UserService {

    String registerCustomer(UserDto userDto);

    LoginResponseDto login(LoginRequestDto loginDto);
}