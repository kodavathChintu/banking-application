package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.AccountDto;
import com.kumaran.BankMSApplication.dto.CustomerDto;
import com.kumaran.BankMSApplication.dto.DashboardDto;
import com.kumaran.BankMSApplication.entity.*;
import com.kumaran.BankMSApplication.enums.AccountStatus;
import com.kumaran.BankMSApplication.enums.CustomerStatus;
import com.kumaran.BankMSApplication.enums.RequestStatus;
import com.kumaran.BankMSApplication.exception.AccountClosureException;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import com.kumaran.BankMSApplication.repository.*;
import com.kumaran.BankMSApplication.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final AccountOpeningRequestRepository requestRepository;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;
    private final BankManagerRepository bankManagerRepository;

    @Override
    public List<AccountOpeningRequest> getPendingRequests() {

        return requestRepository.findByRequestStatus(
                RequestStatus.PENDING
        );
    }

    @Override
    public String approveRequest(Long requestId) {

        AccountOpeningRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Request not found"));

        if (request.getRequestStatus() ==
                RequestStatus.APPROVED) {

            return "Request already approved";
        }

        Customer customer = new Customer();

        customer.setCustomerName(
                request.getCustomerName());

        customer.setMobileNumber(
                request.getMobileNumber());

        customer.setAddress(
                request.getAddress());

        customer.setEmail(
                request.getUser().getEmail());
        customer.setGender(request.getGender());

        customer.setStatus(
                CustomerStatus.APPROVED);

        customer.setBank(
                request.getBank());

        customer.setUser(
                request.getUser());

        customerRepository.save(customer);

        Account account = new Account();

        account.setAccountNumber(
                generateAccountNumber());

        account.setBalance(0.0);

        account.setOpeningDate(
                LocalDate.now());

        account.setAccountType(
                request.getAccountType());

        account.setAccountStatus(
                AccountStatus.ACTIVE);

        account.setCustomer(customer);

        account.setBank(
                request.getBank());

        accountRepository.save(account);

        request.setRequestStatus(
                RequestStatus.APPROVED);

        requestRepository.save(request);

        return "Account approved successfully";
    }

    private String generateAccountNumber() {

        return "ACC" + System.currentTimeMillis();
    }

    @Override
    public List<CustomerDto> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(customer ->
                        modelMapper.map(
                                customer,
                                CustomerDto.class))
                .toList();
    }

    @Override
    public CustomerDto getCustomerById(Long customerId) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        return modelMapper.map(
                customer,
                CustomerDto.class
        );
    }

    @Override
    public String deactivateCustomer(Long customerId) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        customer.setStatus(
                CustomerStatus.REJECTED);

        customerRepository.save(customer);

        return "Customer rejected successfully";
    }

    @Override
    public String activateCustomer(Long customerId) {

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        customer.setStatus(
                CustomerStatus.APPROVED);

        customerRepository.save(customer);

        return "Customer approved successfully";
    }

    @Override
    public List<AccountDto> getAllAccounts() {

        return accountRepository.findAll()
                .stream()
                .map(account ->
                        modelMapper.map(
                                account,
                                AccountDto.class))
                .toList();
    }

    @Override
    public String lockAccount(Long accountId) {

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        account.setAccountStatus(
                AccountStatus.INACTIVE);

        accountRepository.save(account);

        return "Account deactivated successfully";
    }

    @Override
    public String unlockAccount(Long accountId) {

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        account.setAccountStatus(
                AccountStatus.ACTIVE);

        accountRepository.save(account);

        return "Account activated successfully";
    }

    @Override
    public String closeAccount(Long accountId) {

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        if (account.getBalance() > 0) {

            throw new AccountClosureException(
                    "Withdraw remaining balance before closing account");
        }

        account.setAccountStatus(
                AccountStatus.CLOSED);

        accountRepository.save(account);

        return "Account closed successfully";
    }

    @Override
    public AccountDto getAccountByNumber(
            String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        return modelMapper.map(
                account,
                AccountDto.class
        );
    }

    @Override
    public DashboardDto getDashboardData(
            String managerEmail) {

        BankManager manager =
                bankManagerRepository
                        .findByUserEmail(managerEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager Not Found"));

        Bank bank = manager.getBank();

        Long totalCustomers =
                customerRepository.countByBank(bank);

        Long totalAccounts =
                accountRepository.countByBank(bank);

        Long totalTransactions =
                transactionRepository
                        .countTransactionsByBank(bank);

        Long totalPendingRequests =
                requestRepository
                        .countByBankAndRequestStatus(
                                bank,
                                RequestStatus.PENDING
                        );

        return new DashboardDto(
                totalCustomers,
                totalAccounts,
                totalTransactions,
                totalPendingRequests
        );
    }


}
