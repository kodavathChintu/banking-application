package com.kumaran.BankMSApplication.serviceImpl;

import com.kumaran.BankMSApplication.dto.TransactionDto;
import com.kumaran.BankMSApplication.dto.TransactionRequestDto;
import com.kumaran.BankMSApplication.dto.TransferRequestDto;
import com.kumaran.BankMSApplication.entity.Account;
import com.kumaran.BankMSApplication.entity.Transaction;
import com.kumaran.BankMSApplication.enums.AccountStatus;
import com.kumaran.BankMSApplication.enums.CustomerStatus;
import com.kumaran.BankMSApplication.enums.TransactionType;
import com.kumaran.BankMSApplication.exception.InsufficientBalanceException;
import com.kumaran.BankMSApplication.exception.InvalidOperationException;
import com.kumaran.BankMSApplication.exception.ResourceNotFoundException;
import com.kumaran.BankMSApplication.repository.AccountRepository;
import com.kumaran.BankMSApplication.repository.TransactionRepository;
import com.kumaran.BankMSApplication.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {


    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;

    @Override
    public String deposit(TransactionRequestDto dto) {

        Account account = accountRepository
                .findByAccountNumber(dto.getAccountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        if (account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new InvalidOperationException(
                    "Account is inactive");
        }

        if (account.getCustomer().getStatus()
                != CustomerStatus.APPROVED) {

            throw new InvalidOperationException(
                    "Customer is not approved");
        }

        account.setBalance(
                account.getBalance() + dto.getAmount());

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAmount(dto.getAmount());
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setRemarks("Cash Deposit");
        transaction.setReceiverAccount(account);

        transactionRepository.save(transaction);

        return "Amount deposited successfully";
    }

    @Override
    public String withdraw(TransactionRequestDto dto) {

        Account account = accountRepository
                .findByAccountNumber(dto.getAccountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        if (account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new InvalidOperationException(
                    "Account is inactive");
        }

        if (account.getCustomer().getStatus()
                != CustomerStatus.APPROVED) {

            throw new InvalidOperationException(
                    "Customer is not approved");
        }

        if (account.getBalance() < dto.getAmount()) {

            throw new InsufficientBalanceException(
                    "Insufficient balance. Available balance: "
                            + account.getBalance());
        }

        account.setBalance(
                account.getBalance() - dto.getAmount());

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAmount(dto.getAmount());
        transaction.setTransactionType(TransactionType.WITHDRAW);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setRemarks("Cash Withdrawal");
        transaction.setSenderAccount(account);

        transactionRepository.save(transaction);

        return "Amount withdrawn successfully";
    }

    @Override
    public String transfer(TransferRequestDto dto) {

        Account sender = accountRepository
                .findByAccountNumber(
                        dto.getSenderAccountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Sender account not found"));

        Account receiver = accountRepository
                .findByAccountNumber(
                        dto.getReceiverAccountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Receiver account not found"));

        if (sender.getAccountStatus()
                != AccountStatus.ACTIVE) {

            throw new InvalidOperationException(
                    "Sender account is inactive");
        }

        if (receiver.getAccountStatus()
                != AccountStatus.ACTIVE) {

            throw new InvalidOperationException(
                    "Receiver account is inactive");
        }

        if (sender.getCustomer().getStatus()
                != CustomerStatus.APPROVED) {

            throw new InvalidOperationException(
                    "Customer is not approved");
        }

        if (dto.getAmount() > 50000) {

            throw new InvalidOperationException(
                    "Daily transfer limit exceeded");
        }

        if (sender.getBalance() < dto.getAmount()) {

            throw new InsufficientBalanceException(
                    "Insufficient balance. Available balance: "
                            + sender.getBalance());
        }

        sender.setBalance(
                sender.getBalance() - dto.getAmount());

        receiver.setBalance(
                receiver.getBalance() + dto.getAmount());

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction transaction = new Transaction();

        transaction.setAmount(dto.getAmount());
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setRemarks("Account Transfer");
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        transactionRepository.save(transaction);

        return "Transfer successful";
    }

    @Override
    public Double checkBalance(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        return account.getBalance();
    }

    @Override
    public List<TransactionDto> getStatement(
            String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found"));

        return transactionRepository
                .getStatement(account)
                .stream()
                .map(transaction ->
                        modelMapper.map(
                                transaction,
                                TransactionDto.class))
                .toList();
    }


}
