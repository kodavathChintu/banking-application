package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.AccountOpeningRequestDto;
import com.kumaran.BankMSApplication.entity.AccountOpeningRequest;
import com.kumaran.BankMSApplication.entity.Bank;
import com.kumaran.BankMSApplication.entity.Customer;
import com.kumaran.BankMSApplication.entity.User;
import com.kumaran.BankMSApplication.enums.CustomerStatus;
import com.kumaran.BankMSApplication.enums.RequestStatus;
import com.kumaran.BankMSApplication.exception.CustomerDeactivatedException;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import com.kumaran.BankMSApplication.repository.AccountOpeningRequestRepository;
import com.kumaran.BankMSApplication.repository.BankRepository;
import com.kumaran.BankMSApplication.repository.CustomerRepository;
import com.kumaran.BankMSApplication.repository.UserRepository;
import com.kumaran.BankMSApplication.service.AccountOpeningRequestService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountOpeningRequestServiceImpl
        implements AccountOpeningRequestService {

    private final AccountOpeningRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final BankRepository bankRepository;
    private final ModelMapper modelMapper;
    private final CustomerRepository customerRepository;

    @Override
    public String submitRequest(
            AccountOpeningRequestDto dto,
            String customerEmail) {

        User user = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        Bank bank = bankRepository
                .findById(dto.getBankId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Bank not found"));


        Customer existingCustomer =
                customerRepository
                        .findByUserAndBank(user, bank)
                        .orElse(null);

        if(existingCustomer != null){

            if(existingCustomer.getStatus()
                    == CustomerStatus.REJECTED){

                throw new CustomerDeactivatedException(
                        "You are deactivated in this bank. Cannot apply again."
                );
            }

            if(existingCustomer.getStatus()
                    == CustomerStatus.APPROVED){

                throw new RuntimeException(
                        "You already have an account in this bank."
                );
            }
        }
        AccountOpeningRequest request =
                modelMapper.map(dto, AccountOpeningRequest.class);

        request.setRequestId(null);

        request.setRequestStatus(RequestStatus.PENDING);
        request.setBank(bank);
        request.setUser(user);

        requestRepository.save(request);

        return "Account Opening Request Submitted Successfully";
    }
}