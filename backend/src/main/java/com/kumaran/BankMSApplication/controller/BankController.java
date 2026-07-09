package com.kumaran.BankMSApplication.controller;

import com.kumaran.BankMSApplication.dto.BankDto;
import com.kumaran.BankMSApplication.service.BankService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
@RequiredArgsConstructor
public class BankController {

    private final BankService bankService;

    @GetMapping("/all")
    public List<BankDto> getAllBanks() {
        return bankService.getAllBanks();
    }
}