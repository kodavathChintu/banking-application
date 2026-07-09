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
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String managerEmail = authentication.getName();

        BankManager manager =
                bankManagerRepository.findByUserEmail(managerEmail)
                        .orElseThrow(() ->
                                new RuntimeException("Manager not found"));

        Bank bank = manager.getBank();

        return requestRepository.findByBankAndRequestStatus(
                bank,
                RequestStatus.PENDING
        );
    }

    @Override
    public String approveRequest(Long requestId) {


        AccountOpeningRequest
        request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found"));

        if (request.getRequestStatus() ==
                RequestStatus.APPROVED) {

            return "Request already approved";
        }


        Customer existingCustomer =
                customerRepository.findByUserAndBank(request.getUser(), request.getBank())
                        .orElse(null);

        if (existingCustomer != null &&
                accountRepository.existsByCustomer(existingCustomer)) {

            request.setRequestStatus(RequestStatus.REJECTED);
            requestRepository.save(request);

            return "Customer already has an account. Duplicate request rejected.";
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
    public List<CustomerDto> getAllCustomers(String sort) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String managerEmail = authentication.getName();

        BankManager manager =
                bankManagerRepository.findByUserEmail(managerEmail)
                        .orElseThrow(() ->
                                new RuntimeException("Manager not found"));

        Bank bank = manager.getBank();

        Sort sorting;

        switch (sort) {

            case "oldest":
                sorting = Sort.by("createdAt").ascending();
                break;

            case "az":
                sorting = Sort.by("customerName").ascending();
                break;

            case "za":
                sorting = Sort.by("customerName").descending();
                break;

            case "newest":
            default:
                sorting = Sort.by("createdAt").descending();
                break;
        }

        return customerRepository.findAll(sorting)
                .stream()
                .filter(customer ->
                        customer.getBank().getBankId().equals(bank.getBankId()))
                .map(customer -> {

                    CustomerDto dto = new CustomerDto();

                    dto.setCustomerId(customer.getCustomerId());
                    dto.setCustomerName(customer.getCustomerName());
                    dto.setEmail(customer.getEmail());
                    dto.setMobileNumber(customer.getMobileNumber());
                    dto.setAddress(customer.getAddress());
                    dto.setStatus(customer.getStatus());
                    dto.setBankName(customer.getBank().getBankName());

                    return dto;

                })
                .toList();
    }

    @Override
    public CustomerDto getCustomerById(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found"));

        CustomerDto dto = new CustomerDto();

        dto.setCustomerId(customer.getCustomerId());
        dto.setCustomerName(customer.getCustomerName());
        dto.setEmail(customer.getEmail());
        dto.setMobileNumber(customer.getMobileNumber());
        dto.setAddress(customer.getAddress());
        dto.setStatus(customer.getStatus());
        dto.setBankName(customer.getBank().getBankName());

        return dto;
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

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String managerEmail = authentication.getName();

        BankManager manager = bankManagerRepository
                .findByUserEmail(managerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Manager not found"));

        Bank bank = manager.getBank();

        return accountRepository.findByBank(bank)
                .stream()
                .map(account -> {

                    AccountDto dto = new AccountDto();

                    dto.setAccountId(account.getAccountId());
                    dto.setAccountNumber(account.getAccountNumber());
                    dto.setBalance(account.getBalance());
                    dto.setAccountStatus(account.getAccountStatus());
                    dto.setAccountType(account.getAccountType());

                    dto.setCustomerName(account.getCustomer().getCustomerName());
                    dto.setBankName(account.getBank().getBankName());
                    dto.setIfscCode(account.getBank().getIfscCode());

                    return dto;
                })
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
    public AccountDto getAccountByNumber(String accountNumber) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String managerEmail = authentication.getName();

        BankManager manager = bankManagerRepository
                .findByUserEmail(managerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Manager not found"));

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        if (!account.getBank().getBankId().equals(manager.getBank().getBankId())) {
            throw new ResourceNotFoundException("Account not found");
        }

        AccountDto dto = new AccountDto();

        dto.setAccountId(account.getAccountId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setBalance(account.getBalance());
        dto.setAccountStatus(account.getAccountStatus());
        dto.setAccountType(account.getAccountType());
        dto.setCustomerName(account.getCustomer().getCustomerName());
        dto.setBankName(account.getBank().getBankName());
        dto.setIfscCode(account.getBank().getIfscCode());

        return dto;
    }

    @Override
    public DashboardDto getDashboardData() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String managerEmail = authentication.getName();

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
