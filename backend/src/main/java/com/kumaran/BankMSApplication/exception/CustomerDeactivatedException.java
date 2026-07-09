package com.kumaran.BankMSApplication.exception;

public class CustomerDeactivatedException
        extends RuntimeException {

    public CustomerDeactivatedException(
            String message) {

        super(message);
    }
}