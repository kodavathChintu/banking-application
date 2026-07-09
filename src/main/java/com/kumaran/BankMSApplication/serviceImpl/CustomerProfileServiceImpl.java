package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.ProfileResponseDto;
import com.kumaran.BankMSApplication.dto.UpdateProfileDto;
import com.kumaran.BankMSApplication.entity.*;
import com.kumaran.BankMSApplication.enums.AccountStatus;
import com.kumaran.BankMSApplication.enums.AccountType;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import com.kumaran.BankMSApplication.repository.*;
import com.kumaran.BankMSApplication.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerProfileServiceImpl
        implements CustomerProfileService {


    private final UserRepository userRepository;

    private final AccountOpeningRequestRepository requestRepository;

    private final CustomerRepository customerRepository;

    private final AccountRepository accountRepository;
    private final BankRepository bankRepository;

    @Override
    public ProfileResponseDto getProfile(Long userId, Long bankId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Bank bank = bankRepository.findById(bankId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found"));

        Customer customer = customerRepository
                .findByUserAndBank(user, bank)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        ProfileResponseDto dto = new ProfileResponseDto();

        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());

        // Customer Details
        dto.setCustomerId(customer.getCustomerId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setMobileNumber(customer.getMobileNumber());
        dto.setAddress(customer.getAddress());

        // Account Details
        List<Account> accounts =
                accountRepository.findByCustomerCustomerId(customer.getCustomerId());

        List<AccountDto> accountDtos = new ArrayList<>();

        for (Account account : accounts) {

            AccountDto acc = new AccountDto();

            acc.setAccountId(account.getAccountId());
            acc.setAccountNumber(account.getAccountNumber());
            acc.setBalance(account.getBalance());
            acc.setAccountType(account.getAccountType());
            acc.setAccountStatus(account.getAccountStatus());
            acc.setBankName(account.getBank().getBankName());
            acc.setIfscCode(account.getBank().getIfscCode());

            accountDtos.add(acc);
        }

        dto.setAccounts(accountDtos);

        // Application Status
        if (!accountDtos.isEmpty()) {

            // If account exists, it is already approved.
            dto.setRequestStatus("APPROVED");

        } else {

            AccountOpeningRequest request =
                    requestRepository.findTopByUserAndBankOrderByRequestIdDesc(user, bank);

            if (request != null) {
                dto.setRequestStatus(request.getRequestStatus().name());
            } else {
                dto.setRequestStatus("NOT_APPLIED");
            }
        }

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

    @Override
    public List<AccountDto> getAccounts(Long userId) {

        List<Customer> customers =
                customerRepository.findByUserUserId(userId);

        List<AccountDto> accountDtos = new ArrayList<>();

        for (Customer customer : customers) {

            List<Account> accounts =
                    accountRepository.findByCustomerCustomerId(
                            customer.getCustomerId());

            for (Account account : accounts) {

                AccountDto dto = new AccountDto();

                dto.setAccountId(account.getAccountId());
                dto.setAccountNumber(account.getAccountNumber());
                dto.setBalance(account.getBalance());
                dto.setAccountType(account.getAccountType());
                dto.setAccountStatus(account.getAccountStatus());
                dto.setBankName(account.getBank().getBankName());
                dto.setIfscCode(account.getBank().getIfscCode());

                accountDtos.add(dto);
            }
        }

        return accountDtos;
    }
}