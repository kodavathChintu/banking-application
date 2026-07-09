package com.kumaran.BankMSApplication.exception;

public class AccountClosureException extends RuntimeException {

    public AccountClosureException(String message) {
        super(message);
    }
}