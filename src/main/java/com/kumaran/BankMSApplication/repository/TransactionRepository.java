package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.Account;
import com.kumaran.BankMSApplication.entity.Bank;
import com.kumaran.BankMSApplication.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.senderAccount = :account
               OR t.receiverAccount = :account
            ORDER BY t.transactionTime DESC
            """)
    List<Transaction> getStatement(Account account);

    @Query("""
        SELECT COUNT(t)
        FROM Transaction t
        WHERE t.senderAccount.bank = :bank
        OR t.receiverAccount.bank = :bank
        """)
    Long countTransactionsByBank(
            @Param("bank") Bank bank);
}