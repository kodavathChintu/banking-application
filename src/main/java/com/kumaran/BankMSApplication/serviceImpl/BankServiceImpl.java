package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.BankDto;
import com.kumaran.BankMSApplication.repository.BankRepository;
import com.kumaran.BankMSApplication.service.BankService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankServiceImpl implements BankService {

    private final BankRepository bankRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<BankDto> getAllBanks() {

        return bankRepository.findAll()
                .stream()
                .map(bank ->
                        modelMapper.map(
                                bank,
                                BankDto.class
                        ))
                .toList();
    }
}