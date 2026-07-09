package com.kumaran.BankMSApplication.service;

import com.kumaran.BankMSApplication.dto.BankDto;

import java.util.List;

public interface BankService {

    List<BankDto> getAllBanks();
}