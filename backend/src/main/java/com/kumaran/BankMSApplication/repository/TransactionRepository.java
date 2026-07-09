package com.kumaran.BankMSApplication.repository;

import com.kumaran.BankMSApplication.entity.Account;
import com.kumaran.BankMSApplication.entity.Bank;
import com.kumaran.BankMSApplication.entity.Transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
SELECT t
FROM Transaction t
WHERE t.senderAccount = :senderAccount
   OR t.receiverAccount = :receiverAccount
ORDER BY t.transactionTime DESC
""")
    Page<Transaction> findBySenderAccountOrReceiverAccount(
            @Param("senderAccount") Account senderAccount,
            @Param("receiverAccount") Account receiverAccount,
            Pageable pageable
    );

    @Query("""
        SELECT COUNT(t)
        FROM Transaction t
        WHERE t.senderAccount.bank = :bank
        OR t.receiverAccount.bank = :bank
        """)
    Long countTransactionsByBank(
            @Param("bank") Bank bank);

    List<Transaction> findBySenderAccountOrReceiverAccountOrderByTransactionTimeDesc(
            Account senderAccount,
            Account receiverAccount
    );
}